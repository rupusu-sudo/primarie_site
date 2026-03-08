ALTER TABLE `Document`
    ADD COLUMN `type` VARCHAR(64) NULL,
    ADD COLUMN `status` VARCHAR(32) NULL,
    ADD COLUMN `number` VARCHAR(64) NULL,
    ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `publicationDate` DATETIME(3) NULL,
    ADD COLUMN `adoptionDate` DATETIME(3) NULL,
    ADD COLUMN `consultationDeadline` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

CREATE INDEX `Document_category_status_isPublished_year_idx`
    ON `Document`(`category`, `status`, `isPublished`, `year`);
