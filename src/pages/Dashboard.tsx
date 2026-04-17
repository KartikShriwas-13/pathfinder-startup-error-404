import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, BookOpen, Sparkles, Users, UserCircle } from "lucide-react";
import { ValidationResults } from "@/components/dashboard/ValidationResults";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null); // State for extended profile data
  const [isLoading, setIsLoading] = useState(false);
  const [idea, setIdea] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
        loadHistory(session.user.id);
        fetchUserProfile(session.user.id);
      }
    };

    fetchSessionAndData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
        loadHistory(session.user.id);
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch the extended profile data (name, mobile) from the database
  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (data) {
      setUserProfile(data);
    }
  };

  const loadHistory = async (userId: string) => {
    const { data } = await supabase
      .from("startup_ideas")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (data) {
      setHistory(data);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      window.location.href = "/";
    }
  };

  const handleValidate = async () => {
    if (!idea || !location || !budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("validate-idea", {
        body: { idea, location, budget: parseFloat(budget) },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      await supabase.from("startup_ideas").insert({
        user_id: user.id,
        idea_text: idea,
        location,
        budget: parseFloat(budget),
        validation_result: data,
      });

      setValidationResult(data);
      loadHistory(user.id);

      toast({
        title: "Analysis Complete!",
        description: "Your startup idea has been validated",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (item: any) => {
    setValidationResult(item.validation_result);
    setLocation(item.location);
    setIdea(item.idea_text);
    setBudget(item.budget.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gradient hidden sm:block">Startup Launchpad</h1>
          <Sparkles className="h-6 w-6 text-primary sm:hidden" />
          
          <div className="flex gap-1 sm:gap-2 items-center">
            <Button variant="default" className="bg-primary px-3 sm:px-4" onClick={() => navigate("/mentorship")}>
              <Users className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Expert Guidance</span>
            </Button>
            
            <Button variant="outline" className="px-3 sm:px-4" onClick={() => navigate("/courses")}>
              <BookOpen className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </Button>

            {/* ✅ NEW: Profile Dialog Box */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="px-3 sm:px-4">
                  <UserCircle className="sm:mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <UserCircle className="h-6 w-6 text-primary" />
                    My Profile
                  </DialogTitle>
                  <DialogDescription>
                    Your personal founder details and account information.
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-secondary/50 p-4 rounded-lg space-y-4 mt-2 border border-border/50">
                  <div className="grid grid-cols-3 items-center border-b border-border/50 pb-2">
                    <span className="text-sm font-medium text-muted-foreground col-span-1">Full Name</span>
                    <span className="font-semibold col-span-2 text-right">{userProfile?.full_name || "Not Provided"}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center border-b border-border/50 pb-2">
                    <span className="text-sm font-medium text-muted-foreground col-span-1">Email Address</span>
                    <span className="font-semibold col-span-2 text-right truncate">{user?.email}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center pb-1">
                    <span className="text-sm font-medium text-muted-foreground col-span-1">Mobile Number</span>
                    <span className="font-semibold col-span-2 text-right">{userProfile?.mobile || "Not Provided"}</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" className="px-3 sm:px-4" onClick={handleLogout}>
              <LogOut className="sm:mr-2 h-5 w-5 sm:h-4 sm:w-4 text-red-500 sm:text-foreground" />
              <span className="hidden sm:inline text-red-500 sm:text-foreground">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                AI Startup Idea Validator
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Get instant AI-powered insights about your business idea
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Startup Idea</label>
                <Textarea
                  placeholder="Describe your startup idea (e.g., 'T-shirt printing business in Amravati')"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="min-h-[100px] md:min-h-[120px] text-base"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="e.g., Amravati, Maharashtra"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget (₹)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 10000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="text-base"
                  />
                </div>
              </div>

              <Button
                onClick={handleValidate}
                disabled={isLoading}
                className="w-full h-12 text-md font-medium mt-2"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Validate My Idea"
                )}
              </Button>
            </CardContent>
          </Card>

          {history.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold">Recent Validations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {history.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors bg-secondary/50 active:scale-95"
                    onClick={() => handleHistoryClick(item)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base md:text-lg line-clamp-2 leading-tight">{item.idea_text}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs md:text-sm">
                        <div className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium text-right truncate max-w-[120px]">{item.location}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium">₹{item.budget}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-muted-foreground">Status:</span>
                          {item.validation_result?.profitable ? (
                            <span className="text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded-full">Profitable</span>
                          ) : (
                            <span className="text-yellow-500 font-medium bg-yellow-500/10 px-2 py-0.5 rounded-full">Refine</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {validationResult && <ValidationResults result={validationResult} location={location} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;