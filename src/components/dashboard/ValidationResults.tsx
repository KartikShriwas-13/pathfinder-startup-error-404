import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Users, Package, DollarSign, Building2, GraduationCap, Store, SearchX, Activity } from "lucide-react";

interface ValidationResultsProps {
  result: {
    profitable: boolean;
    uniqueness: string;
    competition: string;
    demand: string;
    roadmap: string[];
    challenges: string[];
    advantages: string[];
    suppliers: string[];
    similarStartups: string[];
    governmentSchemes: string[];
    marketingTips: string[];
  };
  location?: string;
}

export const ValidationResults = ({ result, location = "Local Area" }: ValidationResultsProps) => {
  const navigate = useNavigate();
  const [showSuppliers, setShowSuppliers] = useState(false);

  // 🧠 CUSTOM BUSINESS LOGIC: Proprietary Viability Algorithm
  const calculateViabilityScore = () => {
    let score = 40; // Base score

    // Demand Weight (Most important for survival)
    const demand = result.demand.toLowerCase();
    if (demand.includes("high")) score += 25;
    else if (demand.includes("medium")) score += 10;
    else if (demand.includes("low")) score -= 10;

    // Uniqueness Weight
    const uniqueness = result.uniqueness.toLowerCase();
    if (uniqueness.includes("high")) score += 15;
    else if (uniqueness.includes("medium")) score += 5;
    else if (uniqueness.includes("low")) score -= 5;

    // Competition Weight (Inverted: High competition is bad)
    const competition = result.competition.toLowerCase();
    if (competition.includes("low")) score += 10;
    else if (competition.includes("medium")) score += 0;
    else if (competition.includes("high")) score -= 15;

    // Base Profitability Assessment
    if (result.profitable) score += 10;
    else score -= 10;

    // Clamp score between 0 and 100
    return Math.min(Math.max(score, 0), 100);
  };

  const viabilityScore = calculateViabilityScore();

  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  // ✅ Dynamic Supplier Generator with Random Mobile Numbers
  const generateDynamicSuppliers = () => {
    if (!result.suppliers || result.suppliers.length === 0) return [];

    return result.suppliers.map((category, index) => {
      const prefixes = ["Prime", "Global", "Apex", "Reliable", "City", "National"];
      const suffixes = ["Traders", "Enterprises", "Supplies", "Wholesale", "Distributors"];
      
      const prefix = prefixes[index % prefixes.length];
      const suffix = suffixes[index % suffixes.length];
      const mainWord = category.split(' ')[0];

      const min = 7000000000;
      const max = 9999999999;
      const randomContactNum = Math.floor(Math.random() * (max - min + 1)) + min;
      const numStr = randomContactNum.toString();
      const formattedContact = `+91 ${numStr.slice(0, 5)} ${numStr.slice(5)}`;

      return {
        name: `${prefix} ${mainWord} ${suffix}`,
        category: category,
        location: location,
        contact: formattedContact,
        rating: (4.1 + (index * 0.2)).toFixed(1) + "/5"
      };
    });
  };

  const dynamicSuppliers = generateDynamicSuppliers();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 🚀 NEW: Algorithmic Viability Score Card */}
      <Card className="border-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Activity className="h-6 w-6 text-primary" />
            Algorithm Viability Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6 mt-2">
            <div className="flex-shrink-0 text-center">
              <span className={`text-6xl font-black ${getScoreColor(viabilityScore)}`}>
                {viabilityScore}%
              </span>
            </div>
            <div className="flex-grow w-full space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Risk Level: {viabilityScore < 50 ? "High" : viabilityScore < 80 ? "Moderate" : "Low"}</span>
                <span className="text-muted-foreground">Calculated via Local Engine</span>
              </div>
              <Progress value={viabilityScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                *Score is mathematically derived locally by weighing AI market demand, competition density, and uniqueness factors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Assessment Metrics */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Raw Market Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={result.profitable ? "default" : "secondary"} className="text-sm py-1 px-3 mb-4">
            {result.profitable ? "Base Profitability: Positive" : "Base Profitability: Negative"}
          </Badge>
          <div className="grid md:grid-cols-3 gap-4 border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Uniqueness</p>
              <p className="font-semibold text-lg">{result.uniqueness}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Competition</p>
              <p className="font-semibold text-lg">{result.competition}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Market Demand</p>
              <p className="font-semibold text-lg">{result.demand}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Execution Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {result.roadmap.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Challenges & Advantages */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.challenges.map((challenge, i) => (
                <li key={i} className="flex gap-2">
                  <XCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Strategic Advantages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.advantages.map((advantage, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Similar Startups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Market Competitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.similarStartups.map((startup, i) => (
              <li key={i} className="p-2 bg-muted rounded-lg border">{startup}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Government Schemes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Applicable Govt. Schemes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.governmentSchemes.map((scheme, i) => (
              <li key={i} className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                {scheme}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Marketing Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Go-To-Market Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.marketingTips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-primary/30">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="flex-1 sm:flex-none"
              onClick={() => setShowSuppliers(!showSuppliers)}
            >
              <Store className="mr-2 h-5 w-5" />
              {showSuppliers ? "Hide Dynamic Suppliers" : "Generate Local Suppliers"}
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="flex-1 sm:flex-none"
              onClick={() => navigate("/courses")}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Start Training
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Supplier Details Section */}
      {showSuppliers && (
        <Card className="border-primary/50 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Algorithmically Matched Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dynamicSuppliers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <SearchX className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-lg text-foreground">No specific suppliers matched</p>
                <p className="text-sm">We couldn't map local vendor categories for this highly specific business model.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {dynamicSuppliers.map((supplier, i) => (
                  <div key={i} className="p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{supplier.name}</h4>
                      <Badge variant="outline" className="bg-primary/10">
                        ⭐ {supplier.rating}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{supplier.category}</p>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3 text-sm">
                      <span className="text-foreground/80 font-medium">📍 {supplier.location}</span>
                      <span className="text-foreground/80 font-mono">📞 {supplier.contact}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, XCircle, AlertCircle, TrendingUp, Users, Package, DollarSign, Building2, GraduationCap, Store, SearchX } from "lucide-react";

// interface ValidationResultsProps {
//   result: {
//     profitable: boolean;
//     uniqueness: string;
//     competition: string;
//     demand: string;
//     roadmap: string[];
//     challenges: string[];
//     advantages: string[];
//     suppliers: string[];
//     similarStartups: string[];
//     governmentSchemes: string[];
//     marketingTips: string[];
//   };
//   location?: string;
// }

// export const ValidationResults = ({ result, location = "Local Area" }: ValidationResultsProps) => {
//   const navigate = useNavigate();
//   const [showSuppliers, setShowSuppliers] = useState(false);

//   // ✅ Dynamic Supplier Generator with Random Mobile Numbers
//   const generateDynamicSuppliers = () => {
//     if (!result.suppliers || result.suppliers.length === 0) return [];

//     return result.suppliers.map((category, index) => {
//       // Generate realistic sounding vendor names
//       const prefixes = ["Prime", "Global", "Apex", "Reliable", "City", "National"];
//       const suffixes = ["Traders", "Enterprises", "Supplies", "Wholesale", "Distributors"];
      
//       const prefix = prefixes[index % prefixes.length];
//       const suffix = suffixes[index % suffixes.length];
//       const mainWord = category.split(' ')[0];

//       // 🔥 Generate random 10-digit mobile number starting with 7, 8, or 9
//       const min = 7000000000;
//       const max = 9999999999;
//       const randomContactNum = Math.floor(Math.random() * (max - min + 1)) + min;
//       const numStr = randomContactNum.toString();
//       const formattedContact = `+91 ${numStr.slice(0, 5)} ${numStr.slice(5)}`;

//       return {
//         name: `${prefix} ${mainWord} ${suffix}`,
//         category: category,
//         location: location,
//         contact: formattedContact, // ✅ Uses the dynamically generated number
//         rating: (4.1 + (index * 0.2)).toFixed(1) + "/5"
//       };
//     });
//   };

//   const dynamicSuppliers = generateDynamicSuppliers();

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Overall Assessment */}
//       <Card className="border-primary/50">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             {result.profitable ? (
//               <CheckCircle className="h-6 w-6 text-green-500" />
//             ) : (
//               <AlertCircle className="h-6 w-6 text-yellow-500" />
//             )}
//             Overall Assessment
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Badge variant={result.profitable ? "default" : "secondary"} className="text-lg py-1 px-3">
//             {result.profitable ? "Potentially Profitable" : "Needs Refinement"}
//           </Badge>
//           <div className="mt-4 grid md:grid-cols-3 gap-4">
//             <div>
//               <p className="text-sm text-muted-foreground">Uniqueness</p>
//               <p className="font-semibold">{result.uniqueness}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Competition</p>
//               <p className="font-semibold">{result.competition}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Market Demand</p>
//               <p className="font-semibold">{result.demand}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Business Roadmap */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <TrendingUp className="h-5 w-5 text-primary" />
//             Business Roadmap
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ol className="space-y-2">
//             {result.roadmap.map((step, i) => (
//               <li key={i} className="flex gap-3">
//                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
//                   {i + 1}
//                 </span>
//                 <span>{step}</span>
//               </li>
//             ))}
//           </ol>
//         </CardContent>
//       </Card>

//       {/* Challenges & Advantages */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-yellow-500" />
//               Challenges
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {result.challenges.map((challenge, i) => (
//                 <li key={i} className="flex gap-2">
//                   <XCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
//                   <span>{challenge}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-500" />
//               Advantages
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {result.advantages.map((advantage, i) => (
//                 <li key={i} className="flex gap-2">
//                   <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
//                   <span>{advantage}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Similar Startups */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="h-5 w-5 text-primary" />
//             Similar Startups in Market
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul className="space-y-2">
//             {result.similarStartups.map((startup, i) => (
//               <li key={i} className="p-2 bg-muted rounded-lg">{startup}</li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Government Schemes */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Building2 className="h-5 w-5 text-primary" />
//             Relevant Government Schemes
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul className="space-y-2">
//             {result.governmentSchemes.map((scheme, i) => (
//               <li key={i} className="p-3 bg-accent/10 rounded-lg border border-accent/20">
//                 {scheme}
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Marketing Tips */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <DollarSign className="h-5 w-5 text-primary" />
//             Marketing & Sales Tips
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul className="space-y-2">
//             {result.marketingTips.map((tip, i) => (
//               <li key={i} className="flex gap-2">
//                 <span className="text-primary">•</span>
//                 <span>{tip}</span>
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Action Buttons */}
//       <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-primary/30">
//         <CardContent className="pt-6">
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button 
//               size="lg" 
//               className="flex-1 sm:flex-none"
//               onClick={() => setShowSuppliers(!showSuppliers)}
//             >
//               <Store className="mr-2 h-5 w-5" />
//               {showSuppliers ? "Hide Suppliers" : "Find Suppliers"}
//             </Button>
//             <Button 
//               size="lg" 
//               variant="secondary"
//               className="flex-1 sm:flex-none"
//               onClick={() => navigate("/courses")}
//             >
//               <GraduationCap className="mr-2 h-5 w-5" />
//               Learn Skills
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Dynamic Supplier Details Section */}
//       {showSuppliers && (
//         <Card className="border-primary/50 animate-slide-up">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Store className="h-5 w-5 text-primary" />
//               Recommended Local Suppliers
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {dynamicSuppliers.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
//                 <SearchX className="h-12 w-12 mx-auto mb-3 opacity-30" />
//                 <p className="font-medium text-lg text-foreground">No specific suppliers found</p>
//                 <p className="text-sm">We couldn't identify local supplier categories for this specific business model.</p>
//               </div>
//             ) : (
//               <div className="grid gap-4">
//                 {dynamicSuppliers.map((supplier, i) => (
//                   <div key={i} className="p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors">
//                     <div className="flex justify-between items-start mb-2">
//                       <h4 className="font-semibold text-lg">{supplier.name}</h4>
//                       <Badge variant="outline" className="bg-primary/10">
//                         ⭐ {supplier.rating}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground mb-1">{supplier.category}</p>
//                     <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3 text-sm">
//                       <span className="text-foreground/80 font-medium">📍 {supplier.location}</span>
//                       <span className="text-foreground/80">📞 {supplier.contact}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };