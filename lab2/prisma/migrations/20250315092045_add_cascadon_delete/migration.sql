-- DropForeignKey
ALTER TABLE "DeveloperInfo" DROP CONSTRAINT "DeveloperInfo_userId_fkey";

-- AddForeignKey
ALTER TABLE "DeveloperInfo" ADD CONSTRAINT "DeveloperInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
