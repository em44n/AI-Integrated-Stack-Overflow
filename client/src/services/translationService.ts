import { Question } from '../types';
import { postAIRequest } from './huggingFace/huggingFaceAPI';

const TRANSLATION_AI_MODEL = 'facebook/mbart-large-50-many-to-many-mmt';

interface TranslationRequest {
  text: string;
  source_lang: string;
  target_lang: string;
}

interface TranslationResponse {
  translation_text: string;
}

/**
 * Interface representing request data to translation API when translating a question
 * - question: Question to translate
 * - source_lang: original language of question
 * - target_lang: language to translate question to
 */
interface TranslateQuestionRequest {
  question: Question;
  source_lang: string;
  target_lang: string;
}

const translateText = async (data: TranslationRequest): Promise<string | null> => {
  const response: TranslationResponse[] | null = await postAIRequest(
    { inputs: data.text, parameters: { src_lang: data.source_lang, tgt_lang: data.target_lang } },
    TRANSLATION_AI_MODEL,
  );

  if (response == null) {
    throw new Error('Could not fetch translated text from Hugging Face API.');
  }

  return response[0].translation_text;
};

/**
 * Function to connect with hugging face translation API and translate all the text-based fields of a Question
 * @param data request that includes the question to translate and the language to translate to and from
 * @returns translated Question or null if the question could not be translated
 */
const translateQuestion = async (data: TranslateQuestionRequest): Promise<Question | null> => {
  try {
    const translateField = async (text: string): Promise<string> => {
      if (text === undefined) return '';
      const response: TranslationResponse[] | null = await postAIRequest(
        {
          inputs: text,
          parameters: { src_lang: data.source_lang, tgt_lang: data.target_lang },
        },
        TRANSLATION_AI_MODEL,
      );
      return response?.[0].translation_text || text;
    };

    // translate all the text-based fields of question
    const translatedTitle = await translateField(data.question.title);
    const translatedText = await translateField(data.question.text);
    const translatedComments = await Promise.all(
      data.question.comments.map(async comment => ({
        ...comment,
        text: await translateField(comment.text),
      })),
    );
    const translatedAnswers = await Promise.all(
      data.question.answers.map(async answer => ({
        ...answer,
        text: await translateField(answer.text),
        comments: await Promise.all(
          answer.comments.map(async comment => ({
            ...comment,
            text: await translateField(comment.text),
          })),
        ),
      })),
    );

    return {
      ...data.question,
      title: translatedTitle || data.question.title,
      text: translatedText || data.question.text,
      comments: translatedComments,
      answers: translatedAnswers,
    };
  } catch (error) {
    throw new Error(`Error translating question: ${error}`);
  }
};

export { translateText, translateQuestion };
