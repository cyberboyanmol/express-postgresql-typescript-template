-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "google_id" TEXT,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "provider" "Provider" NOT NULL DEFAULT 'LOCAL',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Refresh" (
    "refreshId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshtoken" TEXT NOT NULL,

    CONSTRAINT "Refresh_pkey" PRIMARY KEY ("refreshId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Refresh_refreshId_key" ON "Refresh"("refreshId");

-- CreateIndex
CREATE UNIQUE INDEX "Refresh_refreshtoken_key" ON "Refresh"("refreshtoken");

-- CreateIndex
CREATE INDEX "Refresh_userId_idx" ON "Refresh"("userId");

-- AddForeignKey
ALTER TABLE "Refresh" ADD CONSTRAINT "Refresh_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
