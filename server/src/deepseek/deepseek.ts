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
 * Выполняет поиск погоды и анализирует прогноз на несколько дней.
 * @param query Запрос пользователя.
 * @returns Полный прогноз погоды.
 */
export async function fetchWeatherData(query: string): Promise<string> {
  try {
    console.log(`🔍 Выполняем поиск в интернете по запросу: "${query}"`);

    if (!SERP_API_KEY) {
      console.error('❌ Ошибка: API-ключ SerpAPI отсутствует! Проверь .env');
      return '❌ Ошибка: API-ключ отсутствует.';
    }

    console.log(
      `🔑 Используем API-ключ: ${SERP_API_KEY.substring(0, 5)}********`,
    );

    const response = await axios.get(`https://serpapi.com/search`, {
      params: {
        api_key: SERP_API_KEY,
        q: query,
        num: 3,
      },
    });

    console.log('🌍 Ответ от SerpAPI:', response.data);

    const results = response.data.organic_results;

    if (!results || results.length === 0) {
      return '❌ Не удалось найти актуальную информацию.';
    }

    let weatherData = '';
    for (const result of results) {
      try {
        console.log(`📄 Извлекаем текст с: ${result.link}`);
        const pageResponse = await axios.get(result.link);
        const $ = cheerio.load(pageResponse.data);

        let extractedWeather = '';
        $('p, span, div').each((_, el) => {
          const text = $(el).text().trim();
          if (
            /температура|°C|осадки|ветер|давление|влажность/.test(
              text.toLowerCase(),
            )
          ) {
            extractedWeather += `- ${text}\n`;
          }
        });

        if (extractedWeather) {
          weatherData += `🔹 **${result.title}**: \n${extractedWeather}\n🔗 [Источник](${result.link})\n\n`;
        }
      } catch (error) {
        console.error(
          `❌ Ошибка при получении данных с ${result.link}:`,
          error,
        );
      }
    }

    return weatherData || '❌ Не удалось получить точные данные о погоде.';
  } catch (error) {
    console.error('❌ Ошибка при поиске в интернете:', error);
    return '❌ Не удалось получить результаты из интернета.';
  }
}

/**
 * Отправляет сообщение в DeepSeek API с учетом истории и прогноза погоды.
 * @param message Текущее сообщение пользователя.
 * @param history История диалога.
 * @returns Ответ от DeepSeek API.
 */
export async function sendMessageToDeepSeek(
  message: string,
  history: Array<{ role: string; content: string }> = [],
): Promise<DeepSeekResponse> {
  try {
    let weatherData = '';

    if (
      message.toLowerCase().includes('погода') ||
      message.toLowerCase().includes('температура') ||
      message.toLowerCase().includes('осадки') ||
      message.toLowerCase().includes('ветер') ||
      message.toLowerCase().includes('давление') ||
      message.toLowerCase().includes('влажность')
    ) {
      console.log('🌍 Обнаружен запрос на поиск в интернете!');
      weatherData = await fetchWeatherData(message);
    }

    // Сохраняем контекст беседы
    if (history.length > 10) {
      history = history.slice(-10);
    }

    // Если пользователь спросил "а в Питере?", бот должен помнить, что речь о погоде
    const lastUserMessage =
      history.length > 0
        ? history[history.length - 1].content.toLowerCase()
        : '';
    if (message.toLowerCase().includes('а в')) {
      const lastCityMatch = lastUserMessage.match(/в (\w+)/);
      if (lastCityMatch) {
        message = `погода в ${lastCityMatch[1]}`;
      }
    }

    history.push({ role: 'user', content: message });

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'Ты умный помощник. Всегда отвечай на русском. Анализируй интернет-данные и предлагай пользователю точный прогноз погоды, включая температуру, осадки, ветер и давление.',
      },
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    if (weatherData) {
      console.log(
        '🌍 Добавляем данные из интернета в запрос к DeepSeek:',
        weatherData,
      );
      messages.push({
        role: 'system',
        content: `Вот актуальные данные о погоде:\n${weatherData}\n\nПредставь информацию кратко и понятно.`,
      });
    }

    console.log(
      '📨 Отправляем в DeepSeek API:',
      JSON.stringify(messages, null, 2),
    );

    const completion = await openai.chat.completions.create({
      messages,
      model: 'deepseek-chat',
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('Неверный формат ответа от DeepSeek API');
    }

    const response = {
      message: completion.choices[0].message.content,
      history: [
        ...history,
        { role: 'assistant', content: completion.choices[0].message.content },
      ],
    };

    console.log('✅ Ответ от DeepSeek API:', response);
    return response;
  } catch (error) {
    console.error('❌ Ошибка при запросе к API DeepSeek:', error);
    throw error;
  }
}
