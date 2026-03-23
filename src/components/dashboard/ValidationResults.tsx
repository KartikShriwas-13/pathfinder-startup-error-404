// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, XCircle, AlertCircle, TrendingUp, Users, Package, DollarSign, BookOpen, Building2, GraduationCap, Store } from "lucide-react";

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
// }

// export const ValidationResults = ({ result }: ValidationResultsProps) => {
//   const navigate = useNavigate();
//   const [showSuppliers, setShowSuppliers] = useState(false);

//   const demoSuppliers = [
//     {
//       name: "Green Organics Pvt Ltd",
//       category: "Organic Seeds & Fertilizers",
//       location: "Nagpur, Maharashtra",
//       contact: "+91 98765 43210",
//       rating: "4.5/5"
//     },
//     {
//       name: "AgriTech Solutions",
//       category: "Farm Equipment & Irrigation",
//       location: "Mumbai, Maharashtra",
//       contact: "+91 98765 43211",
//       rating: "4.7/5"
//     },
//     {
//       name: "BioFert India",
//       category: "Organic Pesticides & Compost",
//       location: "Pune, Maharashtra",
//       contact: "+91 98765 43212",
//       rating: "4.3/5"
//     }
//   ];

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

//       {/* Suppliers */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Package className="h-5 w-5 text-primary" />
//             Suggested Suppliers & Resources
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap gap-2">
//             {result.suppliers.map((supplier, i) => (
//               <Badge key={i} variant="outline">
//                 {supplier}
//               </Badge>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

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
//               Find Suppliers
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

//       {/* Supplier Details */}
//       {showSuppliers && (
//         <Card className="border-primary/50 animate-slide-up">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Store className="h-5 w-5 text-primary" />
//               Recommended Suppliers
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4">
//               {demoSuppliers.map((supplier, i) => (
//                 <div key={i} className="p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors">
//                   <div className="flex justify-between items-start mb-2">
//                     <h4 className="font-semibold text-lg">{supplier.name}</h4>
//                     <Badge variant="outline" className="bg-primary/10">
//                       ⭐ {supplier.rating}
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-muted-foreground mb-1">{supplier.category}</p>
//                   <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3 text-sm">
//                     <span className="text-foreground/80">📍 {supplier.location}</span>
//                     <span className="text-foreground/80">📞 {supplier.contact}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Users, Package, DollarSign, Building2, GraduationCap, Store, SearchX } from "lucide-react";

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

  // ✅ Dynamic Supplier Generator with Random Mobile Numbers
  const generateDynamicSuppliers = () => {
    if (!result.suppliers || result.suppliers.length === 0) return [];

    return result.suppliers.map((category, index) => {
      // Generate realistic sounding vendor names
      const prefixes = ["Prime", "Global", "Apex", "Reliable", "City", "National"];
      const suffixes = ["Traders", "Enterprises", "Supplies", "Wholesale", "Distributors"];
      
      const prefix = prefixes[index % prefixes.length];
      const suffix = suffixes[index % suffixes.length];
      const mainWord = category.split(' ')[0];

      // 🔥 Generate random 10-digit mobile number starting with 7, 8, or 9
      const min = 7000000000;
      const max = 9999999999;
      const randomContactNum = Math.floor(Math.random() * (max - min + 1)) + min;
      const numStr = randomContactNum.toString();
      const formattedContact = `+91 ${numStr.slice(0, 5)} ${numStr.slice(5)}`;

      return {
        name: `${prefix} ${mainWord} ${suffix}`,
        category: category,
        location: location,
        contact: formattedContact, // ✅ Uses the dynamically generated number
        rating: (4.1 + (index * 0.2)).toFixed(1) + "/5"
      };
    });
  };

  const dynamicSuppliers = generateDynamicSuppliers();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Assessment */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {result.profitable ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-500" />
            )}
            Overall Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={result.profitable ? "default" : "secondary"} className="text-lg py-1 px-3">
            {result.profitable ? "Potentially Profitable" : "Needs Refinement"}
          </Badge>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Uniqueness</p>
              <p className="font-semibold">{result.uniqueness}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Competition</p>
              <p className="font-semibold">{result.competition}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Market Demand</p>
              <p className="font-semibold">{result.demand}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Business Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {result.roadmap.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span>{step}</span>
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
              Challenges
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
              Advantages
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
            Similar Startups in Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.similarStartups.map((startup, i) => (
              <li key={i} className="p-2 bg-muted rounded-lg">{startup}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Government Schemes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Relevant Government Schemes
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
            Marketing & Sales Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.marketingTips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
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
              {showSuppliers ? "Hide Suppliers" : "Find Suppliers"}
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="flex-1 sm:flex-none"
              onClick={() => navigate("/courses")}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Learn Skills
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
              Recommended Local Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dynamicSuppliers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <SearchX className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-lg text-foreground">No specific suppliers found</p>
                <p className="text-sm">We couldn't identify local supplier categories for this specific business model.</p>
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
                      <span className="text-foreground/80">📞 {supplier.contact}</span>
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