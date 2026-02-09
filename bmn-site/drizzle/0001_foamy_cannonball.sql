CREATE TYPE "public"."notice_type" AS ENUM('document_upload_request', 'general', 'urgent');--> statement-breakpoint
CREATE TABLE "admin_notices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notice_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"dismissed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "last_year_export_usd" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "current_export_countries" jsonb;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "office_locations" jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "certification_docs" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "notification_status" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "admin_notices" ADD CONSTRAINT "admin_notices_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;