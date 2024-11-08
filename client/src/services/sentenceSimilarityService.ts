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

// Function to filter queries based on similarity to the main sentence
// NOTE: The queries input type may be changed depending on the usage of this function
async function filterQuestionsBySimilarity(
  mainSentence: string,
  queries: Question[],
): Promise<Question[]> {
  const matchingIds: Question[] = [];

  for (const query of queries) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const similarity = await getSimilarity(mainSentence, query.text);
      console.log('Similarity:', similarity);
      if (similarity > 0.5) {
        matchingIds.push(query);
      }
      console.log('Matching IDs:', matchingIds);
    } catch (error) {
      console.error(`Error comparing with query ID ${query._id}:`, error);
    }
  }

  return matchingIds;
}

export { filterQueriesBySimilarity, filterQuestionsBySimilarity };
