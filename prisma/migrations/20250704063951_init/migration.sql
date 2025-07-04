/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `tbl_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tbl_user" ADD COLUMN     "password" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_username_key" ON "tbl_user"("username");
