import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error('❌ Ошибка: DEEPSEEK_API_KEY не найден в .env!');
}
if (!SERP_API_KEY) {
  console.error('❌ Ошибка: SERP_API_KEY не найден в .env!');
}

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: DEEPSEEK_API_KEY,
});

export interface DeepSeekResponse {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

/**
 * Универсальная функция поиска информации в интернете.
 * @param query Запрос пользователя.
 * @returns Найденный ответ или сообщение об ошибке.
 */
export async function fetchInternetData(query: string): Promise<string> {
  try {
    console.log(`🔍 Поиск в интернете: "${query}"`);

    if (!SERP_API_KEY) {
      console.error('❌ Ошибка: API-ключ SerpAPI отсутствует! Проверь .env');
      return '❌ Ошибка: API-ключ отсутствует.';
    }

    const response = await axios.get(`https://serpapi.com/search`, {
      params: {
        api_key: SERP_API_KEY,
        q: query,
        num: 3,
      },
    });

    const results = response.data.organic_results;
    if (!results || results.length === 0) {
      return '❌ Не удалось найти актуальную информацию. Попробуйте уточнить запрос.';
    }

    let extractedData = '';
    for (const result of results) {
      try {
        console.log(`📄 Извлекаем текст с: ${result.link}`);
        const pageResponse = await axios.get(result.link);
        const $ = cheerio.load(pageResponse.data);

        let pageText = '';
        $('p, span, div').each((_, el) => {
          const text = $(el).text().trim();
          if (text.length > 20 && text.length < 300) {
            pageText += `- ${text}\n`;
          }
        });

        if (pageText) {
          extractedData += `🔹 **${result.title}**: \n${pageText}\n🔗 [Источник](${result.link})\n\n`;
        }
      } catch (error) {
        console.error(`❌ Ошибка при обработке ${result.link}:`, error);
      }
    }

    return (
      extractedData ||
      '❌ Не удалось получить полезные данные. Попробуйте уточнить запрос.'
    );
  } catch (error) {
    console.error('❌ Ошибка при поиске в интернете:', error);
    return '❌ Не удалось получить результаты. Попробуйте позже.';
  }
}

/**
 * Получает текущее время для указанного города.
 * @param city Город, для которого нужно узнать время.
 * @returns Время в указанном городе.
 */
async function getWorldTime(city: string): Promise<string> {
  try {
    console.log(`⏰ Запрашиваем текущее время для: ${city}`);

    const response = await axios.get(
      `http://worldtimeapi.org/api/timezone/Europe/${city}`,
    );
    const { datetime } = response.data;
    const time = new Date(datetime).toLocaleTimeString('ru-RU');

    return `⏰ Текущее время в ${city}: ${time}`;
  } catch (error) {
    console.error('❌ Ошибка при получении времени:', error);
    return '❌ Не удалось получить текущее время.';
  }
}

/**
 * Определяет, нужен ли интернет-поиск.
 * @param message Входящий запрос.
 * @returns true, если требуется интернет-поиск.
 */
function requiresInternetSearch(message: string): boolean {
  const searchTriggers = [
    'новости',
    'курс',
    'погода',
    'сколько стоит',
    'актуальная информация',
    'результаты матча',
    'события',
    'биография',
    'история',
  ];

  const isSimpleQuestion = /(как|что|где|когда|почему|зачем)\s/.test(
    message.toLowerCase(),
  );
  const isFactualQuestion = /(сколько|кто|какой|какая)\s/.test(
    message.toLowerCase(),
  );

  return (
    searchTriggers.some((trigger) => message.toLowerCase().includes(trigger)) ||
    (isFactualQuestion && !isSimpleQuestion)
  );
}

/**
 * Отправляет сообщение в DeepSeek API с возможностью поиска в интернете.
 * @param message Текущее сообщение пользователя.
 * @param history История диалога.
 * @returns Ответ от DeepSeek API.
 */
export async function sendMessageToDeepSeek(
  message: string,
  history: Array<{ role: string; content: string }> = [],
): Promise<DeepSeekResponse> {
  try {
    let additionalData = '';

    if (message.toLowerCase().includes('время в')) {
      const cityMatch = message.match(/время в\s+(.+)/i);
      const city = cityMatch ? cityMatch[1].trim() : 'Moscow';
      additionalData = await getWorldTime(city);
    } else if (requiresInternetSearch(message)) {
      additionalData = await fetchInternetData(message);
    }

    history = history.slice(-10);
    history.push({ role: 'user', content: message });

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'Ты интеллектуальный помощник. Если у тебя нет информации, используй интернет для поиска. Отвечай кратко и понятно.',
      },
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      messages,
      model: 'deepseek-chat',
    });

    let botResponse =
      completion.choices[0]?.message?.content ||
      '❌ Ошибка в ответе от DeepSeek API.';

    // Если ответ содержит код, оборачиваем его в тройные кавычки
    if (botResponse.includes('```')) {
      botResponse = botResponse.replace(/```([\s\S]+?)```/g, '```\n$1\n```');
    }

    return {
      message: botResponse,
      history: [...history, { role: 'assistant', content: botResponse }],
    };
  } catch (error) {
    console.error('❌ Ошибка при запросе к DeepSeek API:', error);
    throw error;
  }
}
