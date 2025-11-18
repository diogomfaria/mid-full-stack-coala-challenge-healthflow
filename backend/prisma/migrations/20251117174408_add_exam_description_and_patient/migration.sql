/*
  Warnings:

  - Added the required column `description` to the `MedicalExam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientName` to the `MedicalExam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalExam" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "patientName" TEXT NOT NULL;
