/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_TWILIO_CALL_ENDPOINT?: string
  readonly VITE_TWILIO_SMS_ENDPOINT?: string
  readonly VITE_GOOGLE_CALENDAR_ENDPOINT?: string
  readonly VITE_CLAUDE_VISION_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
