/*
  Warnings:

  - A unique constraint covering the columns `[parent_id,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'SELECT');

-- DropIndex
DROP INDEX "categories_name_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parent_id" INTEGER;

-- CreateTable
CREATE TABLE "category_attributes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "type" "AttributeType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "category_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute_values" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "category_attribute_id" INTEGER NOT NULL,

    CONSTRAINT "product_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_attributes_category_id_key_key" ON "category_attributes"("category_id", "key");

-- CreateIndex
CREATE INDEX "product_attribute_values_category_attribute_id_idx" ON "product_attribute_values"("category_attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_values_product_id_category_attribute_id_key" ON "product_attribute_values"("product_id", "category_attribute_id");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_parent_id_name_key" ON "categories"("parent_id", "name");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_category_attribute_id_fkey" FOREIGN KEY ("category_attribute_id") REFERENCES "category_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
