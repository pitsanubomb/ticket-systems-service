-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(5000) NOT NULL,
    "priority" "public"."Priority" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
