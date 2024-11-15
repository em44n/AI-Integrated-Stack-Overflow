import { useEffect, useState } from 'react';
import { Question } from '../types';
import { filterQuestionsBySimilarity } from '../services/sentenceSimilarityService';
import { getQuestionsByFilter } from '../services/questionService';

/**
 * Custom hook for managing the state and logic of the similar questions on the question form.
 *
 * @returns similarQuestions - array of questions are similar to the question the user is writing
 */
const useSimilarQuestions = (text: string) => {
  const [similarQuestions, setSimilarQuestions] = useState<Question[] | undefined>();
  const [prevWordCount, setPrevWordCount] = useState(0);

  useEffect(() => {
    // get the updated similar questions when the user types - api call
    /**
     * Function to fetch questions based on the filter and update the question list.
     */
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    // Only fetch data if a word was added/removed
    if (wordCount !== prevWordCount) {
      // wordCount >= someNumber && wordCount % someNumber === 0 --> can add this to run it every someNumber words
      setPrevWordCount(wordCount);
      const fetchData = async () => {
        try {
          const questions = await getQuestionsByFilter();
          const res = await filterQuestionsBySimilarity(text, questions);
          setSimilarQuestions(res || []);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      };
      fetchData();
    }
  }, [text, prevWordCount]);

  return {
    similarQuestions,
  };
};

export default useSimilarQuestions;
