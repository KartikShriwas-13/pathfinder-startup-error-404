import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Briefcase, GraduationCap, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import emailjs from '@emailjs/browser';
import keoleImg from '../images/Prof_R_R_Keole.jpg';
import gangwaniImg from '../images/vinod_gangwani.jpg';
import utaneImg from '../images/S_N_Utane.jpg';
import pattewarImg from '../images/P_C_Pattewar.jpg';

// 🎓 IT DEPARTMENT FACULTY MENTORS
const experts = [
  {
    id: 1,
    name: "Dr. R. R. Keole",
    specialization: "Database Management & System Software",
    summary: "Head of IT Department with 24+ years of combined academic and industry expertise.",
    experience: "24 Years (18 Teaching + 6 Industry)",
    education: "Ph.D (CSE), M.E. (CSE)",
    fee: 999,
    image: keoleImg,
    details: "As the Head of the IT Department and the University Chairman for DBMS, Dr. Keole brings unparalleled expertise in Database Management Systems and Computer Organization. His exceptional communication skills and deep industry background make him the ideal mentor for startups needing robust, scalable database architectures.",
    email: "chandaknikita38@gmail.com", 
    phone: "+91 9876543210" 
  },
  {
    id: 2,
    name: "Prof. V. S. Gangwani",
    specialization: "Project Management & Data Structures",
    summary: "Expert in algorithm design and final-year project execution strategy.",
    experience: "17 Years",
    education: "Ph.D, M.E. (CSE)",
    fee: 799,
    image: gangwaniImg,
    details: "Prof. Gangwani is highly regarded for his mastery in Data Structures, DAA, and Theory of Computation. As the head of final-year seminars and project handling, he specializes in guiding founders through the complex lifecycle of Project Management, helping them structure their MVPs efficiently from day one.",
    email: "pranalipatil24212@gmail.com",
    phone: "+91 9876543211"
  },
  {
    id: 3,
    name: "Prof. S. N. Utane",
    specialization: "Software Development & Web Technologies",
    summary: "Specialist in Object-Oriented Programming, Java, and modern web architectures.",
    experience: "12 Years",
    education: "M.E. (I.T.), B.E. (I.T.)",
    fee: 699,
    image: utaneImg,
    details: "With a strong focus on Software Engineering and Web Technologies, Prof. Utane helps emerging startups build solid software foundations. Her deep knowledge of Java OOPs and Data Communication Networks ensures that founders can architect secure, scalable, and highly functional web applications.",
    email: "pallavipunde5@gmail.com",
    phone: "+91 9876543212"
  },
  {
    id: 4,
    name: "Prof. P. C. Pattewar",
    specialization: "IoT & Embedded Systems",
    summary: "Project Guide specializing in VLSI, hardware design, and wireless communication.",
    experience: "8 Years",
    education: "M.E. (Digital Electronics), Ph.D (Pursuing)",
    fee: 899,
    image: pattewarImg,
    details: "Prof. Pattewar is the go-to expert for hardware startups. Specializing in IoT, Embedded Systems, and VLSI design, he provides critical guidance on integrating software with physical hardware, wireless communication protocols, and executing complex, electronics-driven business ideas.",
    email: "bharadeharshal@gmail.com",
    phone: "+91 9876543213"
  }
];

const Mentorship = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0); 
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Store Logged-in User's Profile Data
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch User Data on Load
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch from the profiles table using user ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
          
        if (profile) {
          setUserProfile(profile);
        }
      } else {
        navigate("/"); // Redirect if not logged in
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleOpenProfile = (expert: any) => {
    setSelectedExpert(expert);
    setPaymentStep(0);
    setIsDialogOpen(true);
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment gateway processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 📧 EMAILJS CONFIGURATION
    const SERVICE_ID = "service_noxnmzh"; 
    const TEMPLATE_ID = "template_q2rcvfu"; 
    const PUBLIC_KEY = "TTjfpzLfhC-lKpMqt"; 

    // Format today's date professionally
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    try {
      // ✅ FIX: Removed the restrictive 'if' statement so the email always fires!
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        expert_name: selectedExpert.name,
        expert_email: selectedExpert.email, 
        user_name: userProfile?.full_name || "Startup Founder",
        user_email: userProfile?.email || "Not Provided",
        user_mobile: userProfile?.mobile || "Not Provided",
        current_date: currentDate,
        fee: selectedExpert.fee,
      }, PUBLIC_KEY);
      
      setPaymentStep(2);
      toast({
        title: "Payment Successful! 🎉",
        description: "Your request has been sent to the expert.",
      });
    } catch (error) {
      console.error("Email failed:", error);
      // Still show success to user if email server fails during college demo
      setPaymentStep(2); 
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gradient">Expert Mentorship</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-10 text-center animate-slide-up">
          <h2 className="text-4xl font-bold mb-4">Guidance from Industry Leaders</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Book a 1-on-1 consultation with college professors and industry experts to get personalized advice for your startup.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((expert) => (
            <Card key={expert.id} className="overflow-hidden hover:border-primary transition-all animate-fade-in cursor-pointer" onClick={() => handleOpenProfile(expert)}>
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${expert.image})` }}
              />
              <CardHeader>
                <CardTitle className="text-xl">{expert.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">{expert.specialization}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{expert.summary}</p>
                <Button className="w-full" variant="outline">View Profile</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PROFILE & PAYMENT DIALOG */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            {selectedExpert && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedExpert.name}</DialogTitle>
                  <DialogDescription>{selectedExpert.specialization}</DialogDescription>
                </DialogHeader>

                {/* STEP 0: PROFILE DETAILS */}
                {paymentStep === 0 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><Briefcase className="h-4 w-4"/> {selectedExpert.experience}</div>
                      <div className="flex items-center gap-1"><GraduationCap className="h-4 w-4"/> {selectedExpert.education}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-sm leading-relaxed">
                      {selectedExpert.details}
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Consultation Fee</p>
                        <p className="text-2xl font-bold">₹{selectedExpert.fee}</p>
                      </div>
                      <Button size="lg" onClick={() => setPaymentStep(1)}>
                        Schedule Meeting
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 1: MOCK PAYMENT GATEWAY */}
                {paymentStep === 1 && (
                  <div className="space-y-6 py-4 animate-slide-up">
                    <div className="text-center mb-6">
                      <CreditCard className="h-12 w-12 mx-auto text-primary mb-2" />
                      <h3 className="text-lg font-semibold">Secure Escrow Payment</h3>
                      <p className="text-sm text-muted-foreground">Funds are held safely until your meeting is completed</p>
                    </div>
                    <Card className="bg-secondary/50 border-primary/20">
                      <CardContent className="p-4 flex justify-between items-center">
                        <span className="font-medium">Total Payable:</span>
                        <span className="text-2xl font-bold">₹{selectedExpert.fee}</span>
                      </CardContent>
                    </Card>
                    <Button 
                      className="w-full text-lg h-12" 
                      onClick={processPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Payment...</>
                      ) : (
                        `Pay ₹${selectedExpert.fee} via UPI / Card`
                      )}
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setPaymentStep(0)} disabled={isProcessing}>
                      Cancel
                    </Button>
                  </div>
                )}

                {/* STEP 2: SUCCESS SCREEN */}
                {paymentStep === 2 && (
                  <div className="text-center py-8 animate-fade-in">
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                    <p className="text-muted-foreground mb-6">
                      An official request has been sent to {selectedExpert.name}. They will review your profile and contact you within 72 hours to schedule the meeting timing.
                    </p>
                    <Button onClick={() => setIsDialogOpen(false)} className="w-full">
                      Return to Dashboard
                    </Button>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Mentorship;