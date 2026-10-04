/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "photoUrl";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "photo_url" TEXT;
