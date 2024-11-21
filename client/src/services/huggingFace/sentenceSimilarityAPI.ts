/* eslint-disable no-console */
import axios from 'axios';

// Hugging Face API URL and Token
const HF_API_URL =
  'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';
const HF_API_TOKEN = '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';

// Function to get similarities of a sentence with another sentence using Hugging Face API
async function getSimilarity(mainSentence: string, sentenceToCompare: string): Promise<number> {
  console.log('Getting embedding for:', sentenceToCompare);
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: {
          source_sentence: mainSentence,
          sentences: [sentenceToCompare],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
        },
      },
    );
    console.log('Similarity:', response.data[0]);
    return response.data[0];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error fetching embedding:', error.response.data);
    } else {
      console.error('Error fetching embedding:', error);
    }
    throw new Error('Could not fetch embedding from Hugging Face API.');
  }
}

export default getSimilarity;
