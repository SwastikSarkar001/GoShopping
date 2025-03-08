import axios, { AxiosResponse } from 'axios'

/**
 * Performs a protected axios request that requires valid authentication.
 * If the request returns a 401 (indicating an invalid/missing access token),
 * it calls the refresh endpoint to regenerate the access token and retries the original request.
 * 
 * @param requestFn - A function that returns a Promise resolving to an AxiosResponse.
 * @returns A Promise resolving to the response data of the original request.
 * @throws An error if both the original request and the refresh attempt fail.
 */
export default async function performProtectedRequest<T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<T> {
  // Attempt the original request
  const response = await requestFn()

  // If valid access token, return the data
  if (response.status === 200) {
    return response.data
  }
  
  // If unauthorized, try to refresh the token
  if (response.status === 401) {
    const refreshResponse = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/refresh`,
      {
        withCredentials: true,
        validateStatus: (status) => status === 200 || status === 401
      }
    )

    if (refreshResponse.status === 200) {
      // If refresh succeeded, retry the original request once
      const retryResponse = await requestFn();
      if (retryResponse.status === 200) {
        return retryResponse.data;
      } else {
        throw new Error('Failed to fetch data even after refreshing the token.');
      }
    } else if (refreshResponse.status === 401) {
      // Refresh token expired or missing
      throw new Error('Session has expired. Please sign in to continue.')
    } else {
      throw new Error('An unexpected error occurred while refreshing the token.')
    }
  }
  
  // Handle any unexpected status codes from the original request
  throw new Error('An unexpected error occurred while fetching data.')
}