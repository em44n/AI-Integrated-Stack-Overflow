import React from 'react';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';
import TranslateDropdown from '../translate';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, translatedQlist, setTranslatedQlist, setQuestionOrder } =
    useQuestionPage();
  const displayedQuestions = translatedQlist || qlist;
  return (
    <>
      <QuestionHeader
        titleText={titleText}
        qcnt={displayedQuestions.length}
        setQuestionOrder={setQuestionOrder}
      />
      <TranslateDropdown
        questions={qlist}
        prevTranslated={translatedQlist}
        translated={setTranslatedQlist}
      />
      <div id='question_list' className='question_list'>
        {displayedQuestions.map((q, idx) => (
          <QuestionView q={q} key={idx} />
        ))}
      </div>
      {titleText === 'Search Results' && !displayedQuestions.length && (
        <div className='bold_title right_padding'>No Questions Found</div>
      )}
    </>
  );
};

export default QuestionPage;
