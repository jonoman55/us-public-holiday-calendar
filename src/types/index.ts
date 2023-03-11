import React from "react";
import { PickersDayProps } from "@mui/x-date-pickers";

/**
 * React Children Props
 */
export type ChildProps = {
  children?: React.ReactNode;
};

/**
 * Holiday Type
 */
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
};

/**
 * Holiday API Response
 */
export interface HolidayResponse extends Holiday {
  day: number;
};

/**
 * Error Name Type
 */
export type ErrorName = {
  name: string | any;
};

/**
 * Holiday Query Params
 */
export type QueryParams = {
  year: string;
  country: string;
};

/**
 * Calendar Holiday Type
 */
export type CalendarHoliday = {
  name: string;
  description: string;
  country: {
    id: string;
    name: string;
  },
  date: {
    iso: string;
    datetime: {
      year: number;
      month: number;
      day: number;
    }
  },
  type: string[];
  urlid: string;
  locations: string;
  states: string;
};

/**
 * Public Holiday
 */
export interface PublicHoliday extends CalendarHoliday {
  parsedDay: number;
};

/**
 * Calendar API Response Data
 */
export type CalendarResponse = {
  data: {
    meta: {
      code: number;
    },
    response: {
      holidays: CalendarHoliday[];
    }
  }
};

/**
 * Fetch Params Type
 */
export type FetchParams = {
  date: Date;
  signal: AbortSignal;
};

/**
 * Holiday Endpoint Type
 */
export type Endpoint = 'holidays' | 'languages' | 'countries';

/**
 * Type of Holiday
 */
export type Type = 'national' | 'local' | 'religious' | 'observance';

/**
 * Request Params Type
 */
export type RequestParams = {
  endpoint: Endpoint;
  country: string,
  day?: string;
  month?: string;
  year: string;
  type: Type;
  language: string;
}

/**
 * Option Params Type
 */
export type OptionParams = {
  year: string;
  country: string;
};

/**
 * Selected Calendar Day
 */
export type SelectedDay = {
  day: Date,
  selectedDays: Date[],
  pickersDayProps: PickersDayProps<Date>;
};
