import { ReactNode } from "react";

export type ChildProps = {
    children: ReactNode;
};

export type Holiday = {
    counties: string[] | null;
    countryCode: string | null;
    date: string | number | Date;
    fixed: boolean | null;
    global: boolean | null;
    launchYear?: number | null;
    localName: string | null;
    name: string | null;
    type: string | null;
}

export interface HolidayResponse extends Holiday {
    day: number;
}

export type ErrorName = {
    name: string | any;
}

export type QueryParams = {
    year: string;
    country: string; 
}
