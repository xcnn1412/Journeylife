import path from "path";
import { fileURLToPath } from "url";
import { buildConfig, type Plugin } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { seoPlugin } from "@payloadcms/plugin-seo";
import sharp from "sharp";

import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Categories } from "./src/collections/Categories";
import { Posts } from "./src/collections/Posts";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Postgres in production (Railway); SQLite locally for offline dev/verify.
const databaseURI = process.env.DATABASE_URI || process.env.DATABASE_URL || "";
const usePostgres = databaseURI.startsWith("postgres");
const db = usePostgres
  ? postgresAdapter({ pool: { connectionString: databaseURI } })
  : sqliteAdapter({ client: { url: databaseURI || "file:./payload-dev.db" } });

const plugins: Plugin[] = [
  seoPlugin({ collections: ["posts"], uploadsCollection: "media", tabbedUI: true }),
];

// Enable Cloudflare R2 (S3-compatible) only when configured.
if (process.env.R2_BUCKET) {
  plugins.push(
    s3Storage({
      collections: { media: true },
      bucket: process.env.R2_BUCKET,
      config: {
        endpoint: process.env.R2_ENDPOINT || "",
        region: "auto",
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
      },
    }),
  );
}

export default buildConfig({
  admin: { user: Users.slug },
  collections: [Posts, Categories, Media, Users],
  editor: lexicalEditor(),
  db,
  secret: process.env.PAYLOAD_SECRET || "",
  sharp,
  typescript: { outputFile: path.resolve(dirname, "src/payload-types.ts") },
  plugins,
});
