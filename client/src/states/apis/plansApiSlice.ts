import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FeaturesResponse, TiersResponse } from "../../types";

export const plansApiSlice = createApi({
  reducerPath: "plans",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/plans/`
  }),
  endpoints: (builder) => ({
    getTiers: builder.query<TiersResponse['data'][0], object>({
      query: () => "get-tiers",
      transformResponse: (response: TiersResponse) => response.data[0]
    }),
    getFeatures: builder.query<FeaturesResponse['data'][0], object>({
      query: () => "get-features",
      transformResponse: (response: FeaturesResponse) => response.data[0]
    }),
  }),
})

export const { useGetTiersQuery, useGetFeaturesQuery } = plansApiSlice