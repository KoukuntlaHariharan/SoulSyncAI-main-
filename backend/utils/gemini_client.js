import fetch from "node-fetch";

export async function callGemini(prompt) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ Gemini API key is missing in .env");
      return "API key missing";
    }

    console.log("🔵 Sending to Gemini 2.0 Flash:", prompt);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt + "\n\nKeep your reply short - 3 to 5 sentences maximum. Also keep the answers warm and encouraging. You are a AI emotion buddy so give responses like a friend." }],
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("🟣 Gemini Flash 2.0 Response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't process that";

    return reply;
  } catch (err) {
    console.error("❌ GEMINI 2.0 Flash API ERROR:", err);
    return "I'm having trouble responding right now.";
  }
}
