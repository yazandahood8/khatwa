-- AlterTable
ALTER TABLE "levels" ADD COLUMN     "subject_id" TEXT,
ADD COLUMN     "unit_level" INTEGER,
ALTER COLUMN "grade_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "questionnaire_id" TEXT,
ALTER COLUMN "level_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "questionnaires" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT,
    "level_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionnaires_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questionnaires_level_id_idx" ON "questionnaires"("level_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaires_level_id_number_key" ON "questionnaires"("level_id", "number");

-- CreateIndex
CREATE INDEX "levels_grade_id_idx" ON "levels"("grade_id");

-- CreateIndex
CREATE INDEX "levels_subject_id_unit_level_idx" ON "levels"("subject_id", "unit_level");

-- CreateIndex
CREATE INDEX "topics_questionnaire_id_idx" ON "topics"("questionnaire_id");

-- AddForeignKey
ALTER TABLE "levels" ADD CONSTRAINT "levels_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_questionnaire_id_fkey" FOREIGN KEY ("questionnaire_id") REFERENCES "questionnaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;
