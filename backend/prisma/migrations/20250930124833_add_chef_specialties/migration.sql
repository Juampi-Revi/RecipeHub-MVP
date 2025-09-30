/*
  Warnings:

  - You are about to drop the column `specialty` on the `chefs` table. All the data in the column will be lost.
  - The primary key for the `recipe_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `recipe_chefs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `recipe_likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - The required column `id` was added to the `recipe_categories` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `recipe_chefs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `recipe_likes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_chefs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "specialties" TEXT,
    "yearsExperience" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_chefs" ("bio", "createdAt", "id", "imageUrl", "name", "updatedAt") SELECT "bio", "createdAt", "id", "imageUrl", "name", "updatedAt" FROM "chefs";
DROP TABLE "chefs";
ALTER TABLE "new_chefs" RENAME TO "chefs";
CREATE TABLE "new_recipe_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "recipe_categories_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_recipe_categories" ("categoryId", "recipeId") SELECT "categoryId", "recipeId" FROM "recipe_categories";
DROP TABLE "recipe_categories";
ALTER TABLE "new_recipe_categories" RENAME TO "recipe_categories";
CREATE UNIQUE INDEX "recipe_categories_recipeId_categoryId_key" ON "recipe_categories"("recipeId", "categoryId");
CREATE TABLE "new_recipe_chefs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipeId" TEXT NOT NULL,
    "chefId" TEXT NOT NULL,
    CONSTRAINT "recipe_chefs_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_chefs_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "chefs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_recipe_chefs" ("chefId", "recipeId") SELECT "chefId", "recipeId" FROM "recipe_chefs";
DROP TABLE "recipe_chefs";
ALTER TABLE "new_recipe_chefs" RENAME TO "recipe_chefs";
CREATE UNIQUE INDEX "recipe_chefs_recipeId_chefId_key" ON "recipe_chefs"("recipeId", "chefId");
CREATE TABLE "new_recipe_ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" REAL NOT NULL,
    "unit" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    CONSTRAINT "recipe_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_recipe_ingredients" ("id", "ingredientId", "notes", "quantity", "recipeId", "unit") SELECT "id", "ingredientId", "notes", "quantity", "recipeId", "unit" FROM "recipe_ingredients";
DROP TABLE "recipe_ingredients";
ALTER TABLE "new_recipe_ingredients" RENAME TO "recipe_ingredients";
CREATE UNIQUE INDEX "recipe_ingredients_recipeId_ingredientId_key" ON "recipe_ingredients"("recipeId", "ingredientId");
CREATE TABLE "new_recipe_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    CONSTRAINT "recipe_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_likes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_recipe_likes" ("createdAt", "recipeId", "userId") SELECT "createdAt", "recipeId", "userId" FROM "recipe_likes";
DROP TABLE "recipe_likes";
ALTER TABLE "new_recipe_likes" RENAME TO "recipe_likes";
CREATE UNIQUE INDEX "recipe_likes_userId_recipeId_key" ON "recipe_likes"("userId", "recipeId");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("avatar", "bio", "createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "avatar", "bio", "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
