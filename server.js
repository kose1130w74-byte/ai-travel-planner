const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const systemPrompt =
  "あなたは『大学生向けの日本国内旅行プランナーAI』です。予算と日数に合わせて現実的に提案してください。";

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/plan", async (req, res) => {
  try {
    const userInput = req.body.userInput;
    if (!userInput) {
      return res.status(400).json({ error: "userInput がありません" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `${systemPrompt}\n\n${userInput}`,
    });

    const text = response.output_text;

    res.json({ plan: text || "生成に失敗しました。" });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "サーバー/APIエラー" });
  }
});

app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
