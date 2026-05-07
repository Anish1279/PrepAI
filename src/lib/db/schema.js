import {
    boolean,
    index,
    integer,
    serial,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull()
});
export const UserAnswer = pgTable('userAnswer',{
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('correctAns'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt')
});
export const Question = pgTable('question', {
    id: serial('id').primaryKey(),
    MockQuestionJsonResp: text('MockQuestionJsonResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    typeQuestion: varchar('typeQuestion').notNull(),
    company: varchar('company').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull()
});
export const CodingInterview = pgTable("codingInterview", {
    id: serial("id").primaryKey(),
    jsonMockResp: text("jsonMockResp").notNull(),
    jobPosition: varchar("jobPosition").notNull(),
    language: varchar("language").notNull(),
    jobExperience: integer("jobExperience").notNull(),
    createdBy: varchar("createdBy").notNull(),
    createdAt: varchar("createdAt").notNull(),
    mockId: varchar("mockId").notNull(),
  });
  
  export const CodingFeedback = pgTable("codingFeedback", {
    id: serial("id").primaryKey(),
    mockIdRef: varchar("mockId").notNull(),
    question: varchar("question").notNull(),
    correctAns: text("correctAns"),
    userAns: text("userAns"),
    feedback: text("feedback"),
    userEmail: varchar("userEmail"),
    createdAt: varchar("createdAt"),
  });

export const Users = pgTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 120 }),
    passwordHash: text("passwordHash").notNull(),
    role: varchar("role", { length: 40 }).notNull().default("user"),
    status: varchar("status", { length: 40 }).notNull().default("active"),
    emailVerified: boolean("emailVerified").notNull().default(false),
    emailVerifiedAt: timestamp("emailVerifiedAt", { withTimezone: true }),
    failedLoginAttempts: integer("failedLoginAttempts").notNull().default(0),
    lockedUntil: timestamp("lockedUntil", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    emailIdx: uniqueIndex("users_email_unique").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
    statusIdx: index("users_status_idx").on(table.status),
}));

export const AuthSessions = pgTable("auth_sessions", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("userId", { length: 36 }).notNull().references(() => Users.id, { onDelete: "cascade" }),
    refreshTokenFamilyId: varchar("refreshTokenFamilyId", { length: 36 }).notNull(),
    ipAddress: varchar("ipAddress", { length: 80 }),
    userAgent: text("userAgent"),
    deviceLabel: varchar("deviceLabel", { length: 120 }),
    lastSeenAt: timestamp("lastSeenAt", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revokedAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    userIdx: index("auth_sessions_user_idx").on(table.userId),
    familyIdx: index("auth_sessions_family_idx").on(table.refreshTokenFamilyId),
    expiresIdx: index("auth_sessions_expires_idx").on(table.expiresAt),
}));

export const RefreshTokens = pgTable("refresh_tokens", {
    id: serial("id").primaryKey(),
    tokenId: varchar("tokenId", { length: 36 }).notNull(),
    sessionId: varchar("sessionId", { length: 36 }).notNull().references(() => AuthSessions.id, { onDelete: "cascade" }),
    userId: varchar("userId", { length: 36 }).notNull().references(() => Users.id, { onDelete: "cascade" }),
    familyId: varchar("familyId", { length: 36 }).notNull(),
    tokenHash: text("tokenHash").notNull(),
    replacedByTokenId: varchar("replacedByTokenId", { length: 36 }),
    lastUsedAt: timestamp("lastUsedAt", { withTimezone: true }),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revokedAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    tokenIdIdx: uniqueIndex("refresh_tokens_token_id_unique").on(table.tokenId),
    tokenHashIdx: uniqueIndex("refresh_tokens_token_hash_unique").on(table.tokenHash),
    sessionIdx: index("refresh_tokens_session_idx").on(table.sessionId),
    familyIdx: index("refresh_tokens_family_idx").on(table.familyId),
    expiresIdx: index("refresh_tokens_expires_idx").on(table.expiresAt),
}));

export const VerificationTokens = pgTable("verification_tokens", {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 36 }).notNull().references(() => Users.id, { onDelete: "cascade" }),
    tokenHash: text("tokenHash").notNull(),
    type: varchar("type", { length: 40 }).notNull().default("email_verification"),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    usedAt: timestamp("usedAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    tokenHashIdx: uniqueIndex("verification_tokens_hash_unique").on(table.tokenHash),
    userTypeIdx: index("verification_tokens_user_type_idx").on(table.userId, table.type),
    expiresIdx: index("verification_tokens_expires_idx").on(table.expiresAt),
}));

export const PasswordResetTokens = pgTable("password_reset_tokens", {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 36 }).notNull().references(() => Users.id, { onDelete: "cascade" }),
    tokenHash: text("tokenHash").notNull(),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    usedAt: timestamp("usedAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    tokenHashIdx: uniqueIndex("password_reset_tokens_hash_unique").on(table.tokenHash),
    userIdx: index("password_reset_tokens_user_idx").on(table.userId),
    expiresIdx: index("password_reset_tokens_expires_idx").on(table.expiresAt),
}));
