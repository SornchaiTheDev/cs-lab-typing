import { useSession } from "next-auth/react";
import { getAddTaskFields } from "~/fields/addTask";
import useGetUserByName from "./useGetUserByName";
import useGetTagByName from "./useGetTags";
import { trpc } from "~/utils";

function useGetAddTaskFields(isShow: boolean) {
  const { data: session } = useSession();
  const languages = trpc.judge.getAllLanguages.useQuery(undefined, {
    enabled: isShow,
  });

  const queryUser = useGetUserByName();
  const queryTags = useGetTagByName();

  const user = [
    {
      label: session?.user.full_name ?? "",
      value: session?.user.student_id ?? "",
    },
  ];

  return getAddTaskFields(languages.data ?? [], queryTags, queryUser, user);
}

export default useGetAddTaskFields;
