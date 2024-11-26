import { Question } from '../types';
import { postAIRequest } from './huggingFace/huggingFaceAPI';

// Hugging Face API URL and Token
const SIMILARITY_AI_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

/*
 * Function to connect with hugging face similarity API and get the similarity between two sentences
 * @param mainSentence the sentence to compare to
 * @param sentenceToCompare the sentence to compare with mainSentence
 * @returns similarity score between the two sentences
 */
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

  return response[0];
}

/**
 * Function to get the similarity of a sentence compared to Queries
 * @param mainSentence the sentence (string) to comapre to other Queries
 * @param queries array of Queries to compare main sentence with
 * @returns array of matching query IDs
 */
async function filterQueriesBySimilarity(
  mainSentence: string,
  queries: { _id: string; text: string }[],
): Promise<string[]> {
  const matchingIds: string[] = [];

  const similarities = await Promise.all(
    queries.map(async query => {
      try {
        const similarity = await getSimilarity(mainSentence, query.text);
        return { _id: query._id, similarity };
      } catch (error) {
        throw new Error(`Error comparing with query ID ${query._id}: ${error}`);
      }
    }),
  );

  for (const { _id: id, similarity } of similarities) {
    if (similarity == null) {
      return [];
    }
    if (similarity > 0.5) {
      matchingIds.push(id);
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
  const similarities = await Promise.all(
    questions.map(async question => {
      if (question._id !== qid) {
        try {
          const similarity = await getSimilarity(mainSentence, question.text);
          return { question, similarity };
        } catch (error) {
          throw new Error(`Error comparing with query ID ${question._id}: ${error}`);
        }
      }
      return null;
    }),
  );

  for (const result of similarities) {
    if (result && result.similarity > 0.3) {
      scoredQuestions.push(result);
    }
  }
  return scoredQuestions
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map(scoredQuestion => scoredQuestion.question);
}

export { filterQueriesBySimilarity, filterQuestionsBySimilarity };
