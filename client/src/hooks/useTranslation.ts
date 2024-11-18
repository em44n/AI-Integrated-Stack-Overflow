import { useEffect, useState } from 'react';
import { Question } from '../types';
import { translateQuestion } from '../services/translationService';

/**
 * Custom hook to translate a list of questions.
 * @param {Question[] | null} questions - List of questions to translate.
 * @returns object - Returns the translated questions, selected language, a function to set the selected language,
 *                   and the available languages for translation.
 */
const useTranslation = (
  questions: Question[] | null,
  setTranslatedQlist: (qlist: Question[] | null) => void,
) => {
  const languages = [
    'Arabic',
    'Czech',
    'German',
    'English',
    'Spanish',
    'Estonian',
    'Finnish',
    'French',
    'Gujarati',
    'Hindi',
    'Italian',
    'Japanese',
    'Kazakh',
    'Korean',
    'Lithuanian',
    'Latvian',
    'Burmese',
    'Nepali',
    'Dutch',
    'Romanian',
    'Russian',
    'Sinhala',
    'Turkish',
    'Vietnamese',
    'Chinese',
    'Afrikaans',
    'Azerbaijani',
    'Bengali',
    'Persian',
    'Hebrew',
    'Croatian',
    'Indonesian',
    'Georgian',
    'Khmer',
    'Macedonian',
    'Malayalam',
    'Mongolian',
    'Marathi',
    'Polish',
    'Pashto',
    'Portuguese',
    'Swedish',
    'Swahili',
    'Tamil',
    'Telugu',
    'Thai',
    'Tagalog',
    'Ukrainian',
  ];

  const [targetLang, setTargetLang] = useState('English');

  // Maps language names to Hugging Face language codes
  const getLanguageCode = (language: string): string => {
    const languageMap: { [key: string]: string } = {
      Arabic: 'ar_AR',
      Czech: 'cs_CZ',
      German: 'de_DE',
      English: 'en_XX',
      Spanish: 'es_XX',
      Estonian: 'et_EE',
      Finnish: 'fi_FI',
      French: 'fr_XX',
      Gujarati: 'gu_IN',
      Hindi: 'hi_IN',
      Italian: 'it_IT',
      Japanese: 'ja_XX',
      Kazakh: 'kk_KZ',
      Korean: 'ko_KR',
      Lithuanian: 'lt_LT',
      Latvian: 'lv_LV',
      Burmese: 'my_MM',
      Nepali: 'ne_NP',
      Dutch: 'nl_XX',
      Romanian: 'ro_RO',
      Russian: 'ru_RU',
      Sinhala: 'si_LK',
      Turkish: 'tr_TR',
      Vietnamese: 'vi_VN',
      Chinese: 'zh_CN',
      Afrikaans: 'af_ZA',
      Azerbaijani: 'az_AZ',
      Bengali: 'bn_IN',
      Persian: 'fa_IR',
      Hebrew: 'he_IL',
      Croatian: 'hr_HR',
      Indonesian: 'id_ID',
      Georgian: 'ka_GE',
      Khmer: 'km_KH',
      Macedonian: 'mk_MK',
      Malayalam: 'ml_IN',
      Mongolian: 'mn_MN',
      Marathi: 'mr_IN',
      Polish: 'pl_PL',
      Pashto: 'ps_AF',
      Portuguese: 'pt_XX',
      Swedish: 'sv_SE',
      Swahili: 'sw_KE',
      Tamil: 'ta_IN',
      Telugu: 'te_IN',
      Thai: 'th_TH',
      Tagalog: 'tl_XX',
      Ukrainian: 'uk_UA',
    };
    return languageMap[language] || 'en_XX'; // Default to English
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (targetLang && questions && targetLang !== 'English') {
          const translations = await Promise.all(
            questions.map(async question => {
              if (!question) return null;
              const translated = await translateQuestion({
                question,
                source_lang: getLanguageCode('English'),
                target_lang: getLanguageCode(targetLang),
              });
              return translated;
            }),
          );
          setTranslatedQlist(
            translations.filter(value => value !== null && value !== undefined) as Question[],
          );
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error translating questions:', error);
      }
    };

    fetchData();
  }, [targetLang, questions]);

  return {
    targetLang,
    setTargetLang,
    languages,
  };
};

export default useTranslation;
