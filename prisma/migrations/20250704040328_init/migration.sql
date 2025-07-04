-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('GIRLFRIEND', 'BOYFRIEND', 'WIFE', 'HUSBAND', 'DHARMA_SISTER', 'DHARMA_BROTHER');

-- CreateTable
CREATE TABLE "tbl_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_user_job" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "tbl_user_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_user_relationship" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "relationshipType" "RelationshipType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_user_relationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_job_userId_jobId_key" ON "tbl_user_job"("userId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_relationship_userId_partnerId_key" ON "tbl_user_relationship"("userId", "partnerId");

-- AddForeignKey
ALTER TABLE "tbl_user_job" ADD CONSTRAINT "tbl_user_job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_job" ADD CONSTRAINT "tbl_user_job_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "tbl_job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_relationship" ADD CONSTRAINT "tbl_user_relationship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_relationship" ADD CONSTRAINT "tbl_user_relationship_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "tbl_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
