import { pgTable, uuid, text, boolean, integer, timestamp, date, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const tradeRoleEnum = pgEnum('trade_role', ['exporter', 'importer', 'both']);
export const tradeTypeEnum = pgEnum('trade_type', ['export', 'import', 'both']);
export const interestTypeEnum = pgEnum('interest_type', ['export_to', 'import_from']);
export const matchStatusEnum = pgEnum('match_status', ['new', 'viewed', 'interested', 'dismissed']);
export const campaignStatusEnum = pgEnum('campaign_status', ['draft', 'active', 'paused', 'completed']);

// Profiles Table (extends auth.users)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(), // References auth.users
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  whatsapp: text('whatsapp'),
  tradeRole: tradeRoleEnum('trade_role').notNull(),
  monthlyVolume: text('monthly_volume'),
  onboardingStep: integer('onboarding_step').default(1).notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  plan: text('plan').default('free').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Companies Table
export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull().unique(),
  name: text('name').notNull(),
  entityType: text('entity_type').notNull(),
  foundingYear: integer('founding_year'),
  size: text('size'),
  street: text('street'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').default('India').notNull(),
  pinCode: text('pin_code'),
  website: text('website'),
  iecNumber: text('iec_number'),
  lastYearExportUsd: text('last_year_export_usd'), // Export value in USD millions  
  currentExportCountries: jsonb('current_export_countries').$type<string[]>(), // ISO country codes
  officeLocations: jsonb('office_locations').$type<{ country: string; state: string; city: string }[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products Table
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  hsCode: text('hs_code').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  tradeType: tradeTypeEnum('trade_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Trade Interests Table
export const tradeInterests = pgTable('trade_interests', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  countryCode: text('country_code').notNull(), // ISO 3166-1 alpha-2
  countryName: text('country_name').notNull(),
  interestType: interestTypeEnum('interest_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Certifications Table
export const certifications = pgTable('certifications', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(),
  certificateNumber: text('certificate_number'),
  validUntil: date('valid_until'),
  documentUrl: text('document_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// JSONB Type Definitions
interface MatchedProduct {
  hsCode: string;
  name: string;
}

interface TradeData {
  volume: string;
  frequency: string;
  yearsActive: number;
}

interface CounterpartyContact {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string | null;
}

// Matches Table
export const matches = pgTable('matches', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  counterpartyName: text('counterparty_name').notNull(),
  counterpartyCountry: text('counterparty_country').notNull(),
  counterpartyCity: text('counterparty_city'),
  matchedProducts: jsonb('matched_products').notNull().$type<MatchedProduct[]>(),
  matchScore: integer('match_score').notNull(), // 0-100, INTERNAL ONLY — never expose to frontend
  matchTier: text('match_tier').notNull(), // 'best', 'great', 'good'
  scoreBreakdown: jsonb('score_breakdown').notNull().$type<Record<string, number>>(), // INTERNAL ONLY
  matchReasons: jsonb('match_reasons').notNull().$type<string[]>(),
  matchWarnings: jsonb('match_warnings').$type<string[] | null>(),
  status: matchStatusEnum('status').notNull().default('new'),
  revealed: boolean('revealed').notNull().default(false),
  tradeData: jsonb('trade_data').$type<TradeData | null>(),
  counterpartyContact: jsonb('counterparty_contact').$type<CounterpartyContact | null>(), // Only send when revealed === true
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Match Reveals Table
export const matchReveals = pgTable('match_reveals', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  matchId: uuid('match_id').references(() => matches.id, { onDelete: 'cascade' }).notNull(),
  revealedAt: timestamp('revealed_at').defaultNow().notNull(),
  monthKey: text('month_key').notNull(), // Format: '2026-02'
});

// Campaigns Table
export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  targetDescription: text('target_description').notNull(),
  status: campaignStatusEnum('status').notNull().default('draft'),
  emailsSent: integer('emails_sent').notNull().default(0),
  emailsOpened: integer('emails_opened').notNull().default(0),
  emailsReplied: integer('emails_replied').notNull().default(0),
  meetingsBooked: integer('meetings_booked').notNull().default(0),
  metricsUpdatedAt: timestamp('metrics_updated_at'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  company: one(companies, {
    fields: [profiles.id],
    references: [companies.profileId],
  }),
  products: many(products),
  tradeInterests: many(tradeInterests),
  certifications: many(certifications),
  matches: many(matches),
  matchReveals: many(matchReveals),
  campaigns: many(campaigns),
}));

export const companiesRelations = relations(companies, ({ one }) => ({
  profile: one(profiles, {
    fields: [companies.profileId],
    references: [profiles.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  profile: one(profiles, {
    fields: [products.profileId],
    references: [profiles.id],
  }),
}));

export const tradeInterestsRelations = relations(tradeInterests, ({ one }) => ({
  profile: one(profiles, {
    fields: [tradeInterests.profileId],
    references: [profiles.id],
  }),
}));

export const certificationsRelations = relations(certifications, ({ one }) => ({
  profile: one(profiles, {
    fields: [certifications.profileId],
    references: [profiles.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [matches.profileId],
    references: [profiles.id],
  }),
  reveals: many(matchReveals),
}));

export const matchRevealsRelations = relations(matchReveals, ({ one }) => ({
  profile: one(profiles, {
    fields: [matchReveals.profileId],
    references: [profiles.id],
  }),
  match: one(matches, {
    fields: [matchReveals.matchId],
    references: [matches.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  profile: one(profiles, {
    fields: [campaigns.profileId],
    references: [profiles.id],
  }),
}));
