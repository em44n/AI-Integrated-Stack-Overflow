import axios from 'axios';

const API_URL = 'https://api-inference.huggingface.co/models';
const API_KEY = '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';

/*
 * Interface representing request data to Hugging Face API
 * - inputs: Input data for the AI model
 * - parameters: Parameters for the AI model
 */
export interface HuggingFaceRequest<TInput, TParameters> {
  inputs: TInput;
  parameters?: TParameters;
}

/*
 * Function to connect with Hugging Face API and get the response
 * @param data request that includes the input data and parameters for the AI model
 * @param aiModel the AI model to use for the request
 * @returns response from the AI model
 */
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
    const err = new Error('Request failed') as Error & { code?: number; details?: object };

    if (axios.isAxiosError(error) && error.response) {
      err.code = error.response.status;
      err.details = error.response.data;
    } else {
      err.code = undefined;
      err.details = {
        error: 'Unknown error',
        message: error instanceof Error ? error.message : String(error),
      };
    }
    throw err;
  }
}
