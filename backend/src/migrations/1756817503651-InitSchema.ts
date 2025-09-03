import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1756817503651 implements MigrationInterface {
  name = 'InitSchema1756817503651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "drivers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "license" character varying(32) NOT NULL, "status" character varying(24) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_8e224f1b8f05ace7cfc7c76d03" UNIQUE ("user_id"), CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "role" character varying(16) NOT NULL DEFAULT 'driver', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trucks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plate" character varying(16) NOT NULL, "model" character varying(120) NOT NULL, "year" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driverId" uuid, CONSTRAINT "PK_6a134fb7caa4fb476d8a6e035f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_trucks_plate" ON "trucks" ("plate") `,
    );
    await queryRunner.query(
      `CREATE TABLE "freights" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "origin" character varying(120) NOT NULL, "destination" character varying(120) NOT NULL, "status" character varying(24) NOT NULL DEFAULT 'created', "price" numeric(12,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driverId" uuid NOT NULL, "truckId" uuid NOT NULL, CONSTRAINT "PK_1962972423b23c02a3a0e8c2265" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_freights_status_driver" ON "freights" ("status", "driverId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD CONSTRAINT "FK_8e224f1b8f05ace7cfc7c76d03b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trucks" ADD CONSTRAINT "FK_f2848c35a59188578ac7d31d8a6" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "freights" ADD CONSTRAINT "FK_9cb54ddcee1e9ca115428f38262" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "freights" ADD CONSTRAINT "FK_a126be7ea25639170f6555e2b0b" FOREIGN KEY ("truckId") REFERENCES "trucks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "freights" DROP CONSTRAINT "FK_a126be7ea25639170f6555e2b0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "freights" DROP CONSTRAINT "FK_9cb54ddcee1e9ca115428f38262"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trucks" DROP CONSTRAINT "FK_f2848c35a59188578ac7d31d8a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" DROP CONSTRAINT "FK_8e224f1b8f05ace7cfc7c76d03b"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_freights_status_driver"`);
    await queryRunner.query(`DROP TABLE "freights"`);
    await queryRunner.query(`DROP INDEX "public"."idx_trucks_plate"`);
    await queryRunner.query(`DROP TABLE "trucks"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "drivers"`);
  }
}
