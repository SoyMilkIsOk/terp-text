-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispensary" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Dispensary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strain" (
    "id" SERIAL NOT NULL,
    "dispensaryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Strain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStrain" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "strainId" INTEGER NOT NULL,

    CONSTRAINT "UserStrain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Dispensary_name_key" ON "Dispensary"("name");

-- AddForeignKey
ALTER TABLE "Strain" ADD CONSTRAINT "Strain_dispensaryId_fkey" FOREIGN KEY ("dispensaryId") REFERENCES "Dispensary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStrain" ADD CONSTRAINT "UserStrain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStrain" ADD CONSTRAINT "UserStrain_strainId_fkey" FOREIGN KEY ("strainId") REFERENCES "Strain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
