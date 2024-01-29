import type { SearchValue } from "~/types";
import { trpc } from "~/utils";
function useGetTagByName() {
  const utils = trpc.useUtils();
  const query = async (search: string): Promise<SearchValue[]> => {
    try {
      const datas = await utils.tags.getTags.fetch({
        name: search,
      });

      const searchValueDatas = datas.map((tag) => ({
        label: tag.name,
        value: tag.name,
      }));

      return searchValueDatas;
    } catch (err) {
      throw new Error("Error fetching tags");
    }
  };
  return query;
}

export default useGetTagByName;
