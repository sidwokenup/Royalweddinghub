import { VideoHTMLAttributes } from "react";

interface ResponsiveVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  mobileSrc?: string;
  desktopSrc: string;
  poster?: string;
  className?: string;
}

export function ResponsiveVideo({
  mobileSrc,
  desktopSrc,
  poster,
  className = "",
  ...props
}: ResponsiveVideoProps) {
  return (
    <video
      className={`w-full h-full object-cover ${className}`}
      poster={poster}
      playsInline
      {...props}
    >
      {/* Mobile source if provided */}
      {mobileSrc && (
        <source src={mobileSrc} media="(max-width: 768px)" type="video/mp4" />
      )}
      {/* Default/Desktop source */}
      <source src={desktopSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
