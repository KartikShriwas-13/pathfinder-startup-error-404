// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { ArrowLeft, CheckCircle, Circle, Award } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const CourseDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [course, setCourse] = useState<any>(null);
//   const [progress, setProgress] = useState<any>(null);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (!session) {
//         navigate("/");
//       } else {
//         setUser(session.user);
//         loadCourse();
//         loadProgress(session.user.id);
//       }
//     });
//   }, [id, navigate]);

//   const loadCourse = async () => {
//     const { data } = await supabase
//       .from("courses")
//       .select("*")
//       .eq("id", id)
//       .single();
    
//     if (data) setCourse(data);
//   };

//   const loadProgress = async (userId: string) => {
//     const { data } = await supabase
//       .from("user_course_progress")
//       .select("*")
//       .eq("user_id", userId)
//       .eq("course_id", id)
//       .single();
    
//     if (data) setProgress(data);
//   };

//   const toggleChapter = async (chapterIndex: number) => {
//     if (!user) return;

//     const completedChapters = progress?.completed_chapters || [];
//     const isCompleted = completedChapters.includes(chapterIndex);
    
//     const newCompleted = isCompleted
//       ? completedChapters.filter((i: number) => i !== chapterIndex)
//       : [...completedChapters, chapterIndex];

//     if (progress) {
//       await supabase
//         .from("user_course_progress")
//         .update({ completed_chapters: newCompleted })
//         .eq("id", progress.id);
//     } else {
//       await supabase
//         .from("user_course_progress")
//         .insert({
//           user_id: user.id,
//           course_id: id,
//           completed_chapters: newCompleted,
//         });
//     }

//     loadProgress(user.id);
//     toast({
//       title: isCompleted ? "Chapter marked incomplete" : "Chapter completed!",
//     });
//   };

//   if (!course) return <div>Loading...</div>;

//   const chapters = course.chapters;
//   const completedChapters = progress?.completed_chapters || [];
//   const progressPercentage = (completedChapters.length / chapters.length) * 100;

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b border-border bg-card">
//         <div className="container mx-auto px-4 py-4">
//           <Button variant="ghost" onClick={() => navigate("/courses")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Courses
//           </Button>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8 max-w-4xl">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
//           <p className="text-muted-foreground text-lg">{course.description}</p>
          
//           <div className="mt-6">
//             <div className="flex justify-between text-sm mb-2">
//               <span>Progress</span>
//               <span>{completedChapters.length} / {chapters.length} chapters</span>
//             </div>
//             <Progress value={progressPercentage} className="h-3" />
//           </div>
//         </div>

//         {/* Video Player Placeholder */}
//         <Card className="mb-8 bg-muted">
//           <CardContent className="p-0">
//             <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
//               <div className="text-center">
//                 <Award className="h-16 w-16 mx-auto mb-4 text-primary" />
//                 <p className="text-lg font-semibold">Course Video</p>
//                 <p className="text-sm text-muted-foreground">Complete all chapters to get your certificate</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Chapters */}
//         <div className="space-y-3">
//           <h2 className="text-2xl font-bold mb-4">Course Chapters</h2>
//           {chapters.map((chapter: string, index: number) => {
//             const isCompleted = completedChapters.includes(index);
//             return (
//               <Card
//                 key={index}
//                 className={`cursor-pointer transition-all hover:border-primary ${
//                   isCompleted ? "border-green-500/50 bg-green-500/5" : ""
//                 }`}
//                 onClick={() => toggleChapter(index)}
//               >
//                 <CardContent className="flex items-center justify-between p-4">
//                   <div className="flex items-center gap-4">
//                     {isCompleted ? (
//                       <CheckCircle className="h-6 w-6 text-green-500" />
//                     ) : (
//                       <Circle className="h-6 w-6 text-muted-foreground" />
//                     )}
//                     <div>
//                       <p className="font-medium">Chapter {index + 1}</p>
//                       <p className="text-sm text-muted-foreground">{chapter}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {progressPercentage === 100 && (
//           <Card className="mt-8 bg-gradient-to-r from-primary/20 to-accent/20 border-primary">
//             <CardContent className="p-6 text-center">
//               <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
//               <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
//               <p className="text-muted-foreground mb-4">
//                 You've completed all chapters. Take the exam to get your certificate!
//               </p>
//               <Button size="lg">
//                 Take Exam
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </main>
//     </div>
//   );
// };

