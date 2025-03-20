/*
  Warnings:

  - You are about to drop the column `content` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `styles` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `isHome` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Page` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "properties" TEXT,
    "pageId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Component_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Component_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Component" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Component" ("createdAt", "id", "pageId", "parentId", "type", "updatedAt") SELECT "createdAt", "id", "pageId", "parentId", "type", "updatedAt" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
CREATE TABLE "new_Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "description" TEXT,
    "isHomePage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "websiteId" TEXT NOT NULL,
    CONSTRAINT "Page_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("createdAt", "description", "id", "path", "title", "updatedAt", "websiteId") SELECT "createdAt", "description", "id", "path", "title", "updatedAt", "websiteId" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_websiteId_path_key" ON "Page"("websiteId", "path");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
