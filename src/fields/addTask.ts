import type { EachField } from "~/components/Forms";
import type { TAddTask } from "~/schemas/TaskSchema";
import type { SearchValue } from "~/types";

export const getAddTaskFields = (
  languages: SearchValue[],
  queryTags: (search: string) => Promise<SearchValue[]>,
  queryUsers: (search: string) => Promise<SearchValue[]>,
  user: SearchValue[]
): EachField<TAddTask>[] => {
  return [
    {
      label: "name",
      title: "Name",
      type: "text",
    },
    {
      label: "type",
      title: "Type",
      options: ["Lesson", "Problem", "Typing"],
      type: "select",
      conditional: (data: string) =>
        data ? !["Typing", "Lesson"].includes(data) : false,
      children: {
        label: "language",
        title: "Language",
        type: "static-search",
        options: languages,
      },
    },
    {
      label: "tags",
      title: "Tags",
      type: "multiple-search",
      queryFn: queryTags,
      optional: true,
      canAddItemNotInList: true,
    },
    {
      label: "owner",
      title: "Owner",
      type: "single-search",
      queryFn: queryUsers,
      value: user,
    },
    {
      label: "isPrivate",
      title: "Private",
      type: "checkbox",
      value: false,
    },
    {
      label: "note",
      title: "Note",
      type: "text",
      optional: true,
    },
  ];
};
