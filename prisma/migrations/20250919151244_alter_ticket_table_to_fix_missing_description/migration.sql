/*
  Warnings:

  - You are about to alter the column `title` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5000)` to `VarChar(250)`.
  - Added the required column `description` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "description" VARCHAR(5000) NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(250);
