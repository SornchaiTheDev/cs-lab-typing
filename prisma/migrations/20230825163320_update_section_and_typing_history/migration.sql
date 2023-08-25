/*
  Warnings:

  - You are about to drop the column `isDisabled` on the `labs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "typing_histories" DROP CONSTRAINT "typing_histories_submission_id_fkey";

-- DropIndex
DROP INDEX "courses_name_key";

-- DropIndex
DROP INDEX "courses_number_key";

-- AlterTable
ALTER TABLE "labs" DROP COLUMN "isDisabled",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "closed_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "typing_histories" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AddForeignKey
ALTER TABLE "typing_histories" ADD CONSTRAINT "typing_histories_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
