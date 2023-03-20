import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// DOCS : https://blog.openreplay.com/building-an-encyclopedia-with-react-and-wikipedia-search-api

/**
 * Fetch Holiday Wiki Data
 * @param holiday Target Holiday
 * @returns Holiday Wiki Data
 */
export const fetchWikiData = async (holiday: string): Promise<any> => {
    const searchQuery: string = holiday?.trim()?.toLowerCase();
    if (searchQuery.length > 0) {
        const url: string = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
        const response: Response = await fetch(url);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();
    }
};

/**
 * Base API URL
 */
const baseUrl: string = `https://en.wikipedia.org/w/api.php`;

// action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20

/**
 * Query Param Options
 */
const queryOptions: string = `action=query&list=search&prop=info&inprop=url&utf8=&origin=*&srlimit=20`;

/**
 * Create Search Result
 * @param result Search Result
 * @returns Wiki Search Result
 */
export const createSearchResult = (result: SearchResult) => ({
    ns: result.ns,
    title: result.title,
    pageid: result.pageid,
    size: result.size,
    wordcount: result.wordcount,
    snippet: result.snippet,
    timestamp: result.timestamp,
});

/**
 * Wiki Search Result
 */
export type SearchResult = {
    ns: number;
    title: string;
    pageid: number;
    size: number;
    wordcount: number;
    snippet: string;
    timestamp: string;
};

/**
 * Wikipedia Search Query Response
 */
export type WikiQueryResponse = {
    batchcomplete: string;
    continue: {
        sroffset: number;
        continue: string;
    };
    query: {
        searchinfo: {
            totalhits: number;
        };
        search: SearchResult[];
    };
};

/**
 * Wiki API
 */
export const wikiApi = createApi({
    reducerPath: 'wikiApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers: Headers) => {
            headers.set('Access-Control-Allow-Origin', '*');
            return headers;
        },
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getHolidayData: builder.query({
            query: (holiday) => ({
                url: `?${queryOptions}&srsearch=${encodeURIComponent(holiday.trim().toLowerCase())}`,
                params: {
                    action: 'query',
                    list: 'search',
                    prop: 'info',
                    inprop: 'url',
                    utf8: '&',
                    format: 'json',
                    origin: '*',
                    srlimit: '20',
                },
                responseHandler: async (res: Response) => await res.json(),
            }),
            transformResponse: (response: WikiQueryResponse) => {
                if (response.query.searchinfo.totalhits > 0) {
                    return response.query.search.map(
                        (result: SearchResult) => createSearchResult(result)
                    );
                }
                else return [];
            }
        }),
    }),
});

export const {
    useGetHolidayDataQuery
} = wikiApi;
