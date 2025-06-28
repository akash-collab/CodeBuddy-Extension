const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const ProblemLog = require("../models/ProblemLog");

const getHintsFromGemini = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Missing title or description" });
  }

  // Check if API key is available
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found in environment variables");
    return res.status(500).json({ error: "API key not configured. Please add GEMINI_API_KEY to your .env file." });
  }

  const prompt = `
You are a helpful and encouraging tutor. For the given problem, provide hints and explanations without revealing any code.

Please respond with:
{
  "concepts": ["Concept 1", "Concept 2"],
  "hints": ["Hint 1", "Hint 2", "Hint 3"],
  "encouragement": "Some motivating closing line"
}

Problem Title: ${title}
Problem Description: ${description}
  `;

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log("🔍 Making request to Gemini API...");
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API request timed out after 15 seconds')), 15000);
    });

    // Create the fetch promise
    const fetchPromise = fetch(apiUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    // Race between fetch and timeout
    const geminiResponse = await Promise.race([fetchPromise, timeoutPromise]);

    console.log("📡 Gemini API response status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("❌ Gemini API error:", geminiResponse.status, errorText);
      return res.status(geminiResponse.status).json({ 
        error: `Gemini API error: ${geminiResponse.status} - ${errorText}` 
      });
    }

    const result = await geminiResponse.json();
    console.log("📥 Gemini API response received");

    if (!result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("❌ Invalid Gemini response structure:", JSON.stringify(result, null, 2));
      return res.status(500).json({ error: "Gemini API returned invalid content structure" });
    }

    const responseText = result.candidates[0].content.parts[0].text;
    console.log("📝 Raw response text:", responseText);

    let parsed;
    try {
      // Handle markdown code blocks from Gemini
      let jsonText = responseText;
      if (responseText.includes('```json')) {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }
      }
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("❌ Failed to parse JSON from Gemini response:", parseError);
      // Fallback: treat the response as plain text
      const hintText = `Hints:\n${responseText}`;
      
      // Try to log to database, but don't fail if it's not available
      try {
        await ProblemLog.create({
          title,
          description,
          platform: "Leetcode",
          hintResponse: hintText,
        });
      } catch (dbError) {
        console.warn("⚠️  Could not log to database:", dbError.message);
      }

      return res.status(200).json({ hints: hintText });
    }

    const hintText = [
      parsed.concepts ? `Concepts:\n${parsed.concepts.map(c => `- ${c}`).join("\n")}` : "",
      parsed.hints ? `Hints:\n${parsed.hints.map((h, i) => `${i + 1}. ${h}`).join("\n")}` : "",
      parsed.encouragement || ""
    ].filter(Boolean).join("\n\n");

    // Try to log to database, but don't fail if it's not available
    try {
      await ProblemLog.create({
        title,
        description,
        platform: "Leetcode",
        hintResponse: hintText,
      });
    } catch (dbError) {
      console.warn("⚠️  Could not log to database:", dbError.message);
    }

    console.log("✅ Successfully generated hints");
    return res.status(200).json({ hints: hintText });
  } catch (err) {
    console.error("❌ Error from Gemini:", err);
    return res.status(500).json({ error: "Failed to fetch from Gemini: " + err.message });
  }
};

// Test endpoint that returns static hints without calling Gemini
const getTestHints = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Missing title or description" });
  }

  console.log("🧪 Test endpoint called for:", title);

  // Return static hints for testing
  const hintText = `Concepts:
- Dynamic Programming
- String Manipulation
- Two Pointers

Hints:
1. Consider using a two-pointer approach to expand around each character
2. Think about how to handle even and odd length palindromes
3. Use dynamic programming to avoid recalculating subproblems

💪 Encouragement: Remember, every expert was once a beginner. Take it one step at a time!`;

  console.log("✅ Test hints generated successfully");
  return res.status(200).json({ hints: hintText });
};

module.exports = { getHintsFromGemini, getTestHints };