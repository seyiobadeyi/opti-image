import type { User } from '@supabase/supabase-js';

// ──────────────────────────────────────────────
// 1. Literal Unions
// ──────────────────────────────────────────────

/** Supported output image formats. Empty string means "keep original". */
export type ImageFormat = '' | 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif';

/** Allowed rotation angles in degrees. */
export type ImageRotation = 0 | 90 | 180 | 270;

/** Media processing actions supported by the transcription/translation engine. */
export type MediaAction = 'transcribe' | 'translate';

/** Top-level tab selection on the main page. */
export type ActiveTab = 'image' | 'media' | 'galleries';

/** Authentication flow step in the AuthModal. */
export type AuthStep = 'email' | 'otp' | 'onboarding';

/** Generic async form status used by newsletter and subscription forms. */
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/** Dashboard navigation tab keys. */
export type DashboardTab = 'optimize' | 'video' | 'history' | 'referrals' | 'galleries' | 'settings';

/** Values persisted to localStorage for cookie consent. */
export type CookieConsentValue = 'accepted' | 'declined';

/** Tooltip placement side (Radix UI). */
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

/** Direction for scroll-reveal entrance animations. */
export type ScrollDirection = 'up' | 'down' | 'left' | 'right';

/** Campaign landing page slugs. */
export type CampaignSlug = 'bwai' | 'seo' | 'marketers' | 'wordpress' | 'shopify';

// ──────────────────────────────────────────────
// 2. Domain Models
// ──────────────────────────────────────────────

/** Filter presets for basic image adjustments. */
export type FilterPreset = 'vivid' | 'muted' | 'bw' | 'warm' | 'cool' | '';

/** Image optimization settings controlled by the SettingsPanel. */
export interface ImageSettings {
  format: ImageFormat;
  quality: number;
  width: string | number;
  height: string | number;
  rotate: ImageRotation;
  autoEnhance: boolean;
  stripMetadata: boolean;
  maintainAspectRatio: boolean;
  exposure: number;         // 0.25–4.0, default 1.0
  saturation: number;       // 0–3.0, default 1.0
  filter: FilterPreset;     // preset override
}

/** Media processing settings controlled by the MediaPanel. */
export interface MediaSettings {
  action: MediaAction | null;
  extractAudioOnly: boolean;
}

/** Video processing settings used in the Dashboard video tab. */
export interface VideoSettings {
  format: string;
  quality: number;
  action: string;
}

/** A single processed image result returned from the server. */
export interface ProcessedImage {
  id: string;
  originalName: string;
  processedName: string;
  originalSize: number;
  processedSize: number;
  width: number;
  height: number;
  format: string;
  savingsPercent: string;
  /** Permanent hosted URL — present when Cloudinary is configured on the server */
  hostedUrl?: string;
}

/** Aggregate summary of a batch processing operation. */
export interface ProcessingSummary {
  filesProcessed: number;
  totalOriginalSize: number;
  totalProcessedSize: number;
  totalSavings?: number;
  totalSavingsPercent: string;
}

/** Result of a transcription or translation operation. */
export interface TranscriptionResult {
  mode: string;
  text: string;
}

/** Result of a video processing operation. */
export interface VideoResult {
  downloadName: string;
  originalName: string;
  processedName: string;
  originalSize: number;
  processedSize: number;
  savingsPercent: string;
}

/** Campaign landing page configuration. */
export interface CampaignData {
  headline: string;
  subtext: string;
  title: string;
}

/** FAQ question-answer pair. */
export interface FAQItem {
  question: string;
  answer: string;
}

// ──────────────────────────────────────────────
// 3. File Extension
// ──────────────────────────────────────────────

/**
 * Extended File interface with an optional user-defined custom name.
 * Used in FileList to allow users to rename files before processing.
 */
export interface FileWithCustomName extends File {
  customName?: string;
}

// ──────────────────────────────────────────────
// 4. API Response Types
// ──────────────────────────────────────────────

