import SimilarityChecker from './similarityChecker';
import QuestionAnswerComponent from './questionAnswer';

const APITestPage = () => (
  <>
    <div className='space_between right_padding'>
      <SimilarityChecker /> {/* Include the TextQuery component here */}
    </div>
    <div>
      <QuestionAnswerComponent />
    </div>
  </>
);

export default APITestPage;
