export const replaceSlugwithQueryPath = (
  slug: string,
  query: Record<string, any>
) => {
  let result = slug;
  Object.keys(query).forEach((key) => {
    result = result.replace(`[${key}]`, query[key]);
  });
  return result;
};
