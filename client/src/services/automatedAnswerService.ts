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

const removeRepeatedQuestion = (question: string, answer: string): string => {
  const cleanedAnswer = answer.trimStart();
  return cleanedAnswer.startsWith(question)
    ? cleanedAnswer.slice(question.length).trimStart()
    : cleanedAnswer;
};

const getAIAnswer = async (data: QuestionRequest): Promise<string | null> => {
  try {
    const question = `${data.question} Answer in 300 characters or less.`;
    const response = await axios.post<AnswerResponse[]>(
      API_URL,
      {
        inputs: question,
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
    return removeRepeatedQuestion(question, response.data[0].generated_text);
  } catch (error) {
    console.error('Error getting answer:', error);
    return null;
  }
};

export default getAIAnswer;
