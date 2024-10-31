import { Question } from '../types';
import api from './config';

const QUESTION_API_URL = `${process.env.REACT_APP_SERVER_URL}/question`;

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question being translated.
 * - language - The comment being translated to.
 */
interface TranslateRequestBody {
  ids: string[];
  language: string;
}

/**
 * Translates a specific question.
 *
 * @param ids - The IDs of the questions to translate.
 * @param language - The language to be translated to.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const translateQuestions = async (ids: string[], language: string): Promise<Question[]> => {
  const reqBody: TranslateRequestBody = {
    ids,
    language,
  };
  const res = await api.post(`${QUESTION_API_URL}/translateQuestions`, reqBody);
  if (res.status !== 200) {
    throw new Error('Error while translating question');
  }
  return res.data;
};

export default translateQuestions;
