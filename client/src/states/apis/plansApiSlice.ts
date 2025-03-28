import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError, BaseQueryApi } from "@reduxjs/toolkit/query/react";
import { Mutex } from 'async-mutex';
import { FeaturesResponse, TiersResponse, UserPlansResponse } from "../../types";

// Mutex to prevent multiple simultaneous refresh attempts
const mutex = new Mutex();

// Define the base query with credentials
const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/plans/`,
  credentials: 'include', // Equivalent to withCredentials: true
});

// Custom protected base query to handle authentication and token refreshing
const protectedBaseQuery = async (
  baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  // Wait for any ongoing refresh to complete
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  // If the request fails with a 401, attempt token refresh
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Attempt to refresh the token
        const refreshResult = await baseQuery(
          { url: `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/refresh`, method: 'GET' },
          api,
          extraOptions
        );

        if ((refreshResult.meta as { response?: { status: number } })?.response?.status === 200) {
          // Refresh succeeded, retry the original request
          result = await baseQuery(args, api, extraOptions);
        } else if (refreshResult.error?.status === 401) {
          // Refresh token expired or missing
          throw new Error('Session has expired. Please sign in to continue.');
        } else {
          // Unexpected error during refresh
          throw new Error('An unexpected error occurred while refreshing the token.');
        }
      } finally {
        release(); // Release the mutex
      }
    } else {
      // Another refresh is in progress, wait and retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  // If there’s still an error, throw it
  if (result.error) {
    throw new Error('An unexpected error occurred while fetching data.');
  }

  return result;
};

// Conditional base query to apply protected logic only to specific endpoints
const conditionalBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Check if the endpoint is 'get-user-plans'
  const isProtectedEndpoint =
    typeof args === 'string' ? args === 'get-user-plans' : args.url === 'get-user-plans';

  if (isProtectedEndpoint) {
    // Use protected base query for 'get-user-plans'
    return protectedBaseQuery(baseQuery, args, api, extraOptions);
  } else {
    // Use standard base query for other endpoints
    return baseQuery(args, api, extraOptions);
  }
};

// Create the API slice with the conditional base query
export const plansApiSlice = createApi({
  reducerPath: "plans",
  baseQuery: conditionalBaseQuery,
  endpoints: (builder) => ({
    getTiers: builder.query<TiersResponse['data'][0], object>({
      query: () => "get-tiers",
      transformResponse: (response: TiersResponse) => response.data[0],
    }),
    getFeatures: builder.query<FeaturesResponse['data'][0], object>({
      query: () => "get-features",
      transformResponse: (response: FeaturesResponse) => response.data[0],
    }),
    getUserPlans: builder.query<UserPlansResponse['data'][0], object>({
      query: () => "get-user-plans",
      transformResponse: (response: UserPlansResponse) => response.data[0],
    }),
  }),
});

// Export the hooks for usage in components
export const { useGetTiersQuery, useGetFeaturesQuery, useGetUserPlansQuery } = plansApiSlice;