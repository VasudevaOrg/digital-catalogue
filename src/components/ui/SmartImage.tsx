// src/components/ui/SmartImage.tsx
"use client";

import Image from "next/image";
import { CSSProperties } from "react";
import { getOptimizedImageProps } from "@/lib/imageUtils";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export function SmartImage({
  src,
  alt,
  className,
  style,
  priority = false,
  fill = false,
  width,
  height,
  onError,
}: SmartImageProps) {
  const imageProps = getOptimizedImageProps(src, alt);

  if (imageProps.useNextImage) {
    // Use Next.js Image component for configured domains
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        style={style}
        priority={priority}
        onError={onError}
      />
    );
  } else {
    // Use regular img tag for blob storage and other external sources
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
          objectFit: "cover",
          ...style,
          ...imageProps.props.style,
        }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={onError || imageProps.props.onError}
      />
    );
  }
}