/** Response from POST /api/images/convert */
export interface ConvertResponse {
  success: boolean;
  results: ProcessedImage[];
  summary: ProcessingSummary;
}

/** Response from POST /api/media/process */
export interface MediaResponse {
  success: boolean;
  text?: string;
  mode?: string;
  downloadName?: string;
}

/** Response from GET /api/health */
export interface HealthResponse {
  status: string;
}

/** Response from POST /api/images/sync-history */
export interface SyncHistoryResponse {
  success: boolean;
  syncedCount: number;
}

/** A single item in the guest processing history (localStorage). */
export interface GuestHistoryItem {
  file_name: string;
  action_type: string;
  original_size: number;
  processed_size: number;
}

// ──────────────────────────────────────────────
// 5. API Request Option Types
// ──────────────────────────────────────────────

/** Options passed to apiClient.convertImages(). */
export interface ConvertImageOptions {
  format?: ImageFormat;
  quality?: number;
  exposure?: number;
  saturation?: number;
  filter?: FilterPreset;
  /** When true the server sends the processing-complete email. Set only on the last batch call. */
  notifyOnComplete?: boolean;
  width?: string | number;
  height?: string | number;
  stripMetadata?: boolean;
  maintainAspectRatio?: boolean;
  rotate?: ImageRotation;
  autoEnhance?: boolean;
}

/** Options passed to apiClient.processMedia(). */
export interface ProcessMediaOptions {
  action?: MediaAction | null;
  extractAudioOnly?: boolean;
}

// ──────────────────────────────────────────────
// 6. Server Action Return Types
// ──────────────────────────────────────────────

/** Base return type for all server actions. */
export interface ServerActionResult {
  error?: string;
  success?: boolean;
}

/** Return type for subscribeNewsletter server action. */
export interface NewsletterResult extends ServerActionResult {
  alreadySubscribed?: boolean;
  message?: string;
}

// ──────────────────────────────────────────────
// 7. Dashboard Types
// ──────────────────────────────────────────────

/** User profile record from the Supabase profiles table. */
export interface UserProfile {
  id: string;
  credits: number;
  subscription_expires_at: string | null;
  referral_code: string | null;
  referred_by: string | null;
  display_name: string | null;
  use_case: string | null;
  username: string | null;
  phone_number: string | null;
  date_of_birth: string | null;  // ISO date YYYY-MM-DD
  branding_studio_name: string | null;
  branding_color: string | null;
  branding_website: string | null;
  created_at: string;
  updated_at: string;
}

/** Payload sent to PATCH /api/profile */
export interface UpdateProfileData {
  display_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  branding_studio_name?: string;
  branding_color?: string;
  branding_website?: string;
  username?: string;
}

/** A single processing history record from the Supabase processing_history table. */
export interface ProcessingHistoryItem {
  id: string;
  user_id?: string;
  file_name: string;
  action_type: string;
  original_size: number;
  processed_size: number;
  hosted_url?: string | null;
  created_at: string;
}

/** Map of file indices to custom file names in the Dashboard. */
export interface DashboardFileNames {
  [index: number]: string;
}

// ──────────────────────────────────────────────
// 9. Blog Types
// ──────────────────────────────────────────────

/** Blog post metadata extracted from frontmatter. */
export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

/** Full blog post data including rendered HTML content. */
export interface BlogPostData extends BlogPostMeta {
  contentHtml: string;
}

// ──────────────────────────────────────────────
// 10. Component Props
// ──────────────────────────────────────────────

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Override the initial step — used when Google OAuth users need onboarding */
  initialStep?: AuthStep;
  /** Optional URL to redirect to after successful authentication */
  redirectAfterAuth?: string;
}

export interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
  acceptTypes?: Record<string, string[]>;
  formatLabels?: string[];
}

export interface FileListProps {
  files: FileWithCustomName[];
  onRemove: (index: number) => void;
}

