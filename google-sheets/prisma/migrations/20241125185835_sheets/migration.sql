-- CreateTable
CREATE TABLE "Row" (
    "id" SERIAL NOT NULL,
    "rowData" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Row_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailStatus" (
    "id" SERIAL NOT NULL,
    "lastProcessedRow" INTEGER NOT NULL DEFAULT 0,
    "lastSentAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailStatus_pkey" PRIMARY KEY ("id")
);
