import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  className?: string;
}

export function OptimizedImage({ alt, className = "", ...props }: OptimizedImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        alt={alt}
        className="object-cover"
        {...props}
      />
    </div>
  );
}
