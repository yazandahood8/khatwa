-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "ai_sessions" ADD COLUMN     "lesson_id" TEXT;

-- CreateIndex
CREATE INDEX "ai_sessions_lesson_id_idx" ON "ai_sessions"("lesson_id");

-- AddForeignKey
ALTER TABLE "ai_sessions" ADD CONSTRAINT "ai_sessions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
