-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeveloperInfo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentProjectId" INTEGER,
    "hourRate" DOUBLE PRECISION NOT NULL,
    "qualification" TEXT NOT NULL,

    CONSTRAINT "DeveloperInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalTask" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TechnicalTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskJob" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "qualification" TEXT NOT NULL,
    "specialistsNeeded" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaskJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "managerId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTeamMember" (
    "projectId" INTEGER NOT NULL,
    "developerId" INTEGER NOT NULL,
    "hoursWorked" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProjectTeamMember_pkey" PRIMARY KEY ("projectId","developerId")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperInfo_userId_key" ON "DeveloperInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_taskId_key" ON "Project"("taskId");

-- AddForeignKey
ALTER TABLE "DeveloperInfo" ADD CONSTRAINT "DeveloperInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperInfo" ADD CONSTRAINT "DeveloperInfo_currentProjectId_fkey" FOREIGN KEY ("currentProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalTask" ADD CONSTRAINT "TechnicalTask_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskJob" ADD CONSTRAINT "TaskJob_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "TechnicalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "TechnicalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeamMember" ADD CONSTRAINT "ProjectTeamMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeamMember" ADD CONSTRAINT "ProjectTeamMember_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
