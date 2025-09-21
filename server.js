import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5000;

// For __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname)));

// Your chat API
const API_KEY = "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";

app.post("/chat", async (req, res) => {
  const history = req.body.history;
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ reply: "History required" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}` 
      },
      body: JSON.stringify({
        model: "groq/compound-mini",
        messages: [
          { role: "system", content: "You are UniMatch AI, a career counselor..." },
          ...history
        ]
      }),
    });

    const data = await response.json();

    // Extract answer
    let answer = data.choices?.[0]?.message?.content || "No response";

    // Clean formatting (remove extra spaces, organize paragraphs)
    answer = answer
      .replace(/\n{3,}/g, "\n\n")   // limit multiple newlines to 2
      .trim();

    // Send a structured JSON response
    res.json({
      success: true,
      reply: answer,
      usage: data.usage || {}, // optional token usage if available
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, reply: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
