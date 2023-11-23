import { isUserInThisSection } from "~/server/utils/checkIfUserIsInThisSection";
import { prisma } from "~/server/db";
import { getDuration } from "~/components/Typing/utils/getDuration";
import { calculateTypingSpeed } from "~/components/Typing/utils/calculateWPM";
import { calculateErrorPercentage } from "~/components/Typing/utils/calculateErrorPercentage";
import { evaluate } from "~/helpers/evaluateTypingScore";
import type { submission_type } from "@prisma/client";
import dayjs from "dayjs";
import type { TypingResultWithHashType } from "~/schemas/TypingResult";
import { getErrorsCharacters } from "~/server/utils/getErrorCharacters";
import { isSameProblem } from "~/server/utils/isSameProblem";

interface Params {
  sectionId: string;
  labId: string;
  taskId: string;
  student_id: string;
  ip: string;
}

type TypingResultWithOutEmailType = Omit<TypingResultWithHashType, "email">;
export const saveSubmission = async ({
  labId,
  sectionId,
  taskId,
  student_id,
  endedAt,
  startedAt,
  hash,
  ip,
  keyStrokes,
}: Params & TypingResultWithOutEmailType) => {
  const _sectionId = parseInt(sectionId);
  const _labId = parseInt(labId);
  const _taskId = parseInt(taskId);

  await isUserInThisSection(student_id, parseInt(sectionId));
  const section = await prisma.sections.findUnique({
    where: {
      id: _sectionId,
    },
    include: {
      students: true,
      labs_status: {
        where: {
          labId: _labId,
        },
      },
    },
  });

  const isInSection = section?.students.some(
    (student) => student.student_id === student_id
  );

  if (!isInSection) {
    throw new Error("NOT_IN_SECTION");
  }

  let isSectionClose = section?.active === false;

  if (section?.closed_at) {
    const isAfterClosedAt = dayjs().isAfter(section?.closed_at);
    isSectionClose = isSectionClose || isAfterClosedAt;
  }

  if (isSectionClose) {
    throw new Error("ALREADY_CLOSED");
  }

  const lab = await prisma.labs.findUnique({
    where: {
      id: _labId,
    },
  });

  const isLabClose =
    !lab?.active ||
    section?.labs_status.some((lab) =>
      ["DISABLED", "READONLY"].includes(lab.status)
    );

  if (isLabClose) {
    throw new Error("ALREADY_CLOSED");
  }

  const problem = await prisma.tasks.findUnique({
    where: {
      id: _taskId,
    },
    select: {
      body: true,
    },
  });

  const problemKeys = problem?.body?.split("") ?? [];
  const totalChars = problemKeys.length;

  if (!isSameProblem({ keyStrokes, problemKeys })) {
    throw new Error("NOT_SAME_PROBLEM");
  }

  const duration = getDuration(startedAt as Date, endedAt as Date);
  const errorChars = getErrorsCharacters({ keyStrokes, problemKeys });

  const { rawSpeed, adjustedSpeed } = calculateTypingSpeed(
    totalChars,
    errorChars,
    duration.minutes
  );

  const errorPercentage = calculateErrorPercentage(totalChars, errorChars);

  const score = evaluate(adjustedSpeed, errorPercentage);

  const user = await prisma.users.findFirst({
    where: {
      student_id,
      deleted_at: null,
    },
  });

  if (user) {
    const submission = await prisma.submissions.findUnique({
      where: {
        user_id_task_id_section_id_lab_id: {
          user_id: user.id,
          section_id: _sectionId,
          lab_id: _labId,
          task_id: _taskId,
        },
      },
    });

    let status: submission_type = "FAILED";

    if (
      submission?.status === "PASSED" ||
      (errorPercentage <= 3 && adjustedSpeed >= 30)
    ) {
      status = "PASSED";
    }

    await prisma.submissions.upsert({
      where: {
        user_id_task_id_section_id_lab_id: {
          user_id: user.id,
          section_id: _sectionId,
          lab_id: _labId,
          task_id: _taskId,
        },
      },
      create: {
        section: {
          connect: {
            id: _sectionId,
          },
        },
        lab: {
          connect: {
            id: _labId,
          },
        },
        task: {
          connect: {
            id: _taskId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        status,
        task_type: "Typing",
        typing_histories: {
          create: {
            id: hash as string,
            raw_speed: rawSpeed,
            adjusted_speed: adjustedSpeed,
            started_at: startedAt,
            ended_at: endedAt,
            percent_error: errorPercentage,
            score,
          },
        },
      },
      update: {
        status: status,
        task_type: "Typing",
        typing_histories: {
          create: {
            id: hash as string,
            raw_speed: rawSpeed,
            adjusted_speed: adjustedSpeed,
            started_at: startedAt,
            ended_at: endedAt,
            percent_error: errorPercentage,
            score,
          },
        },
      },
    });

    await prisma.tasks.update({
      where: {
        id: _taskId,
      },
      data: {
        submission_count: {
          increment: 1,
        },
        lab_loggers: {
          create: {
            type: "SUBMIT",
            ip_address: ip as string,
            user: {
              connect: {
                id: user.id,
              },
            },
            section: {
              connect: {
                id: _sectionId,
              },
            },
          },
        },
      },
    });
  }
};
