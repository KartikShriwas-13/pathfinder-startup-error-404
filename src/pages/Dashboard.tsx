// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2, LogOut, BookOpen, Sparkles } from "lucide-react";
// import { ValidationResults } from "@/components/dashboard/ValidationResults";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [user, setUser] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [idea, setIdea] = useState("");
//   const [location, setLocation] = useState("");
//   const [budget, setBudget] = useState("");
//   const [validationResult, setValidationResult] = useState<any>(null);
//   const [history, setHistory] = useState<any[]>([]);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (!session) {
//         navigate("/");
//       } else {
//         setUser(session.user);
//         loadHistory(session.user.id);
//       }
//     });

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (!session) {
//         navigate("/");
//       } else {
//         setUser(session.user);
//         loadHistory(session.user.id);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [navigate]);

//   const loadHistory = async (userId: string) => {
//     const { data } = await supabase
//       .from("startup_ideas")
//       .select("*")
//       .eq("user_id", userId)
//       .order("created_at", { ascending: false })
//       .limit(3);
    
//     if (data) {
//       setHistory(data);
//     }
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate("/");
//   };

//   const handleValidate = async () => {
//     if (!idea || !location || !budget) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase.functions.invoke("validate-idea", {
//         body: { idea, location, budget: parseFloat(budget) },
//       });

//       if (error) throw error;

//       // Save to database
//       await supabase.from("startup_ideas").insert({
//         user_id: user.id,
//         idea_text: idea,
//         location,
//         budget: parseFloat(budget),
//         validation_result: data,
//       });

//       setValidationResult(data);
//       loadHistory(user.id);
//       toast({
//         title: "Analysis Complete!",
//         description: "Your startup idea has been validated",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b border-border bg-card">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gradient">Startup Launchpad</h1>
//           <div className="flex gap-4 items-center">
//             <Button variant="outline" onClick={() => navigate("/courses")}>
//               <BookOpen className="mr-2 h-4 w-4" />
//               Courses
//             </Button>
//             <Button variant="ghost" onClick={handleLogout}>
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto space-y-8">
//           <Card className="animate-slide-up">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Sparkles className="h-6 w-6 text-primary" />
//                 AI Startup Idea Validator
//               </CardTitle>
//               <CardDescription>
//                 Get instant AI-powered insights about your business idea
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block">Your Startup Idea</label>
//                 <Textarea
//                   placeholder="Describe your startup idea (e.g., 'T-shirt printing business in Amravati')"
//                   value={idea}
//                   onChange={(e) => setIdea(e.target.value)}
//                   className="min-h-[100px]"
//                 />
//               </div>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-2 block">Location</label>
//                   <Input
//                     placeholder="e.g., Amravati, Maharashtra"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-2 block">Budget (₹)</label>
//                   <Input
//                     type="number"
//                     placeholder="e.g., 10000"
//                     value={budget}
//                     onChange={(e) => setBudget(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <Button
//                 onClick={handleValidate}
//                 disabled={isLoading}
//                 className="w-full"
//                 size="lg"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Analyzing...
//                   </>
//                 ) : (
//                   "Validate My Idea"
//                 )}
//               </Button>
//             </CardContent>
//           </Card>

//           {history.length > 0 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Recent Validations</h2>
//               <div className="grid md:grid-cols-3 gap-4">
//                 {history.map((item) => (
//                   <Card 
//                     key={item.id} 
//                     className="cursor-pointer hover:border-primary/50 transition-colors bg-secondary/50"
//                     onClick={() => setValidationResult(item.validation_result)}
//                   >
//                     <CardHeader>
//                       <CardTitle className="text-lg line-clamp-2">{item.idea_text}</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Location:</span>
//                           <span className="font-medium">{item.location}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Budget:</span>
//                           <span className="font-medium">₹{item.budget}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-muted-foreground">Status:</span>
//                           {item.validation_result?.profitable ? (
//                             <span className="text-green-500 font-medium">Profitable</span>
//                           ) : (
//                             <span className="text-yellow-500 font-medium">Refine</span>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}

//           {validationResult && <ValidationResults result={validationResult} />}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, BookOpen, Sparkles } from "lucide-react";
import { ValidationResults } from "@/components/dashboard/ValidationResults";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [idea, setIdea] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
        loadHistory(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
        loadHistory(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
    await supabase.auth.signOut();
    navigate("/");
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
      // ✅ IMPORTANT FIX: get session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("validate-idea", {
        body: { idea, location, budget: parseFloat(budget) },
        headers: {
          Authorization: `Bearer ${session.access_token}`, // ✅ FIX
        },
      });

      if (error) throw error;

      // Save to database
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient">Startup Launchpad</h1>
          <div className="flex gap-4 items-center">
            <Button variant="outline" onClick={() => navigate("/courses")}>
              <BookOpen className="mr-2 h-4 w-4" />
              Courses
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                AI Startup Idea Validator
              </CardTitle>
              <CardDescription>
                Get instant AI-powered insights about your business idea
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Startup Idea</label>
                <Textarea
                  placeholder="Describe your startup idea (e.g., 'T-shirt printing business in Amravati')"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="e.g., Amravati, Maharashtra"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget (₹)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 10000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleValidate}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
              <h2 className="text-2xl font-bold">Recent Validations</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {history.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors bg-secondary/50"
                    onClick={() => setValidationResult(item.validation_result)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{item.idea_text}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{item.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium">₹{item.budget}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Status:</span>
                          {item.validation_result?.profitable ? (
                            <span className="text-green-500 font-medium">Profitable</span>
                          ) : (
                            <span className="text-yellow-500 font-medium">Refine</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {validationResult && <ValidationResults result={validationResult} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;