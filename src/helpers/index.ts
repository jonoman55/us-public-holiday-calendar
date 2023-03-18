import moment from "moment";

import type { CalendarHoliday, Holiday, PublicHoliday, QueryParams } from "../types";

/**
 * Get Environment Variable
 * @param name Environment Variable Name
 * @returns Environment Variable or undefined
 */
export const getEvn = (name: string): string | undefined => {
  return process.env[name];
};

/**
 * Create Wikipedia URL
 * @param name Wiki Page Name
 * @returns Wikipedia URL
 */
export const createWikiUrl = (name: string) => {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`;
};

/**
 * Create Public Holiday
 * @param holiday Calendar Holiday 
 * @returns Public Holiday
 */
export const createPublicHoliday = (holiday: CalendarHoliday): PublicHoliday => ({
  name: holiday.name,
  description: holiday.description,
  country: {
    id: holiday.country.id,
    name: holiday.country.name,
  },
  date: {
    iso: holiday.date.iso,
    datetime: {
      year: holiday.date.datetime.year,
      month: holiday.date.datetime.month,
      day: holiday.date.datetime.day
    }
  },
  type: holiday.type,
  urlid: holiday.urlid,
  locations: holiday.locations,
  states: holiday.states,
  parsedDay: holiday.date.datetime.day
});

/**
* Check if date is a public holiday
* @param date Current Date
* @param holidayDate Target Holiday Date
* @returns true or false
*/
export const isPublicHoliday = (date: Date, holidayDate: Date): boolean => {
  return date.getFullYear() === holidayDate.getFullYear() && date.getMonth() === holidayDate.getMonth();
};

/**
* Create Holiday From Response
* @param holiday Holiday to parse
* @returns Parsed Holiday
*/
export const createHoliday = (holiday: Holiday): Holiday => ({
  counties: holiday.counties,
  countryCode: holiday.countryCode,
  date: holiday.date,
  fixed: holiday.fixed,
  global: holiday.global,
  launchYear: holiday.launchYear,
  localName: holiday.localName,
  name: holiday.name,
  type: holiday.type,
  day: parseInt(moment(holiday.date).format("D"), 10)
});

/**
 * Sanitized Holiday Name
 * @param name Holiday Name
 * @returns Sanitized Holiday Name String
 */
export const sanitizeName = (name: string): string => {
  if (name.includes('(')) {
      return name.replace('(substitute)', '').trim();
  }
  return name;
};

/**
 * Create Query Params
 * @param params Date and country 
 * @returns year and country
 */
export const createQueryParams = ({ date, country }: { date: Date, country?: string; }): QueryParams => ({
  year: date.getFullYear().toString(),
  country: country ?? "US"
});
