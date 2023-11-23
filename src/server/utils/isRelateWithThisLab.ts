import { prisma } from "../db";
import { isRelationWithThisCourse } from "./isRelationWithThisCourse";

export const isRelateWithThisLab = async (
  student_id: string,
  lab_id: number
) => {
  try {
    const lab = await prisma.labs.findUnique({
      where: {
        id: lab_id,
      },
      include: {
        course: true,
      },
    });

    if (lab) {
      const isRelated = await isRelationWithThisCourse(
        student_id,
        lab.courseId.toString()
      );
      if (!isRelated) {
        throw new Error("UNAUTHORIZED");
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};
