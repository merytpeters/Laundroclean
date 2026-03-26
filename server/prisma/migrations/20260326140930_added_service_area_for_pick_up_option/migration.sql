-- CreateTable
CREATE TABLE "ServiceArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "latMin" DOUBLE PRECISION,
    "latMax" DOUBLE PRECISION,
    "lngMin" DOUBLE PRECISION,
    "lngMax" DOUBLE PRECISION,

    CONSTRAINT "ServiceArea_pkey" PRIMARY KEY ("id")
);
