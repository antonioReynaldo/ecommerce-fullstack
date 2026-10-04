/*
  Warnings:

  - You are about to drop the column `revoked_at` on the `refresh_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "revoked_at";
