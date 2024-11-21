import { postAIRequest } from './huggingFace/huggingFaceAPI';

const TEXT_GENERATOR_AI_MODEL = 'Qwen/Qwen2.5-Coder-32B-Instruct';

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
  const response: AnswerResponse[] | null = await postAIRequest(
    {
      inputs: prompt,
      parameters: {
        max_length: 300,
        temperature: 0.3,
        top_p: 0.8,
      },
    },
    TEXT_GENERATOR_AI_MODEL,
  );

  if (response == null) {
    throw new Error('Could not fetch AI generated text from Hugging Face API.');
  }

  return removeRepeatedPrompt(prompt, response[0].generated_text);
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
