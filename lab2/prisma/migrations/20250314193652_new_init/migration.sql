/*
  Warnings:

  - You are about to drop the column `currentProjectId` on the `DeveloperInfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeveloperInfo" DROP CONSTRAINT "DeveloperInfo_currentProjectId_fkey";

-- AlterTable
ALTER TABLE "DeveloperInfo" DROP COLUMN "currentProjectId";
