-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SwapRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "bookOfferedId" INTEGER NOT NULL,
    "bookWantedId" INTEGER NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SwapRequest_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_bookOfferedId_fkey" FOREIGN KEY ("bookOfferedId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_bookWantedId_fkey" FOREIGN KEY ("bookWantedId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SwapRequest" ("bookOfferedId", "bookWantedId", "createdAt", "fromUserId", "id", "message", "toUserId") SELECT "bookOfferedId", "bookWantedId", "createdAt", "fromUserId", "id", "message", "toUserId" FROM "SwapRequest";
DROP TABLE "SwapRequest";
ALTER TABLE "new_SwapRequest" RENAME TO "SwapRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
