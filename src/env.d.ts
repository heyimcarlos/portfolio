/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
        readonly GOOGLE_DRIVE_RESUME_ID: string;
}

interface ImportMeta {
        readonly env: ImportMetaEnv;
}
