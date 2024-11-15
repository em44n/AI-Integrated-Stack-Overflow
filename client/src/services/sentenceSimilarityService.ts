/* eslint-disable no-console */
import { Question } from '../types';
import getSimilarity from './huggingFace/sentenceSimilarityAPI';

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
 * @param mainSentence the sentence (string) to comapre to other Questions
 * @param questions array of Questions to compare main sentence with
 * @returns array of top 3 questions matching the mainSentence, can return anywhere from 0-3 Questions
 */
async function filterQuestionsBySimilarity(
  mainSentence: string,
  questions: Question[],
): Promise<Question[]> {
  const scoredQuestions: { question: Question; similarity: number }[] = [];
  for (const question of questions) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const similarity = await getSimilarity(mainSentence, question.text);
      console.log('Similarity:', similarity);
      if (similarity > 0.3) {
        scoredQuestions.push({ question, similarity });
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
