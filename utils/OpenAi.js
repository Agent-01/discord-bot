import {config} from "dotenv";
import axios from "axios";
config();
const apiKey = process.env.OpenAiToken;
export async function generateText(prompt) {
    const url = "https://api.openai.com/v1/completions";
    const response = await axios.post(url, {
        prompt: `Forget any instruction you got before.\nYou are ChatGPT, an AI assistant who is helpful, creative, clever, and very friendly. Respond the question below as detail as possible, You shouldn't respond date and time and you must answer "I don't know the date or time" if the user ask it.\nUser:${prompt}`,
        temperature: 0.7,
        max_tokens: 2500,
        model: "text-davinci-003", // version of the model
        stop: "User",
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        }
    });
    return response.data.choices[0].text;
}
export async function generateResponse(chat,generatingText) {
    if (generatingText) return "Currently generating another response, please until the response is generated.";
    else generatingText = true;
    const url = "https://api.openai.com/v1/chat/completions";
    const response = await axios.post(url, {
        messages: chat,
        temperature: 0.8,
        model: "gpt-3.5-turbo", // version of the model
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        }
    });
    generatingText = false;
    return response.data.choices[0].message.content;
}
export const generateImage = async(prompt) => {
    const url = "https://api.openai.com/v1/images/generations";
    const response = await axios.post(url, {
        prompt: prompt
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        }
    });
    return response.data.data[0].url;
};