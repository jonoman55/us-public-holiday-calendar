import { ReactNode } from "react";

export type ChildProps = {
    children: ReactNode;
};

export type PublicHoliday = {
    name: string;
    localName: string;
    date: Date | string;
    type: string;
    day: number;
}

export type ErrorName = {
    name: string | any;
}

export type QueryParams = {
    year: string,
    date: Date 
}
