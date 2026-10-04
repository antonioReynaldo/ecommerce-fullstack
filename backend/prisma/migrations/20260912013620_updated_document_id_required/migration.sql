/*
  Warnings:

  - You are about to alter the column `document_id` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(8)`.
  - Made the column `document_id` on table `employees` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "document_id" SET NOT NULL,
ALTER COLUMN "document_id" SET DATA TYPE VARCHAR(8);
