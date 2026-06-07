import path from "path";
import { fileURLToPath } from "url";
import { buildConfig, type Plugin } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  ParagraphFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  ChecklistFeature,
  IndentFeature,
  BlockquoteFeature,
  UploadFeature,
  HorizontalRuleFeature,
  AlignFeature,
  BlocksFeature,
} from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { th } from "@payloadcms/translations/languages/th";
import { en } from "@payloadcms/translations/languages/en";
import sharp from "sharp";

import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Categories } from "./src/collections/Categories";
import { Posts } from "./src/collections/Posts";
import { blogBlocks } from "./src/blocks/blogBlocks";

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
  admin: {
    user: Users.slug,
    // Branding shown in the browser tab / login screen.
    meta: {
      title: "Journey Life — ระบบจัดการเนื้อหา",
      titleSuffix: " · Journey Life CMS",
      description: "ระบบจัดการเนื้อหาเว็บไซต์ Journey Life — จัดการผลงาน (Portfolio) และคลังรูปภาพ",
      icons: [{ rel: "icon", url: "/favicon.ico" }],
    },
    // Friendly Thai onboarding panel at the top of the dashboard.
    components: {
      beforeDashboard: ["@/components/admin/Welcome#Welcome"],
    },
  },
  // Admin UI defaults to Thai (with English available via the account menu).
  i18n: {
    fallbackLanguage: "th",
    supportedLanguages: { th, en },
  },
  collections: [Posts, Categories, Media, Users],
  // Curated, Word-like editor: a fixed toolbar (always visible) with only the
  // controls a non-technical editor needs — no hidden "/" commands required.
  editor: lexicalEditor({
    features: [
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      LinkFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      ChecklistFeature(),
      IndentFeature(),
      BlockquoteFeature(),
      UploadFeature(),
      HorizontalRuleFeature(),
      AlignFeature(),
      // Recommended blog "widgets" — see src/blocks/blogBlocks.ts
      BlocksFeature({ blocks: blogBlocks }),
    ],
  }),
  db,
  secret: process.env.PAYLOAD_SECRET || "",
  sharp,
  // Cap uploads at 50 MB (DoS / R2 cost protection). Applies to all collections.
  upload: { limits: { fileSize: 52_428_800 } },
  typescript: { outputFile: path.resolve(dirname, "src/payload-types.ts") },
  plugins,
});
