import metadata from 'html-metadata-parser';

export const getLinkPreview = async (url: string) => {
  const { hostname } = new URL(url);
  const { images, og, meta } = await metadata.parser(url);
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
