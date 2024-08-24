import { teacherAboveProcedure, router } from "../../trpc";
import axios from "axios";
import { z } from "zod";
import { env } from "~/env.mjs";

// const JUDGE0_API_URL = env.JUDGE0_API_URL;

const api = axios.create({ baseURL: "" });

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

interface Token {
  token: string;
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

      const submissionTokens = await api.post<Token[]>("/submissions/batch", {
        submissions,
      });

      const tokens = submissionTokens.data
        .map((submission) => submission.token)
        .join(",");

      const getResults = async () => {
        const results = await api.get<{ submissions: Output[] }>(
          `/submissions/batch?tokens=${tokens}`
        );
        return results.data;
      };

      let results = await getResults();

      let isAllDone = results.submissions.every(
        (result) => result.status.description === "Accepted"
      );

      while (!isAllDone) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        results = await getResults();
        isAllDone = results.submissions.every(
          (s) => !["In Queue", "Processing"].includes(s.status.description)
        );
      }

      return results.submissions;
    }),
});
