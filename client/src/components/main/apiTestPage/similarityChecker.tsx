/* eslint-disable no-console */
import React, { useState } from 'react';
import filterQueriesBySimilarity from '../../../services/sentenceSimilarityService';

interface Query {
  _id: string;
  text: string;
}

const SimilarityChecker: React.FC = () => {
  const [mainSentence, setMainSentence] = useState<string>('');
  const [queriesInput, setQueriesInput] = useState<string>('');
  const [similarQueries, setSimilarQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to parse queries input into Query objects
  const parseQueries = (input: string): Query[] =>
    input
      .split('\n')
      .map((text, index) => ({ _id: index.toString(), text: text.trim() }))
      .filter(query => query.text.length > 0);

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const queries = parseQueries(queriesInput);

    try {
      console.log('Main Sentence:', mainSentence);
      console.log('Queries:', queries);
      const results = await filterQueriesBySimilarity(mainSentence, queries);
      // Filter out any undefined values after mapping
      const similarQueryObjects = results
        .map(id => queries.find(query => query._id === id)) // This may return Query | undefined
        .filter((query): query is Query => query !== undefined); // Type guard to filter out undefined

      setSimilarQueries(similarQueryObjects); // Now similarQueries is guaranteed to be Query[]
    } catch (api_error) {
      setError('Error fetching similar queries. Please try again later.');
      console.error('API Error:', api_error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Similarity Checker</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor='mainSentence'>Main Sentence:</label>
          <input
            id='mainSentence'
            type='text'
            value={mainSentence}
            onChange={e => setMainSentence(e.target.value)}
            placeholder='Enter the main sentence'
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor='queriesInput'>Queries (one per line):</label>
          <textarea
            id='queriesInput'
            value={queriesInput}
            onChange={e => setQueriesInput(e.target.value)}
            placeholder='Enter each query on a new line'
            rows={6}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <button type='submit' disabled={isLoading} style={{ padding: '10px', width: '100%' }}>
          {isLoading ? 'Checking Similarities...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <h3>Most Similar Queries</h3>
        {similarQueries.length > 0 ? (
          <ul>
            {similarQueries.map(query => (
              <li key={query._id}>{query.text}</li>
            ))}
          </ul>
        ) : (
          <p>No similar queries found.</p>
        )}
      </div>
    </div>
  );
};

export default SimilarityChecker;
