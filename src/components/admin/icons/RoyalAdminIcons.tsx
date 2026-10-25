import React from 'react';

export interface RoyalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/**
 * Royal Mughal Jharokha & Palace Arch Icon
 * Replaces generic skyscraper Building2 for luxury venues & palaces.
 */
export function RoyalPalaceIcon({
  size = 20,
  className = '',
  strokeWidth = 1.5,
  ...props
}: RoyalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Palace Base / Plinth */}
      <path d="M3 21h18" />
      <path d="M4 18h16" />

      {/* Side Pillars */}
      <path d="M5 18V9" />
      <path d="M19 18V9" />

      {/* Traditional Awadhi Scalloped / Cusped Arch */}
      <path d="M7 18v-5.5c0-1.5 1-2.5 2-2.5 1 0 1.5.8 2 1.5.3.4.6.6 1 .6s.7-.2 1-.6c.5-.7 1-1.5 2-1.5 1 0 2 1 2 2.5V18" />

      {/* Central Dome / Chhatri with Kalash Finial */}
      <path d="M12 2v2" />
      <path d="M12 4c-3.2 0-5 2.5-5 5h10c0-2.5-1.8-5-5-5Z" />

      {/* Side Turrets */}
      <path d="M4 9l1.5-2.5L7 9" />
      <path d="M17 9l1.5-2.5L20 9" />
    </svg>
  );
}

/**
 * Royal Farman Scroll & Wax Seal Icon
 * Replaces generic SMS speech bubble MessageSquare for VIP client inquiries.
 */
export function RoyalInquiryScrollIcon({
  size = 20,
  className = '',
  strokeWidth = 1.5,
  ...props
}: RoyalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Rolled Royal Parchment / Scroll Body */}
      <path d="M8 3h9a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h1" />
      {/* Scroll Top Roll */}
      <path d="M7 3a3 3 0 0 0-3 3c0 1.66 1.34 2.5 3 2.5h10c1.66 0 3-.84 3-2.5A3 3 0 0 0 17 3H7Z" />
      {/* Scroll Text Lines */}
      <path d="M8 12h5" />
      <path d="M8 15h3.5" />
      {/* Royal Wax Seal Medallion with Ribbon */}
      <circle cx="16.5" cy="15.5" r="2.5" />
      <path d="M15.5 18l-1 3 2-1 2 1-1-3" />
    </svg>
  );
}

/**
 * Royal Auspicious Lotus Crest Icon
 * Replaces tech Zap / generic Layers for wedding disciplines and bespoke decor.
 */
export function RoyalLotusCrestIcon({
  size = 20,
  className = '',
  strokeWidth = 1.5,
  ...props
}: RoyalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Central Blooming Lotus Petal */}
      <path d="M12 3c-1.8 3.5-2 6.5-2 9.5 0 2 1 3.5 2 3.5s2-1.5 2-3.5c0-3-.2-6-2-9.5Z" />
      {/* Left Inner Petal */}
      <path d="M10 12.5c-2.5-.5-5-2-6-4.5 1.5 4 4 6 6 6.5" />
      {/* Right Inner Petal */}
      <path d="M14 12.5c2.5-.5 5-2 6-4.5-1.5 4-4 6-6 6.5" />
      {/* Outer Flared Petals */}
      <path d="M5.5 15C3 14 2 12 2 12c1 3.5 4 5 7 5.5" />
      <path d="M18.5 15C21 14 22 12 22 12c-1 3.5-4 5-7 5.5" />
      {/* Royal Auspicious Plinth */}
      <path d="M9 19c1.5.8 4.5.8 6 0" />
      <path d="M7.5 21c3 1 6 1 9 0" />
    </svg>
  );
}

/**
 * Royal Seal & Crown Medallion Icon
 * Replaces generic 5-point Star for verified stories and reviews.
 */
