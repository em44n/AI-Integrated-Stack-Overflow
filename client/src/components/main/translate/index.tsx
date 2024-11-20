import useTranslation from '../../../hooks/useTranslation';
import { Question } from '../../../types';
import './index.css';

/**
 * Interface that represents the props for the translation dropdown component
 * - questions: array of questions to translate
 * - prevTranslated: previously translated questions
 * - translated: function to set the value of the translated questions
 */
interface TranslateProps {
  questions: Question[];
  prevTranslated: Question[] | null;
  translated: (qlist: Question[] | null) => void;
}

/**
 * TranslateDropdown component shows the users all the possible languages to translate to and allows the users to select and translate the questions into a different language.
 * @param questions: array of questions to translate
 * @param prevTranslated: previously translated questions
 * @param translated: function to set the value of the translated questions
 */
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
