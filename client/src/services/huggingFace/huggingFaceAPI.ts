/* eslint-disable no-console */
import axios from 'axios';

const API_URL = 'https://api-inference.huggingface.co/models';
const API_KEY = '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';

export interface HuggingFaceRequest<TInput, TParameters> {
  inputs: TInput;
  parameters?: TParameters;
}

export async function postAIRequest<TInput, TParameters, TResponse>(
  data: HuggingFaceRequest<TInput, TParameters>,
  aiModel: string,
): Promise<TResponse | null> {
  try {
    const response = await axios.post<TResponse>(`${API_URL}/${aiModel}`, data, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('API error:', error.response.data);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}
