import useTranslation from '../../../hooks/useTranslation';
import { Question } from '../../../types';
import './index.css';

interface TranslateProps {
  questions: Question[];
  translated: (qlist: Question[] | null) => void;
}

const TranslateDropdown = ({ questions, translated }: TranslateProps) => {
  const { languages, targetLang, setTargetLang } = useTranslation(questions, translated);

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
