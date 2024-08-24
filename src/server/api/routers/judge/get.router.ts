import { teacherAboveProcedure, router } from "../../trpc";
import axios from "axios";
import { env } from "~/env.mjs";

// const JUDGE0_API_URL = env.JUDGE0_API_URL;

const api = axios.create({ baseURL: "" });

type Language = {
  id: number;
  name: string;
};

export const getJudgeRouter = router({
  getAllLanguages: teacherAboveProcedure.query(async () => {
    const languages = await api.get<Language[]>("/languages");
    const transformToSearchValue = languages.data.map((lang) => ({
      value: lang.id,
      label: lang.name,
    }));
    return transformToSearchValue;
  }),
});
