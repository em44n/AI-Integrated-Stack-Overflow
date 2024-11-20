import React, { useState } from 'react';
import { getAIAnswer } from '../../../services/automatedAnswerService';

const QuestionAnswerComponent: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskQuestion = async () => {
    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await getAIAnswer({ question });
      setAnswer(response || 'No answer could be generated.');
    } catch (err) {
      setError('An error occurred while getting the answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h3>Ask a Question</h3>
      <input
        type='text'
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder='Type your question here...'
        style={{ width: '100%', padding: '8px', marginBottom: '10px', fontSize: '16px' }}
      />
      <button
        onClick={handleAskQuestion}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}>
        {loading ? 'Loading...' : 'Get Answer'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {answer && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
          }}>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionAnswerComponent;
