import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "tours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tour_id" varchar NOT NULL,
  	"code" varchar,
  	"title" varchar NOT NULL,
  	"img" varchar,
  	"banner_media_id" integer,
  	"country" varchar,
  	"city" varchar,
  	"days" numeric,
  	"days_text" varchar,
  	"airline" varchar,
  	"price_from" numeric,
  	"is_hot_deal" boolean DEFAULT false,
  	"discount_percent" numeric,
  	"fire_price" numeric,
  	"original_price" numeric,
  	"deal_date_text" varchar,
  	"deal_img" varchar,
  	"deal_banner_media_id" integer,
  	"deal_alt" varchar,
  	"image" varchar,
  	"hero_media_id" integer,
  	"pdf" varchar,
  	"highlights" jsonb,
  	"periods" jsonb,
  	"itinerary" jsonb,
  	"departures" jsonb,
  	"departures_min" timestamp(3) with time zone,
  	"departures_max" timestamp(3) with time zone,
  	"active" boolean DEFAULT true,
  	"list_synced_at" timestamp(3) with time zone,
  	"detail_synced_at" timestamp(3) with time zone,
  	"detail_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "media" ADD COLUMN "source_url" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tours_id" integer;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_banner_media_id_media_id_fk" FOREIGN KEY ("banner_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_deal_banner_media_id_media_id_fk" FOREIGN KEY ("deal_banner_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "tours_tour_id_idx" ON "tours" USING btree ("tour_id");
  CREATE INDEX "tours_code_idx" ON "tours" USING btree ("code");
  CREATE INDEX "tours_banner_media_idx" ON "tours" USING btree ("banner_media_id");
  CREATE INDEX "tours_country_idx" ON "tours" USING btree ("country");
  CREATE INDEX "tours_city_idx" ON "tours" USING btree ("city");
  CREATE INDEX "tours_days_idx" ON "tours" USING btree ("days");
  CREATE INDEX "tours_price_from_idx" ON "tours" USING btree ("price_from");
  CREATE INDEX "tours_is_hot_deal_idx" ON "tours" USING btree ("is_hot_deal");
  CREATE INDEX "tours_deal_banner_media_idx" ON "tours" USING btree ("deal_banner_media_id");
  CREATE INDEX "tours_hero_media_idx" ON "tours" USING btree ("hero_media_id");
  CREATE INDEX "tours_departures_min_idx" ON "tours" USING btree ("departures_min");
  CREATE INDEX "tours_departures_max_idx" ON "tours" USING btree ("departures_max");
  CREATE INDEX "tours_active_idx" ON "tours" USING btree ("active");
  CREATE INDEX "tours_updated_at_idx" ON "tours" USING btree ("updated_at");
  CREATE INDEX "tours_created_at_idx" ON "tours" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_source_url_idx" ON "media" USING btree ("source_url");
  CREATE INDEX "payload_locked_documents_rels_tours_id_idx" ON "payload_locked_documents_rels" USING btree ("tours_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tours" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tours" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tours_fk";
  
  DROP INDEX "media_source_url_idx";
  DROP INDEX "payload_locked_documents_rels_tours_id_idx";
  ALTER TABLE "media" DROP COLUMN "source_url";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tours_id";`)
}