export function RoyalTestimonialSealIcon({
  size = 20,
  className = '',
  strokeWidth = 1.5,
  ...props
}: RoyalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Scalloped Medallion Outer Ring */}
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="6" strokeDasharray="1.5 1.5" />
      {/* Centered Royal Crown Hallmark */}
      <path d="M9 14h6" />
      <path d="M9 14l-.8-4 2.3 2 1.5-3 1.5 3 2.3-2-.8 4" />
      {/* Royal Zari Tassels Bottom */}
      <path d="M10 20.5l-2 2.5 1.5-4" />
      <path d="M14 20.5l2 2.5-1.5-4" />
    </svg>
  );
}

/**
 * Royal Picture Frame & Palace Gallery Icon
 * Replaces generic camera/image icon for high-resolution Media Library CDN.
 */
export function RoyalGalleryFrameIcon({
  size = 20,
  className = '',
  strokeWidth = 1.5,
  ...props
}: RoyalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Outer Ornate Frame */}
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      {/* Inner Inset Bevel */}
      <rect x="6" y="6" width="12" height="12" rx="1.5" strokeDasharray="1 1" />
      {/* Traditional Mughal Arch vignette inside frame */}
      <path d="M9 15v-3c0-1.2.7-2 1.5-2 .5 0 1 .4 1.5.8.5-.4 1-.8 1.5-.8.8 0 1.5.8 1.5 2v3" />
      {/* Diamond finials in corners */}
      <circle cx="4.5" cy="4.5" r=".75" fill="currentColor" />
      <circle cx="19.5" cy="4.5" r=".75" fill="currentColor" />
      <circle cx="4.5" cy="19.5" r=".75" fill="currentColor" />
      <circle cx="19.5" cy="19.5" r=".75" fill="currentColor" />
    </svg>
  );
}

/**
 * Royal Astrolabe & Atelier Compass Icon
 * Replaces generic industrial cogwheel for Business Configuration & Edge Settings.
 */
export function RoyalAtelierCompassIcon({
  size = 20,
  className = '',
  strokeWidth = 1.5,
  ...props
}: RoyalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Outer Astrolabe Ring */}
      <circle cx="12" cy="12" r="9" />
      {/* Top Hanging Ring */}
      <circle cx="12" cy="3" r="1.5" />
      {/* Eight-Pointed Royal Star / Compass Rose */}
      <path d="M12 7v10" />
      <path d="M7 12h10" />
      <path d="M8.5 8.5l7 7" strokeDasharray="1 2" />
      <path d="M15.5 8.5l-7 7" strokeDasharray="1 2" />
      {/* Central Ruby Pivot */}
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

/**
 * Royal Diwan & Concierge Command Overview Icon
 * Replaces generic 4-box LayoutDashboard for Overview.
 */
export function RoyalConciergeOverviewIcon({
  size = 20,
  className = '',
  strokeWidth = 1.5,
  ...props
}: RoyalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Symmetrical Heraldic Canopy Crest */}
      <path d="M12 2l2 2.5h4.5L18 8l3 2-2 3v7H5v-7l-2-3 3-2-.5-3.5H10L12 2Z" />
      {/* Inner Diwan Arch */}
      <path d="M8.5 20v-5c0-1.5 1-2.5 2-2.5s1.2.5 1.5 1c.3-.5.5-1 1.5-1s2 1 2 2.5v5" />
      {/* Central Royal Crown Point */}
      <circle cx="12" cy="8" r="1.25" fill="currentColor" />
    </svg>
  );
}

/**
 * Royal Monogram Crest Seal
 * Used in sidebar top header and branded badges.
 */
export function RoyalMonogramCrest({
  size = 24,
  className = '',
  ...props
}: RoyalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Shield Silhouette */}
      <path
        d="M16 2.5L27 6.5v9c0 7.5-6.5 12.5-11 14-4.5-1.5-11-6.5-11-14v-9L16 2.5Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Crown Top Crest */}
      <path d="M11 11l2 2 3-3 3 3 2-2v4H11v-4Z" strokeWidth={1.2} />
      {/* Stylized Awadhi Arch Center */}
      <path
        d="M12.5 23v-5c0-1.5.8-2.5 2-2.5s1.2.6 1.5 1c.3-.4.5-1 1.5-1s2 1 2 2.5v5"
        strokeWidth={1.2}
      />
      {/* Royal Kalash Dot */}
      <circle cx="16" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
