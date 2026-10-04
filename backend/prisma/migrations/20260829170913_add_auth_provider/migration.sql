-- AlterTable
ALTER TABLE "users" ADD COLUMN     "auth_provider" VARCHAR(20) NOT NULL DEFAULT 'local',
ALTER COLUMN "password_hash" DROP NOT NULL;
