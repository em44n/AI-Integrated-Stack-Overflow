import { useNavigate } from 'react-router-dom';
import useSimilarQuestions from '../../../hooks/useSimilarQuestions';
import './index.css';

/**
 * Interface reprsenting the props for the SimilarQuestions component
 * - text: text of the question being checked for similarity
 */
interface SimiliarQuestionsProps {
  text: string;
}

/**
 * SimilarQuestions component shows the users at most the top 3 similar questions to the text being inputted.
 * @param text: text of the question being checked for similarity
 */
const SimilarQuestions = ({ text }: SimiliarQuestionsProps) => {
  const navigate = useNavigate();
  const { similarQuestions } = useSimilarQuestions(text);
  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleSelectSimilarQuestion = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };
  if (!similarQuestions || similarQuestions.length === 0) {
    return <></>;
  }
  return (
    <div className='similar-questions'>
      <p className='similar-section-title'>
        {similarQuestions !== undefined && similarQuestions.length === 1
          ? 'Question that may be similar'
          : 'Questions that may be similar'}
      </p>
      {similarQuestions !== undefined && (
        <div className='similar-container'>
          <ul className='similar-list'>
            {similarQuestions.length > 0 &&
              similarQuestions.map((question, index) => (
                <li key={index} className='similar-item'>
                  <div
                    className='similar-link'
                    onClick={() => {
                      if (question._id) {
                        handleSelectSimilarQuestion(question._id);
                      }
                    }}>
                    <p className='similar-title'>{question.title}</p>
                    <p className='similar-text'>{question.text}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SimilarQuestions;
