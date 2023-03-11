import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// DOCS : https://blog.openreplay.com/building-an-encyclopedia-with-react-and-wikipedia-search-api

/**
 * Fetch Holiday Wiki Data
 * @param holiday Target Holiday
 * @returns Holiday Wiki Data
 */
export const fetchWikiData = async (holiday: string): Promise<any> => {
    const searchQuery: string = holiday.trim().toLowerCase();
    if (searchQuery.length > 0) {
        const url: string = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
        const response: Response = await fetch(url);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();
    }
};

const baseUrl: string = `https://en.wikipedia.org/w/api.php`;

const queryOptions: string = `action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20`;

/**
 * Wiki API
 */
export const wikiApi = createApi({
    reducerPath: 'wikiApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
    }),
    endpoints: (builder) => ({
        getHolidayData: builder.query({
            query: (holiday) => ({
                url: `?${queryOptions}&srsearch=${encodeURIComponent(holiday.trim().toLowerCase())}`,
                responseHandler: async (res) => await res.json(),
            }),
        }),
    }),
});

export const {
    useGetHolidayDataQuery
} = wikiApi;
