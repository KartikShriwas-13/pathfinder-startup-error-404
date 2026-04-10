import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      }
    });

    loadCourses();
  }, [navigate]);

  const loadCourses = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setCourses(data);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      General: "bg-blue-500/10 text-blue-500",
      Agriculture: "bg-green-500/10 text-green-500",
      Creative: "bg-purple-500/10 text-purple-500",
      "E-commerce": "bg-orange-500/10 text-orange-500",
    };
    return colors[category] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Training Courses</h1>
          </div>
        </div>
      </header> */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gradient hidden sm:block">Training Courses</h1>
          </div>
          <Button onClick={() => navigate("/mentorship")} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Get Expert Guidance
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Learn Business Skills</h2>
          <p className="text-muted-foreground">
            Master the fundamentals and specialized skills to grow your startup
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="hover:border-primary transition-all cursor-pointer animate-slide-up"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div
                className="h-48 bg-cover bg-center rounded-t-lg"
                style={{ backgroundImage: `url(${course.thumbnail_url})` }}
              />
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(course.category)}>
                    {course.category}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.chapters.length} Chapters
                </div>
                  <Button variant="ghost" size="sm">
                    Start Course →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Courses;