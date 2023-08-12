-- CreateTable
CREATE TABLE `users` (
    `username` VARCHAR(50) NOT NULL,
    `password` TEXT NOT NULL,
    `fullname` VARCHAR(100) NOT NULL,
    `token` TEXT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;
