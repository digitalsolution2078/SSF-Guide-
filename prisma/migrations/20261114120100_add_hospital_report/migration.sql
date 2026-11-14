-- CreateTable
CREATE TABLE "HospitalReport" (
    "id" TEXT NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "waitMinutes" INTEGER,
    "cashless" BOOLEAN,
    "rating" INTEGER,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HospitalReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HospitalReport_hospitalId_status_idx" ON "HospitalReport"("hospitalId", "status");
