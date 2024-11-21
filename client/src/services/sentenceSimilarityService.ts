/* eslint-disable no-console */
import { Question } from '../types';
import { postAIRequest } from './huggingFace/huggingFaceAPI';

// Hugging Face API URL and Token
const SIMILARITY_AI_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

// Function to get similarities of a sentence with another sentence using Hugging Face API
async function getSimilarity(mainSentence: string, sentenceToCompare: string): Promise<number> {
  const response: number[] | null = await postAIRequest(
    {
      inputs: {
        source_sentence: mainSentence,
        sentences: [sentenceToCompare],
      },
    },
    SIMILARITY_AI_MODEL,
  );

  if (response == null) {
    throw new Error('Could not fetch embedding from Hugging Face API.');
  }

  console.log('Similarity:', response);
  return response[0];
}

// Function to filter queries based on similarity to the main sentence
// NOTE: The queries input type may be changed depending on the usage of this function
async function filterQueriesBySimilarity(
  mainSentence: string,
  queries: { _id: string; text: string }[],
): Promise<string[]> {
  const matchingIds: string[] = [];

  for (const query of queries) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const similarity = await getSimilarity(mainSentence, query.text);
      console.log('Similarity:', similarity);
      if (similarity == null) {
        return [];
      }
      if (similarity > 0.5) {
        matchingIds.push(query._id);
      }
      console.log('Matching IDs:', matchingIds);
    } catch (error) {
      console.error(`Error comparing with query ID ${query._id}:`, error);
    }
  }

  return matchingIds;
}

/**
 * Function to get the similarity of a sentence compared to Questions
 * @param qid the id of the quesiton being compared to other questions, null if the question doesn't exist yet
 * @param mainSentence the sentence (string) to comapre to other Questions
 * @param questions array of Questions to compare main sentence with
 * @returns array of top 3 questions matching the mainSentence, can return anywhere from 0-3 Questions
 */
async function filterQuestionsBySimilarity(
  qid: string | null,
  mainSentence: string,
  questions: Question[],
): Promise<Question[]> {
  const scoredQuestions: { question: Question; similarity: number }[] = [];
  for (const question of questions) {
    try {
      if (question._id !== qid) {
        // eslint-disable-next-line no-await-in-loop
        const similarity = await getSimilarity(mainSentence, question.text);
        console.log('Similarity:', similarity);
        if (similarity == null) {
          return [];
        }
        if (similarity > 0.3) {
          scoredQuestions.push({ question, similarity });
        }
      }
    } catch (error) {
      console.error(`Error comparing with query ID ${question._id}:`, error);
    }
  }
  return scoredQuestions
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map(scoredQuestion => scoredQuestion.question);
}

export { filterQueriesBySimilarity, filterQuestionsBySimilarity };
