type AcceptedDate = string | number | Date;

export const createDate = (date: AcceptedDate = new Date()) => {
  const time = formatDate(date);

  return {
    ...time,
    mmdd: () => `${time.month}-${time.day}`,
    yymm: () => `${time.year.toString()}-${time.month}-${time.day}`,
    yymmdd: () => `${time.year.toString()}-${time.month}-${time.day}`,
    yymmddhhmm: () => `${time.year.toString()}-${time.month}-${time.day} ${time.hours}:${time.minutes}`,
  };
};

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
