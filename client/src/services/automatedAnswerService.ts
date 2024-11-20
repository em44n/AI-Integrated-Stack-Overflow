/* eslint-disable no-console */
import axios from 'axios';

const API_URL = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct';
const API_KEY = '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';

interface QuestionRequest {
  question: string;
}

interface AnswerResponse {
  generated_text: string;
}

const removeRepeatedPrompt = (prompt: string, answer: string): string => {
  const cleanedAnswer = answer.trimStart();
  return cleanedAnswer.startsWith(prompt)
    ? cleanedAnswer.slice(prompt.length).trimStart()
    : cleanedAnswer;
};

const generateAIText = async (prompt: string): Promise<string | null> => {
  try {
    const response = await axios.post<AnswerResponse[]>(
      API_URL,
      {
        inputs: prompt,
        max_length: 300,
        temperature: 0.3,
        top_p: 0.8,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response.data[0].generated_text);
    return removeRepeatedPrompt(prompt, response.data[0].generated_text);
  } catch (error) {
    console.error('Error getting answer:', error);
    return null;
  }
};

export const getAIAnswer = async (data: QuestionRequest): Promise<string | null> => {
  const answer = await generateAIText(`${data.question} Answer in 300 characters or less.`);
  if (answer === null) {
    return null;
  }

  return answer;
};

export const getAITags = async (data: QuestionRequest): Promise<string[]> => {
  const generatedText = await generateAIText(
    `Generate 3 tags only to describe this text "${data.question}". Return all the tags inside a [] separated by a space and no other characters.`,
  );
  if (generatedText === null) {
    return [];
  }

  const match = generatedText.match(/\[(.*?)\]/);
  if (match && match[1]) {
    const tagNames = match[1]
      .split(' ')
      .map(tagName => tagName.trim())
      .filter(tagName => tagName !== '');
    return tagNames;
  }
  return [];
};
