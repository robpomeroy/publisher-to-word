/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PLAUSIBLE_SCRIPT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
