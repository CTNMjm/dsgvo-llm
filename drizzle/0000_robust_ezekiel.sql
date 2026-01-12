CREATE TABLE `blog_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`authorName` varchar(200) NOT NULL,
	`authorEmail` varchar(320),
	`content` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`moderatedAt` timestamp,
	`moderatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(500) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`author` varchar(200) NOT NULL,
	`category` varchar(100),
	`readTime` varchar(50),
	`imageUrl` varchar(500),
	`metaTitle` varchar(200),
	`metaDescription` text,
	`isPublished` boolean DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platformId` int,
	`platformName` varchar(200),
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(200),
	`phone` varchar(50),
	`employeeCount` varchar(50),
	`interest` enum('demo','quote','trial','info') DEFAULT 'info',
	`message` text,
	`status` enum('new','contacted','qualified','converted','closed') NOT NULL DEFAULT 'new',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(200),
	`isActive` boolean DEFAULT true,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `platform_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platformId` int NOT NULL,
	`authorName` varchar(200) NOT NULL,
	`authorEmail` varchar(320),
	`rating` int NOT NULL,
	`title` varchar(300),
	`content` text,
	`isVerified` boolean DEFAULT false,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`moderatedAt` timestamp,
	`moderatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `platform_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platform_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('new_platform','correction','feature_request') NOT NULL,
	`platformName` varchar(200),
	`platformUrl` varchar(500),
	`description` text NOT NULL,
	`submitterName` varchar(200),
	`submitterEmail` varchar(320),
	`status` enum('pending','reviewed','implemented','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_suggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platforms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(200) NOT NULL,
	`company` varchar(200) NOT NULL,
	`location` varchar(200),
	`url` varchar(500),
	`pricingModel` enum('Hybrid','Nutzungsbasiert','Pro User','Einmalzahlung','Enterprise') NOT NULL,
	`basePrice` varchar(200),
	`tokenBased` boolean DEFAULT false,
	`compliance` json,
	`customGPTs` boolean DEFAULT false,
	`customGPTDetails` text,
	`features` json,
	`pros` json,
	`cons` json,
	`description` text,
	`screenshotUrl` varchar(500),
	`employees` varchar(100),
	`customers` varchar(100),
	`developers` varchar(100),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platforms_id` PRIMARY KEY(`id`),
	CONSTRAINT `platforms_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
