-- CreateTable
CREATE TABLE "PublicKeyCredentials" (
    "id" SERIAL NOT NULL,
    "publicKey" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicKeyCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicKeyCredentials_publicKey_key" ON "PublicKeyCredentials"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "PublicKeyCredentials_externalId_key" ON "PublicKeyCredentials"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicKeyCredentials_userId_key" ON "PublicKeyCredentials"("userId");

-- AddForeignKey
ALTER TABLE "PublicKeyCredentials" ADD CONSTRAINT "PublicKeyCredentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
