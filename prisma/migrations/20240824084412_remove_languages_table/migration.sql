/*
  Warnings:

  - You are about to drop the column `language_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `languages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_language_id_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "language_id";

-- DropTable
DROP TABLE "languages";
