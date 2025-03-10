"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToDeepSeek = sendMessageToDeepSeek;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Загружаем переменные из .env
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com'; // Уточните URL в документации DeepSeek
async function sendMessageToDeepSeek(message) {
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                // Добавьте другие параметры, если требуется
            }),
        });
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Ошибка при запросе к API DeepSeek:', error);
        throw error;
    }
}
