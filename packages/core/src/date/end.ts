/** Get the end of the day of the provided date.
 * Notice: this will change the provided date.
 * If you don't want this use it like: startOfDay(new Date(originalDate))
 */
export const endOfDay = (date = new Date()) => {
  date.setHours(23, 59, 59, 999);
  return date;
};
