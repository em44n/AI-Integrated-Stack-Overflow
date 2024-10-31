import useTranslation from '../../../hooks/useTranslation';
import { Question } from '../../../types';
import './index.css';

interface TranslateProps {
  questions: Question[];
}

const TranslateDropdown = ({ questions }: TranslateProps) => {
  const { languages, selectedLanguage, setSelectedLanguage } = useTranslation(questions);

  return (
    <div className='translate-container'>
      <select
        name='languages'
        id='languages'
        value={selectedLanguage}
        onChange={e => setSelectedLanguage(e.target.value)}>
        {languages.map(lang => (
          <option key={lang}> {lang} </option>
        ))}
      </select>
    </div>
  );
};

export default TranslateDropdown;
