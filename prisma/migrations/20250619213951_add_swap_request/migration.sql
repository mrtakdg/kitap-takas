-- CreateTable
CREATE TABLE "SwapRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "bookOfferedId" INTEGER NOT NULL,
    "bookWantedId" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SwapRequest_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_bookOfferedId_fkey" FOREIGN KEY ("bookOfferedId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_bookWantedId_fkey" FOREIGN KEY ("bookWantedId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
