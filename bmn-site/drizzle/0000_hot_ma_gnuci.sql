CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'active', 'paused', 'completed');--> statement-breakpoint
CREATE TYPE "public"."interest_type" AS ENUM('export_to', 'import_from');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('new', 'viewed', 'interested', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."trade_role" AS ENUM('exporter', 'importer', 'both');--> statement-breakpoint
CREATE TYPE "public"."trade_type" AS ENUM('export', 'import', 'both');--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"name" text NOT NULL,
	"target_description" text NOT NULL,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"emails_sent" integer DEFAULT 0 NOT NULL,
	"emails_opened" integer DEFAULT 0 NOT NULL,
	"emails_replied" integer DEFAULT 0 NOT NULL,
	"meetings_booked" integer DEFAULT 0 NOT NULL,
	"metrics_updated_at" timestamp,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"type" text NOT NULL,
	"certificate_number" text,
	"valid_until" date,
	"document_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"name" text NOT NULL,
	"entity_type" text NOT NULL,
	"founding_year" integer,
	"size" text,
	"street" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"country" text DEFAULT 'India' NOT NULL,
	"pin_code" text,
	"website" text,
	"iec_number" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_profile_id_unique" UNIQUE("profile_id")
);
--> statement-breakpoint
CREATE TABLE "match_reveals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"match_id" uuid NOT NULL,
	"revealed_at" timestamp DEFAULT now() NOT NULL,
	"month_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"counterparty_name" text NOT NULL,
	"counterparty_country" text NOT NULL,
	"counterparty_city" text,
	"matched_products" jsonb NOT NULL,
	"match_score" integer NOT NULL,
	"match_tier" text NOT NULL,
	"score_breakdown" jsonb NOT NULL,
	"match_reasons" jsonb NOT NULL,
	"match_warnings" jsonb,
	"status" "match_status" DEFAULT 'new' NOT NULL,
	"revealed" boolean DEFAULT false NOT NULL,
	"trade_data" jsonb,
	"counterparty_contact" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"hs_code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"trade_type" "trade_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"whatsapp" text,
	"trade_role" "trade_role" NOT NULL,
	"monthly_volume" text,
	"onboarding_step" integer DEFAULT 1 NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trade_interests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"interest_type" "interest_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_reveals" ADD CONSTRAINT "match_reveals_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_reveals" ADD CONSTRAINT "match_reveals_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_interests" ADD CONSTRAINT "trade_interests_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;