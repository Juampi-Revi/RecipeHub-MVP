-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_recipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT NOT NULL,
    "prepTime" INTEGER NOT NULL,
    "cookTime" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "estimatedCalories" INTEGER,
    "complexity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "flavorType" TEXT NOT NULL DEFAULT 'SAVORY',
    "mealType" TEXT NOT NULL DEFAULT 'LUNCH',
    "isLowCalorie" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "recipes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_recipes" ("authorId", "cookTime", "createdAt", "description", "difficulty", "estimatedCalories", "id", "imageUrl", "instructions", "isPublished", "prepTime", "servings", "title", "updatedAt") SELECT "authorId", "cookTime", "createdAt", "description", "difficulty", "estimatedCalories", "id", "imageUrl", "instructions", "isPublished", "prepTime", "servings", "title", "updatedAt" FROM "recipes";
DROP TABLE "recipes";
ALTER TABLE "new_recipes" RENAME TO "recipes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
