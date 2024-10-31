import { useEffect, useState } from 'react';
import { Question } from '../types';
import translateQuestion from '../services/translationService';

/**
 * Custom hook to translate question.
 * @param {Question | null} questions - questions to translate
 * @returns object - Returns object containing the translated question, selected language, and a function for
 *                   setting the selected language, and the available languages to translate to.
 *
 * @throws it will throw an error if the context is not found or is null.
 */
const useTranslation = (questions: Question[] | null) => {
  const languages = [
    'English',
    'Chinese',
    'Spanish',
    'Arabic',
    'Hindi',
    'Bengali',
    'Portuguese',
    'Russian',
    'Japanese',
    'Lahnda',
    'French',
    'Indonesian',
    'German',
    'Marathi',
    'Telugu',
    'Turkish',
    'Tamil',
    'Vietnamese',
  ];

  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language
  const [translatedQuestions, setTranslatedQuestions] = useState<Question[] | null>(questions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedLanguage && questions) {
          const questionIds = questions.map(q => q._id).filter(id => id !== undefined);
          const res = await translateQuestion(questionIds, selectedLanguage);
          setTranslatedQuestions(res);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error translating question:', error);
      }
    };
    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [selectedLanguage, questions]);

  return {
    translatedQuestions,
    selectedLanguage,
    setSelectedLanguage,
    setTranslatedQuestions,
    languages,
  };
};

export default useTranslation;
