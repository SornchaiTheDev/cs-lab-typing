import { teacherAboveProcedure, router } from "../../trpc";
import axios from "axios";
import { z } from "zod";
import { env } from "~/env.mjs";

const JUDGE0_API_URL = env.JUDGE0_API_URL;

const api = axios.create({ baseURL: JUDGE0_API_URL });

interface Output {
  stdout: string;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
}

export const createJudgeRouter = router({
  cmsSubmitCode: teacherAboveProcedure
    .input(
      z.object({
        language_id: z.number(),
        source_code: z.string(),
        stdin: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { language_id, source_code, stdin } = input;
      const result = await api.post<Output>("/submissions?wait=true", {
        language_id,
        source_code,
        stdin,
      });

      return result.data;
    }),
  cmsSubmitCodeBatch: teacherAboveProcedure
    .input(
      z.array(
        z.object({
          language_id: z.number(),
          source_code: z.string(),
          stdin: z.string(),
        })
      )
    )
    .mutation(async ({ input }) => {
      const submissions = input;

      const result = await api.post<{ token: string }[]>("/submissions/batch", {
        submissions,
      });

      return result.data;
    }),
});
