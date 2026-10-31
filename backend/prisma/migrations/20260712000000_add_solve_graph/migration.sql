-- Guided step solver: milestones + known wrong patterns per problem.

-- AlterTable
ALTER TABLE "problems" ADD COLUMN "guided_fallback_hint" TEXT;

-- CreateTable
CREATE TABLE "solve_milestones" (
    "id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "target_expr" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "praise" TEXT NOT NULL,
    "next_hint" TEXT,

    CONSTRAINT "solve_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solve_wrong_patterns" (
    "id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "match_expr" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "solve_wrong_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "solve_milestones_problem_id_idx" ON "solve_milestones"("problem_id");

-- CreateIndex
CREATE INDEX "solve_wrong_patterns_problem_id_idx" ON "solve_wrong_patterns"("problem_id");

-- AddForeignKey
ALTER TABLE "solve_milestones" ADD CONSTRAINT "solve_milestones_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solve_wrong_patterns" ADD CONSTRAINT "solve_wrong_patterns_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
