-- CreateTable
CREATE TABLE `CouncilActivityDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NULL,
    `type` VARCHAR(64) NOT NULL,
    `year` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `description` TEXT NULL,
    `fileUrl` VARCHAR(500) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CouncilActivityDocument_slug_key`(`slug`),
    INDEX `CouncilActivityDocument_type_year_idx`(`type`, `year`),
    INDEX `CouncilActivityDocument_isPublished_year_idx`(`isPublished`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
