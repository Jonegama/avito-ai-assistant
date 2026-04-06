import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Server is running',
  });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'Поле prompt обязательно и должно быть строкой',
      });
    }

    const ollamaResponse = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt,
        stream: false,
      }),
    });

    const rawText = await ollamaResponse.text();

    if (!ollamaResponse.ok) {
      return res.status(500).json({
        ok: false,
        error: 'Ошибка ответа от Ollama',
        details: rawText,
      });
    }

    let data;

    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      return res.status(500).json({
        ok: false,
        error: 'Не удалось разобрать ответ Ollama',
        details: rawText,
      });
    }

    return res.json({
      ok: true,
      model: data.model,
      response: data.response,
    });
  } catch (error) {
    console.error('SERVER ERROR:', error);

    return res.status(500).json({
      ok: false,
      error: 'Внутренняя ошибка сервера',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on http://0.0.0.0:${PORT}`);
});