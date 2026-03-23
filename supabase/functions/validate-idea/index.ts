import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // ✅ Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function started");

    const { idea, location, budget } = await req.json();

    console.log("Input:", { idea, location, budget });

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = `
You are an expert startup advisor.

Analyze this startup idea:

Business Idea: ${idea}
Location: ${location}
Budget: ₹${budget}

Return ONLY valid JSON in this format:

{
  "profitable": true,
  "uniqueness": "High/Medium/Low",
  "competition": "High/Medium/Low",
  "demand": "High/Medium/Low",
  "roadmap": [],
  "challenges": [],
  "advantages": [],
  "suppliers": [],
  "similarStartups": [],
  "governmentSchemes": [],
  "marketingTips": []
}
`;

    console.log("Calling Gemini API...");

    // ✅ FIXED MODEL HERE
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    console.log("Gemini status:", response.status);

    // ❗ Handle API failure
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);

      return new Response(
        JSON.stringify({
          error: "Gemini API failed",
          details: errorText,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    let content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("Invalid AI response:", JSON.stringify(data));
      throw new Error("Invalid AI response");
    }

    console.log("Raw AI Response:", content);

    // ✅ Remove markdown if present
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      content = codeBlockMatch[1].trim();
    }

    // ✅ Extract JSON safely
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("No JSON found:", content);
      throw new Error("No JSON found in AI response");
    }

    let result;

    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("JSON Parse Failed:", jsonMatch[0]);

      return new Response(
        JSON.stringify({
          error: "Invalid JSON from AI",
          raw: jsonMatch[0],
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ✅ Ensure safe structure (prevents frontend crash)
    result = {
      profitable: result.profitable ?? false,
      uniqueness: result.uniqueness ?? "Medium",
      competition: result.competition ?? "Medium",
      demand: result.demand ?? "Medium",
      roadmap: result.roadmap ?? [],
      challenges: result.challenges ?? [],
      advantages: result.advantages ?? [],
      suppliers: result.suppliers ?? [],
      similarStartups: result.similarStartups ?? [],
      governmentSchemes: result.governmentSchemes ?? [],
      marketingTips: result.marketingTips ?? [],
    };

    console.log("Final result ready");

    // ✅ Success response
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Function Error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
