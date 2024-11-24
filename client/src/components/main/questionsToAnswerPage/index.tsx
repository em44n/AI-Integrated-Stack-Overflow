import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';
import { Question } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import { filterQuestionsBySimilarity } from '../../../services/sentenceSimilarityService';
import { getQuestionsByFilter } from '../../../services/questionService';

const QuestionsToAnswerPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[] | undefined>();
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchRecommendedQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestionsByFilter();

        const answeredQuestions = fetchedQuestions.filter(question =>
          question.answers.some(answer => answer.ansBy === user.username),
        );

        if (answeredQuestions.length === 0) {
          setError("You don't have enough answer history. Go answer more questions!");
          return;
        }

        const unansweredQuestions = fetchedQuestions.filter(
          question => !answeredQuestions.some(ans => ans._id === question._id),
        );

        const recommendedQuestions: Question[] = [];

        const similarQuestionsPromises = answeredQuestions.map(answeredQuestion =>
          filterQuestionsBySimilarity(
            answeredQuestion._id || null,
            answeredQuestion.text,
            unansweredQuestions,
          ),
        );

        const similarQuestionsResults = await Promise.all(similarQuestionsPromises);

        similarQuestionsResults.forEach(similarQuestions => {
          if (recommendedQuestions.length >= 3) return;

          for (const similarQuestion of similarQuestions) {
            if (!recommendedQuestions.some(q => q._id === similarQuestion._id)) {
              recommendedQuestions.push(similarQuestion);
              if (recommendedQuestions.length >= 3) break;
            }
          }
        });

        setQuestions(recommendedQuestions || []);
      } catch (err) {
        setError("you don't have enough answer history... go answer more questions!");
      }
    };
    fetchRecommendedQuestions();
  }, [user.username]);

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
                <NavLink to={`/questions/${question._id}`} className='question-link'>
                  {question.text}
                </NavLink>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionsToAnswerPage;
