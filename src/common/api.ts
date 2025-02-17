import axios, { AxiosRequestConfig } from 'axios';

// Define the types
type HttpMethod = 'get' | 'post' | 'put' | 'delete';
type ApiEndpoint = Record<string, { url: string; method: HttpMethod }>;

// Base URL for the API
const apiBaseURL = 'http://localhost:5050/api';

// Helper function to create URLs
const createUrl = (endpoint: string) => `${apiBaseURL}/${endpoint}`;

// Define your endpoints
const SummaryApi: ApiEndpoint = {
  signUp: { url: createUrl('users/register'), method: 'post' },
  login: { url: createUrl('users/login'), method: 'post' },
};

export default SummaryApi;

/**
 * Make an API call using the centralized endpoints.
 * @param endpointKey - Key from the SummaryApi
 * @param data - Request payload (optional)
 * @param config - Additional Axios config (optional)
 */
export const apiCall = async (
  endpointKey: keyof typeof SummaryApi,
  data: Record<string, any> = {},
  config: AxiosRequestConfig = {}
) => {
  const endpoint = SummaryApi[endpointKey];

  try {
    const response = await axios({
      method: endpoint.method,
      url: endpoint.url,
      data: endpoint.method !== 'get' ? data : undefined,
      params: endpoint.method === 'get' ? data : undefined,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    console.error('API Call Error:', error?.response || error);
    throw error?.response?.data || error;
  }
};


// type HttpMethod = 'get' | 'post' | 'put' | 'delete';
// type ApiEndpoint = Record<string, { url: string; method: HttpMethod }>;

// const apiBaseURL = "http://localhost:5050/api"

// const createUrl = (endpoint: string) => `${apiBaseURL}/${endpoint}`;

// const SummaryApi: ApiEndpoint = {
//     signUp: {url: createUrl("users/register"), method: "post"},
//     login: {url: createUrl('users/login'), method: "post"}

// }

// export default SummaryApi;