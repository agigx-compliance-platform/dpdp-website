"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ThemeScreenshotProps {
  dark: string;
  light: string;
  alt: string;
  fill?: boolean;
  className?: string;
  darkClassName?: string;
  lightClassName?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  /** Chat widget screenshots need a white canvas in either site theme. */
  surface?: "default" | "white";
}

export function ThemeScreenshot({
  dark,
  light,
  alt,
  fill = true,
  className,
  darkClassName,
  lightClassName,
  sizes,
  priority,
  width,
  height,
  surface = "default",
}: ThemeScreenshotProps) {
  const baseClass = fill ? "object-cover object-top" : "";
  const whiteSurface = surface === "white";
  const darkImageClass = cn(baseClass, className, darkClassName, whiteSurface && "bg-white");
  const lightImageClass = cn(baseClass, className, lightClassName, whiteSurface && "bg-white");
  const containerBg = whiteSurface ? "bg-white" : "bg-muted/20";

  if (!fill) {
    return (
      <span className="theme-screenshot inline-block">
        <Image
          src={dark}
          alt={alt}
          width={width}
          height={height}
          className={cn("theme-screenshot__img theme-screenshot__img--dark", darkImageClass)}
          sizes={sizes}
          priority={priority}
          unoptimized
        />
        <Image
          src={light}
          alt={alt}
          width={width}
          height={height}
          className={cn("theme-screenshot__img theme-screenshot__img--light", lightImageClass)}
          sizes={sizes}
          priority={priority}
          unoptimized
        />
      </span>
    );
  }

  return (
    <div className={cn("theme-screenshot relative h-full w-full", containerBg)}>
      <Image
        src={dark}
        alt={alt}
        fill
        className={cn("theme-screenshot__img theme-screenshot__img--dark", darkImageClass)}
        sizes={sizes}
        priority={priority}
        unoptimized
      />
      <Image
        src={light}
        alt={alt}
        fill
        className={cn("theme-screenshot__img theme-screenshot__img--light", containerBg, lightImageClass)}
        sizes={sizes}
        priority={priority}
        unoptimized
      />
    </div>
  );
}
