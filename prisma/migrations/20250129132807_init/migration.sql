/*
  Warnings:

  - The `status` column on the `Gadget` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "GadgetStatus" AS ENUM ('Available', 'Deployed', 'Destroyed', 'Decommissioned');

-- AlterTable
ALTER TABLE "Gadget" DROP COLUMN "status",
ADD COLUMN     "status" "GadgetStatus" NOT NULL DEFAULT 'Available';
