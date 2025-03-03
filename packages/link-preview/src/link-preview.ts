import { parser } from 'html-metadata-parser';

const urlRegex = /[\w#%()+./:=?@\\~]{2,256}\.[a-z]{2,6}\b([\w#%&+./:=?@~-]*)/gi;

export const getLinkPreview = async (url: string) => {
  if (!url || !urlRegex.test(url)) throw new Error('Invalid URL');
  const { hostname } = new URL(url);
  const { images, og, meta } = await parser(url);
  const image = og.image ?? images?.at(0);
  const description = og.description ?? meta.description;
  const title = og.title ?? meta.title;
  const siteName = og.site_name ?? '';

  return {
    title,
    description,
    image,
    siteName,
    hostname,
  };
};
