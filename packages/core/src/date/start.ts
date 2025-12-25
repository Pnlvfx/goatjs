/** Get the start of the day of the provided date.
 * Notice: this will change the provided date.
 * If you don't want this use it like: startOfDay(new Date(originalDate))
 */
export const startOfDay = (date = new Date()) => {
  date.setHours(0, 0, 0, 0);
  return date;
};
