/*
  Warnings:

  - Added the required column `storage_path` to the `product_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "storage_path" TEXT NOT NULL;
