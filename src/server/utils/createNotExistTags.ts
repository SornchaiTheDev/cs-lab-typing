import type { PrismaClient } from "@prisma/client";

export const createNotExistTags = async (
  prisma: PrismaClient,
  tags: string[]
) => {
  const existingTags = await Promise.all(
    tags.map((name) => prisma.tags.findUnique({ where: { name } }))
  );

  const newTags = tags.filter((_, i) => !existingTags[i]);

  await prisma.tags.createMany({
    data: newTags.map((name) => ({ name })),
  });
};
