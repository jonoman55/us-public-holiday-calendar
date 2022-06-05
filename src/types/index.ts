import { ReactNode } from "react";
import { PickersDayProps } from "@mui/x-date-pickers";

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
}

export interface PublicHoliday extends CalendarHoliday {
  parsedDay: number;
}

export type CalendarResponse = {
  data: {
    meta: {
      code: number,
    },
    response: {
      holidays: CalendarHoliday[],
    }
  }
};

export type FetchParams = {
  date: Date;
  signal: AbortSignal;
}

export type Endpoint = 'holidays' | 'languages' | 'countries';

export type Type = 'national' | 'local' | 'religious' | 'observance';

export type RequestParams = {
  endpoint: Endpoint;
  country: string,
  day?: string;
  month?: string;
  year: string;
  type: Type;
  language: string;
}

export type OptionParams = {
  year: string,
  country: string
}

export type SelectedDay = {
  date: Date;
  selectedDates: any;
  pickersDayProps: PickersDayProps<Date>;
}
