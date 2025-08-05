export const getCookieDomain = (url: string) => {
  const domain = new URL(url).hostname.split('.').slice(-2).join('.');
  if (domain === 'localhost') return domain;
  return `.${domain}`;
};
