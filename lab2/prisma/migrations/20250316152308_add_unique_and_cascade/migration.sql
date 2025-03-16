/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TaskJob" DROP CONSTRAINT "TaskJob_taskId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_projectId_key" ON "Invoice"("projectId");

-- AddForeignKey
ALTER TABLE "TaskJob" ADD CONSTRAINT "TaskJob_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "TechnicalTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
