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
    return res.status(500).json({ error: "API key not configured" });
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
    
    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

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
      
      await ProblemLog.create({
        title,
        description,
        platform: "Leetcode",
        hintResponse: hintText,
      });

      return res.status(200).json({ hints: hintText });
    }

    const hintText = [
      parsed.concepts ? `Concepts:\n${parsed.concepts.map(c => `- ${c}`).join("\n")}` : "",
      parsed.hints ? `Hints:\n${parsed.hints.map((h, i) => `${i + 1}. ${h}`).join("\n")}` : "",
      parsed.encouragement || ""
    ].filter(Boolean).join("\n\n");

    await ProblemLog.create({
      title,
      description,
      platform: "Leetcode",
      hintResponse: hintText,
    });

    console.log("✅ Successfully generated hints");
    return res.status(200).json({ hints: hintText });
  } catch (err) {
    console.error("❌ Error from Gemini:", err);
    return res.status(500).json({ error: "Failed to fetch from Gemini: " + err.message });
  }
};

module.exports = { getHintsFromGemini };