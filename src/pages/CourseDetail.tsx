import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, Circle, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
        loadCourse();
        loadProgress(session.user.id);
      }
    });
  }, [id, navigate]);

  const loadCourse = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();
    
    if (data) setCourse(data);
  };

  const loadProgress = async (userId: string) => {
    const { data } = await supabase
      .from("user_course_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", id)
      .single();
    
    if (data) setProgress(data);
  };

  const toggleChapter = async (chapterIndex: number) => {
    if (!user) return;

    const completedChapters = progress?.completed_chapters || [];
    const isCompleted = completedChapters.includes(chapterIndex);
    
    const newCompleted = isCompleted
      ? completedChapters.filter((i: number) => i !== chapterIndex)
      : [...completedChapters, chapterIndex];

    if (progress) {
      await supabase
        .from("user_course_progress")
        .update({ completed_chapters: newCompleted })
        .eq("id", progress.id);
    } else {
      await supabase
        .from("user_course_progress")
        .insert({
          user_id: user.id,
          course_id: id,
          completed_chapters: newCompleted,
        });
    }

    loadProgress(user.id);
    toast({
      title: isCompleted ? "Chapter marked incomplete" : "Chapter completed!",
    });
  };

  if (!course) return <div>Loading...</div>;

  const chapters = course.chapters;
  const completedChapters = progress?.completed_chapters || [];
  const progressPercentage = (completedChapters.length / chapters.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/courses")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-muted-foreground text-lg">{course.description}</p>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{completedChapters.length} / {chapters.length} chapters</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        {/* Video Player Placeholder */}
        <Card className="mb-8 bg-muted">
          <CardContent className="p-0">
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="text-center">
                <Award className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-semibold">Course Video</p>
                <p className="text-sm text-muted-foreground">Complete all chapters to get your certificate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapters */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold mb-4">Course Chapters</h2>
          {chapters.map((chapter: string, index: number) => {
            const isCompleted = completedChapters.includes(index);
            return (
              <Card
                key={index}
                className={`cursor-pointer transition-all hover:border-primary ${
                  isCompleted ? "border-green-500/50 bg-green-500/5" : ""
                }`}
                onClick={() => toggleChapter(index)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">Chapter {index + 1}</p>
                      <p className="text-sm text-muted-foreground">{chapter}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {progressPercentage === 100 && (
          <Card className="mt-8 bg-gradient-to-r from-primary/20 to-accent/20 border-primary">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-muted-foreground mb-4">
                You've completed all chapters. Take the exam to get your certificate!
              </p>
              <Button size="lg">
                Take Exam
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CourseDetail;