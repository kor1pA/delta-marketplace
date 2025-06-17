/*
  Warnings:

  - You are about to drop the column `createdAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `productimage` table. All the data in the column will be lost.
  - You are about to drop the column `isPrimary` on the `productimage` table. All the data in the column will be lost.
  - Added the required column `total_amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_primary` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `total_amount` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `category_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `productimage` DROP COLUMN `imageUrl`,
    DROP COLUMN `isPrimary`,
    ADD COLUMN `image_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `is_primary` BOOLEAN NOT NULL;
