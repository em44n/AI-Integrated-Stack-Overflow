import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { Question } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import { filterQuestionsBySimilarity } from '../../../services/sentenceSimilarityService';
import { getQuestionsByFilter } from '../../../services/questionService';

/**
 * QuestionsToAnswerPage component renders a page displaying a list of questions
 * recommended to a user to answer based on questions they have already answered.
 * It includes links to the recommended questions.
 */
const QuestionsToAnswerPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[] | undefined>();
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchRecommendedQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestionsByFilter();

        // find questions that user has already answered
        const answeredQuestions = fetchedQuestions.filter(question =>
          question.answers.some(answer => answer.ansBy === user.username),
        );

        if (answeredQuestions.length === 0) {
          setError("you don't have enough answer history. Go answer more questions!");
          return;
        }

        // find questions that user has not answered
        const unansweredQuestions = fetchedQuestions.filter(
          question => !answeredQuestions.some(ans => ans._id === question._id),
        );

        const recommendedQuestions: Question[] = [];

        // find similar questions for all answered questions
        const similarQuestionsPromises = answeredQuestions.map(answeredQuestion =>
          filterQuestionsBySimilarity(
            answeredQuestion._id || null,
            answeredQuestion.text,
            unansweredQuestions,
          ),
        );

        const similarQuestionsResults = await Promise.all(similarQuestionsPromises);

        // add at most 3 recommended questions to the list
        similarQuestionsResults.forEach(similarQuestions => {
          if (recommendedQuestions.length >= 3) return;

          for (const similarQuestion of similarQuestions) {
            if (!recommendedQuestions.some(q => q._id === similarQuestion._id)) {
              recommendedQuestions.push(similarQuestion);
              if (recommendedQuestions.length >= 3) break;
            }
          }
        });

        if (recommendedQuestions.length === 0) {
          setError('you have answered all recommended questions. Nice work!');
          return;
        }

        setQuestions(recommendedQuestions || []);
      } catch (err) {
        setError("you don't have enough answer history. Go answer more questions!");
      }
    };
    fetchRecommendedQuestions();
  }, [user.username]);

  const navigate = useNavigate();
  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleSelectRecommendedQuestions = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <div>
      <div className='space_between right_padding'>
        <div className='bold_title'>Recommended Questions to Answer</div>
      </div>
      <div className='space_between right_padding'>
        {error && (
          <div className='error-message'>
            {user.username}, {error}
          </div>
        )}
        <ul className='questions-list'>
          {questions &&
            questions.map(question => (
              <li key={question._id} className='question-item'>
                <div
                  className='question-link'
                  onClick={() => {
                    if (question._id) {
                      handleSelectRecommendedQuestions(question._id);
                    }
                  }}>
                  {question.text}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionsToAnswerPage;
