-- AlterTable
ALTER TABLE "public"."Produto" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Produto" ADD CONSTRAINT "Produto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
