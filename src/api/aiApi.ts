import type { Category, ItemParams } from '../types/item';

const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:3000';

type GenerateResult = {
  ok: boolean;
  response?: string;
  error?: string;
};

type GenerateAiInput = {
  mode: 'description' | 'price';
  category: Category;
  title: string;
  price: number;
  description?: string;
  params: ItemParams;
};

function paramsToText(params: ItemParams): string {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

function buildPrompt(input: GenerateAiInput): string {
  const base = `
Ты помощник продавца на Авито.
Отвечай на русском языке.
Данные объявления:

Категория: ${input.category}
Название: ${input.title}
Цена: ${input.price}
Описание: ${input.description || 'не заполнено'}
Параметры:
${paramsToText(input.params) || 'нет данных'}
`.trim();

  if (input.mode === 'description') {
    return `${base}

Задача:
Напиши улучшенное описание объявления для публикации на Авито.
Требования:
- 4-6 предложений
- без воды
- без выдуманных характеристик
- текст должен звучать естественно и продавать
- не используй markdown
- только готовый текст описания`;
  }

  return `${base}

Задача:
Оцени рыночную цену для такого товара и дай краткий комментарий.
Формат ответа:
1 строка: рекомендуемая цена в рублях
2-4 строки: краткое объяснение, от чего зависит цена
Не используй markdown-таблицы и длинные рассуждения.`;
}

export async function generateAiSuggestion(input: GenerateAiInput): Promise<string> {
  const response = await fetch(`${AI_API_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: buildPrompt(input),
    }),
  });

  const data = (await response.json()) as GenerateResult;

  if (!response.ok || !data.ok || !data.response) {
    throw new Error(data.error || 'Не удалось получить ответ от AI');
  }

  return data.response.trim();
}