import { ResponsiveVideo } from "./ResponsiveVideo";

interface BackgroundVideoProps {
  desktopSrc: string;
  mobileSrc?: string;
  poster?: string;
  className?: string;
  overlayOpacity?: number;
}

export function BackgroundVideo({
  desktopSrc,
  mobileSrc,
  poster,
  className = "",
  overlayOpacity = 0.4,
}: BackgroundVideoProps) {
  return (
    <div className={`absolute inset-0 w-full h-full -z-10 overflow-hidden ${className}`}>
      <ResponsiveVideo
        desktopSrc={desktopSrc}
        mobileSrc={mobileSrc}
        poster={poster}
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay for text readability */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />
    </div>
  );
}
