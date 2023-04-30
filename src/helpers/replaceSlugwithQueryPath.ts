export const replaceSlugwithQueryPath = (
  slug: string,
  query: Record<string, any>
) => {
  let result = slug;

  Object.keys(query).forEach((key) => {
    if (slug.includes(key)) {
      result = query[key];
    }
  });

  return result;
};
