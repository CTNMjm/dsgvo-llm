CREATE TABLE `api_pricing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platformId` int NOT NULL,
	`provider` varchar(100) NOT NULL,
	`modelName` varchar(200) NOT NULL,
	`modelVersion` varchar(100),
	`inputPricePerMillion` varchar(50) NOT NULL,
	`outputPricePerMillion` varchar(50) NOT NULL,
	`regions` json,
	`isAvailable` boolean DEFAULT true,
	`notes` text,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_pricing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `login_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`code` varchar(6) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`attempts` int DEFAULT 0,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `login_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `member_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`token` varchar(64) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastUsedAt` timestamp NOT NULL DEFAULT (now()),
	`userAgent` text,
	`ipAddress` varchar(45),
	CONSTRAINT `member_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `member_sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(200),
	`bio` text,
	`avatarUrl` varchar(500),
	`isVerified` boolean DEFAULT false,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastLoginAt` timestamp,
	CONSTRAINT `members_id` PRIMARY KEY(`id`),
	CONSTRAINT `members_email_unique` UNIQUE(`email`)
);
