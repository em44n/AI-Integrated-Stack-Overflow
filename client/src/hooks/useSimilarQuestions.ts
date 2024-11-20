import { useEffect, useState } from 'react';
import { Question } from '../types';
import { filterQuestionsBySimilarity } from '../services/sentenceSimilarityService';
import { getQuestionsByFilter } from '../services/questionService';

/**
 * Custom hook for managing the state and logic of the similar questions on the question form.
 * @param text - the text of the question to check similarity for
 * @returns similarQuestions - array of questions are similar to the question the user is writing
 */
const useSimilarQuestions = (text: string) => {
  const [similarQuestions, setSimilarQuestions] = useState<Question[] | undefined>();
  const [prevWordCount, setPrevWordCount] = useState(0);

  useEffect(() => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount !== prevWordCount) {
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
