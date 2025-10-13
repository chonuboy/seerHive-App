import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/api/api_URL';
import { Location } from '@/lib/definitions'; // Ensure this import is correct

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('X-Requested-With', 'XMLHttpRequest');
      headers.set('Authorization', 'Basic ' + btoa(`gulshan:1234`)); // Ensure this is correct
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => 'api/locations', // Ensure this path is correct
    }),
    addLocation: builder.mutation<Location, Partial<Location>>({
      query: (newLocation) => ({
        url: 'api/locations', // Ensure this path is correct
        method: 'POST',
        body: newLocation,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useGetLocationsQuery, useAddLocationMutation } = apiSlice;