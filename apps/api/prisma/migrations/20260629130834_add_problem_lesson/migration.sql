-- AlterTable
ALTER TABLE "problems" ADD COLUMN     "lesson_id" TEXT;

-- CreateIndex
CREATE INDEX "problems_lesson_id_idx" ON "problems"("lesson_id");

-- AddForeignKey
ALTER TABLE "problems" ADD CONSTRAINT "problems_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
