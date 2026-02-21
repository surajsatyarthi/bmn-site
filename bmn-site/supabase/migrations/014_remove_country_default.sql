-- Migration to remove default 'India' constraint from companies table
ALTER TABLE "companies" ALTER COLUMN "country" DROP DEFAULT;