// export default CourseDetail;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, Circle, Award, PlayCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  // 🔥 New State for Video and Quiz
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 🎓 DEMO DATA: Only activates for "Business Communication Basics"
  const isDemoCourse = course?.title === "Business Communication Basics";
  
  const demoVideos = [
    "https://www.youtube.com/embed/BitO6ccFPws", // Ch 1: Intro to Business Communication
    "https://www.youtube.com/embed/yOxZiSG-ic0", // Ch 2: Written Communication
    "https://www.youtube.com/embed/RRng9opRV98", // Ch 3: Verbal Communication
    "https://www.youtube.com/embed/CdV_CCgFGQI", // Ch 4: Digital Communication
    "https://www.youtube.com/embed/ADJAcyTq1us", // Ch 5: Presentation Skills
  ];

  const demoQuiz = [
    { q: "What is the primary goal of business communication?", options: ["Creating confusion", "Sharing clear information", "Entertainment", "None of the above"], ans: 1 },
    { q: "Which of the following is an example of written communication?", options: ["Face-to-face meeting", "Phone call", "Professional Email", "Hand gestures"], ans: 2 },
    { q: "What does non-verbal communication include?", options: ["Body language and eye contact", "Spoken words only", "Written text", "Vocabulary and grammar"], ans: 0 },
    { q: "In digital email communication, what does 'BCC' stand for?", options: ["Blind Carbon Copy", "Blank Carbon Copy", "Basic Carbon Copy", "Behind Carbon Copy"], ans: 0 },
    { q: "What is crucial for a successful presentation?", options: ["Reading directly from slides", "Avoiding eye contact", "Engaging the audience", "Speaking as fast as possible"], ans: 2 }
  ];

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

  // 🔥 Handler to play video
  const handlePlayVideo = (index: number) => {
    if (isDemoCourse && demoVideos[index]) {
      setActiveVideo(demoVideos[index]);
    } else {
      toast({ title: "Video coming soon!", description: "This is a placeholder for non-demo courses." });
    }
  };

  // 🔥 Handler for Quiz
  const handleQuizSubmit = () => {
    let score = 0;
    demoQuiz.forEach((q, i) => {
      if (quizAnswers[i] === q.ans) score++;
    });
    setQuizScore(score);
    toast({ title: "Exam Submitted!", description: `You scored ${score} out of 5.` });
  };

  if (!course) return <div>Loading...</div>;

  const chapters = course.chapters;
  const completedChapters = progress?.completed_chapters || [];
  const progressPercentage = (completedChapters.length / chapters.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-20">
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

        {/* 🔥 Dynamic YouTube Player Section */}
        <Card className="mb-8 overflow-hidden bg-black">
          <CardContent className="p-0">
            {activeVideo ? (
              <div className="aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`${activeVideo}?autoplay=1`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
                  <p className="text-lg font-semibold">Select a chapter below to start watching</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chapters List */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold mb-4">Course Chapters</h2>
          {chapters.map((chapter: string, index: number) => {
            const isCompleted = completedChapters.includes(index);
            return (
              <Card
                key={index}
                className={`transition-all hover:border-primary ${
                  isCompleted ? "border-green-500/50 bg-green-500/5" : ""
                }`}
              >
                <CardContent className="flex items-center justify-between p-4">
                  {/* Left Side: Click to Play Video */}
                  <div 
                    className="flex items-center gap-4 cursor-pointer flex-1"
                    onClick={() => handlePlayVideo(index)}
                  >
                    <PlayCircle className="h-8 w-8 text-primary hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-lg">Chapter {index + 1}</p>
                      <p className="text-sm text-muted-foreground">{chapter}</p>
                    </div>
                  </div>

                  {/* Right Side: Toggle Completion */}
                  <Button 
                    variant={isCompleted ? "default" : "outline"}
                    className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChapter(index);
                    }}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4 mr-2" /> : <Circle className="h-4 w-4 mr-2" />}
                    {isCompleted ? "Completed" : "Mark Complete"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 🎓 Show Exam Button only if 100% complete and it is the Demo Course */}
        {progressPercentage === 100 && isDemoCourse && !showQuiz && (
          <Card className="mt-8 bg-gradient-to-r from-primary/20 to-accent/20 border-primary animate-slide-up">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-muted-foreground mb-4">
                You've completed all chapters. Take the final exam to get your certificate!
              </p>
              <Button size="lg" onClick={() => setShowQuiz(true)}>
                <FileText className="mr-2 h-5 w-5" /> Start Final Exam
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 📝 The Final Exam Section */}
        {showQuiz && (
          <div className="mt-12 space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold border-b pb-4">Final Certification Exam</h2>
            
            {demoQuiz.map((item, qIndex) => (
              <Card key={qIndex}>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-4">{qIndex + 1}. {item.q}</h4>
                  <div className="space-y-2">
                    {item.options.map((opt, oIndex) => (
                      <div 
                        key={oIndex}
                        onClick={() => quizScore === null && setQuizAnswers({ ...quizAnswers, [qIndex]: oIndex })}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          quizAnswers[qIndex] === oIndex 
                            ? "bg-primary/20 border-primary" 
                            : "hover:bg-secondary"
                        } ${quizScore !== null && oIndex === item.ans ? "bg-green-500/20 border-green-500" : ""}
                          ${quizScore !== null && quizAnswers[qIndex] === oIndex && oIndex !== item.ans ? "bg-red-500/20 border-red-500" : ""}
                        `}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quiz Submit Results */}
            {quizScore === null ? (
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < demoQuiz.length}
              >
                Submit Exam
              </Button>
            ) : (
              <Card className={`border-2 ${quizScore >= 3 ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">
                    {quizScore >= 3 ? "🎉 Passed!" : "❌ Failed"}
                  </h3>
                  <p className="text-lg mb-4">You scored {quizScore} out of 5.</p>
                  {quizScore >= 3 ? (
                    <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
                  ) : (
                    <Button variant="outline" onClick={() => { setQuizScore(null); setQuizAnswers({}); }}>Retry Exam</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseDetail;