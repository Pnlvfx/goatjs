type AcceptedDate = string | number | Date;

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

export const create = (date: AcceptedDate = new Date()) => {
  const time = formatDate(date);
  return {
    ...time,
    toYYMM: () => `${time.year.toString()}-${time.month}-${time.day}`,
    toYYMMDD: () => `${time.year.toString()}-${time.month}-${time.day}`,
    toYYMMDDHHMM: () => `${time.year.toString()}-${time.month}-${time.day} ${time.hours}:${time.minutes}`,
  };
};

export const startOfDay = (date = new Date()) => {
  date.setHours(0, 0, 0, 0);
  return date;
};

export const endOfDay = (date = new Date()) => {
  date.setHours(23, 59, 59, 999);
  return date;
};