export interface SettingsPanelProps {
  settings: ImageSettings;
  onSettingsChange: (settings: ImageSettings) => void;
}

export interface MediaPanelProps {
  settings: MediaSettings;
  onSettingsChange: (settings: MediaSettings) => void;
}

export interface ProgressTrackerProps {
  processed: number;
  total: number;
}

export interface ResultsPanelProps {
  results: ProcessedImage[];
  summary: ProcessingSummary;
  serverUrl: string;
}

export interface LandingHeroProps {
  customHeadline?: string;
  customSubtext?: string;
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: ScrollDirection;
  className?: string;
}

export interface AdBannerProps {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
}

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: TooltipSide;
}

export interface InfoTooltipProps {
  content: React.ReactNode;
}

export interface DashboardClientProps {
  user: { email: string };
  profile: UserProfile | null;
  history: ProcessingHistoryItem[];
}

// ──────────────────────────────────────────────
// 11. Subscription & Payment Types
// ──────────────────────────────────────────────

/** Response from GET /api/payment/subscription/status */
export interface SubscriptionStatus {
  active: boolean;
  expiresAt: string | null;
  isVip?: boolean;
}

/** Response from POST /api/payment/checkout/subscription */
export interface CheckoutResponse {
  success: boolean;
  authorization_url: string;
  reference: string;
}

/** Response from GET /api/payment/price */
export interface PriceInfo {
  originalPrice: number;
  finalPrice: number;
  discount: number;
  promoApplied: string | null;
  planId: string;
  planLabel: string;
  durationDays: number;
}

/** A single subscription plan from GET /api/payment/plans */
export interface SubscriptionPlan {
  id: string;
  days: number;
  price: number;
  label: string;
}

/** A single USD plan from GET /api/payment/usd-plans (Lemon Squeezy) */
export interface UsdPlan {
  id: string;
  label: string;
  days: number;
  priceUsd: number; // cents
  variantId: string;
  isPopular: boolean;
}

/** Response from GET /api/payment/referrals */
export interface ReferralStats {
  referralCode: string;
  totalReferred: number;
  totalConverted: number;
  rewardEarned: string;
}

/** Props for the SubscriptionPaywall component. */
export interface SubscriptionPaywallProps {
  onSubscribed?: () => void;
  onClose?: () => void;
}

// ──────────────────────────────────────────────
// 12. Gallery Types
// ──────────────────────────────────────────────

export interface Gallery {
  id: string;
  owner_id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  access_type: 'public' | 'pin' | 'email_list' | 'account';
  allow_download: boolean;
  watermark: boolean;
  status: 'active' | 'archived' | 'draft';
  expires_at: string | null;
  payment_required: boolean;
  payment_instructions: string | null;
  payment_unlocked: boolean;
  created_at: string;
  updated_at: string;
  item_count?: number;
}

export interface GalleryItem {
  id: string;
  gallery_id: string;
  display_url: string;
  original_url: string;
  filename: string;
  original_size: number;
  display_size: number | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string;
}

export interface GalleryPublicMeta {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  access_type: 'public' | 'pin' | 'email_list' | 'account';
  allow_download: boolean;
  status: 'active' | 'archived' | 'draft';
  payment_required: boolean;
  payment_instructions: string | null;
  payment_unlocked: boolean;
  photographer_name: string | null;
  branding_studio_name: string | null;
  branding_color: string | null;
  branding_website: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface GalleryActivity {
  totalViews: number;
  recentViews: Array<{ viewer_type: string; created_at: string }>;
}

// ──────────────────────────────────────────────
// 13. Window Extensions (Global Augmentation)
// ──────────────────────────────────────────────

declare global {
  interface WindowEventMap {
    'open-auth-modal': CustomEvent;
  }
  interface Window {
    authModalDispatching?: boolean;
  }
}

// ──────────────────────────────────────────────
// 13. Re-exports
// ──────────────────────────────────────────────

/** Re-export Supabase User type for convenience across the app. */
export type { User };
