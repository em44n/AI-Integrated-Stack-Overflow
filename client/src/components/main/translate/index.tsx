import { useCallback } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { Question } from '../../../types';
import './index.css';

interface TranslateProps {
  questions: Question[];
  prevTranslated: Question[] | null;
  translated: (qlist: Question[] | null) => void;
}

const TranslateDropdown = ({ questions, prevTranslated, translated }: TranslateProps) => {
  const { languages, targetLang, setTargetLang } = useTranslation(
    questions,
    prevTranslated,
    translated,
  );

  const handleLanguageChange = async (language: string) => {
    setTargetLang(language);

    if (language === 'English') {
      translated(null);
    }
  };

  return (
    <div className='translate-container'>
      <select
        name='languages'
        id='languages'
        value={targetLang}
        onChange={e => handleLanguageChange(e.target.value)}>
        {languages.map(lang => (
          <option key={lang}> {lang} </option>
        ))}
      </select>
    </div>
  );
};

export default TranslateDropdown;
