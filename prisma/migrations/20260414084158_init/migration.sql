-- CreateTable
CREATE TABLE "Registration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "package" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "referralCode" TEXT,
    "slipPath" TEXT NOT NULL,
    "needTaxInvoice" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
