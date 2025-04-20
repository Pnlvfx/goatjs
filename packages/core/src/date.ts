type AcceptedDate = string | number | Date;

export const MONTHS = Object.freeze([
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const);

const formatDate = (date: AcceptedDate) => {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return {
    date,
    year,
    month,
    day,
    hours,
    minutes,
  };
};

/** @deprecated Plase use new Intl.DateTimeFormat as it's integrated on both browser and node. */
export const createDate = (date: AcceptedDate = new Date()) => {
  const time = formatDate(date);

  return {
    ...time,
    toYYMM: () => `${time.year.toString()}-${time.month}-${time.day}`,
    toYYMMDD: () => `${time.year.toString()}-${time.month}-${time.day}`,
    toYYMMDDHHMM: () => `${time.year.toString()}-${time.month}-${time.day} ${time.hours}:${time.minutes}`,
  };
};

/** Get the start of the day of the provided date.
 * Notice: this will change the provided date.
 * If you don't want this use it like: startOfDay(new Date(originalDate))
 */
export const startOfDay = (date = new Date()) => {
  date.setHours(0, 0, 0, 0);
  return date;
};

/** Get the end of the day of the provided date.
 * Notice: this will change the provided date.
 * If you don't want this use it like: startOfDay(new Date(originalDate))
 */
export const endOfDay = (date = new Date()) => {
  date.setHours(23, 59, 59, 999);
  return date;
};
