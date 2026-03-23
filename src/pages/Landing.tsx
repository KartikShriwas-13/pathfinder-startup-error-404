import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Rocket, TrendingUp, Users, BookOpen, Target, Lightbulb } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto animate-slide-up">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl animate-glow">
                <Rocket className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
              Turn Your Startup Ideas Into Reality
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
              AI-powered guidance, training, and resources to help you validate, plan, and launch your business
            </p>
            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-6 animate-glow">
                  Get Started Free
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Welcome to Startup Launchpad</DialogTitle>
                  <DialogDescription>
                    Create your account to start validating your startup ideas
                  </DialogDescription>
                </DialogHeader>
                <AuthForm onSuccess={() => {
                  setIsAuthOpen(false);
                  navigate("/dashboard");
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Everything You Need to Launch</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Lightbulb, title: "AI Idea Validation", desc: "Get instant feedback on profitability, uniqueness, and market potential" },
            { icon: Target, title: "Business Roadmap", desc: "Step-by-step guidance from planning to launch" },
            { icon: Users, title: "Supplier Network", desc: "Connect with suppliers and resources in your area" },
            { icon: BookOpen, title: "Expert Training", desc: "Learn from comprehensive courses on business fundamentals" },
            { icon: TrendingUp, title: "Market Insights", desc: "Understand competition, demand, and trends" },
            { icon: Rocket, title: "Government Schemes", desc: "Access funding and support programs" }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-primary transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join thousands of aspiring entrepreneurs</p>
          <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Launch Your Startup Today
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Welcome to Startup Launchpad</DialogTitle>
                <DialogDescription>
                  Create your account to start validating your startup ideas
                </DialogDescription>
              </DialogHeader>
              <AuthForm onSuccess={() => {
                setIsAuthOpen(false);
                navigate("/dashboard");
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Landing;