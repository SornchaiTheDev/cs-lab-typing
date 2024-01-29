import type { SearchValue } from "~/types";
import { trpc } from "~/utils";
function useGetUserByName() {
  const utils = trpc.useUtils();
  const query = async (search: string): Promise<SearchValue[]> => {
    try {
      const datas = await utils.users.searchUserByName.fetch({
        full_name: search,
      });

      const searchValueDatas = datas.map((user) => ({
        label: user.full_name,
        value: user.student_id,
      }));

      return searchValueDatas;
    } catch (err) {
      console.log(err);
      throw new Error("Error fetching users");
    }
  };
  return query;
}

export default useGetUserByName;
