"use client";

import type { SyntheticEvent } from "react";
import { cn } from "@/lib/utils";

export interface ThemeScreenshotProps {
  dark: string;
  light: string;
  alt: string;
  fill?: boolean;
  className?: string;
  darkClassName?: string;
  lightClassName?: string;
  /** @deprecated Native img ignores sizes; kept for API compatibility. */
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  /** Chat widget: white canvas in light theme, dark canvas in dark theme. */
  surface?: "default" | "white" | "chat";
}

function blockImageAction(event: SyntheticEvent) {
  event.preventDefault();
}

function ProtectedScreenshotImg({
  src,
  className,
  width,
  height,
  alt,
  priority,
}: {
  src: string;
  className: string;
  width?: number;
  height?: number;
  alt: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      {...(priority ? { fetchPriority: "high" as const } : {})}
      draggable={false}
      onContextMenu={blockImageAction}
      onDragStart={blockImageAction}
      className={className}
    />
  );
}

function ViewOnlyShield() {
  return (
    <div
      className="theme-screenshot__shield absolute inset-0 z-10"
      aria-hidden
      onContextMenu={blockImageAction}
      onDragStart={blockImageAction}
    />
  );
}

export function ThemeScreenshot({
  dark,
  light,
  alt,
  fill = true,
  className,
  darkClassName,
  lightClassName,
  priority,
  width,
  height,
  surface = "default",
}: ThemeScreenshotProps) {
  const baseClass = fill ? "object-contain object-top" : "";
  const darkImageClass = cn(
    "theme-screenshot__img theme-screenshot__img--dark",
    baseClass,
    className,
    darkClassName,
    surface === "white" && "bg-white",
  );
  const lightImageClass = cn(
    "theme-screenshot__img theme-screenshot__img--light",
    baseClass,
    className,
    lightClassName,
    (surface === "white" || surface === "chat") && "bg-white",
  );
  const darkContainerBg =
    surface === "chat" ? "bg-[#0b0f11]" : surface === "white" ? "bg-white" : "bg-muted/20";
  const lightContainerBg =
    surface === "chat" || surface === "white" ? "bg-white" : "bg-muted/20";

  if (!fill) {
    return (
      <span
        className="theme-screenshot relative inline-block"
        onContextMenu={blockImageAction}
      >
        <ProtectedScreenshotImg
          src={dark}
          width={width}
          height={height}
          alt={alt}
          priority={priority}
          className={darkImageClass}
        />
        <ProtectedScreenshotImg
          src={light}
          width={width}
          height={height}
          alt={alt}
          priority={priority}
          className={lightImageClass}
        />
        <ViewOnlyShield />
      </span>
    );
  }

  return (
    <div
      className={cn(
        "theme-screenshot relative isolate h-full w-full select-none",
        darkContainerBg,
      )}
      onContextMenu={blockImageAction}
    >
      <ProtectedScreenshotImg
        src={dark}
        alt={alt}
        priority={priority}
        className={cn(darkImageClass, "absolute inset-0 h-full w-full")}
      />
      <ProtectedScreenshotImg
        src={light}
        alt={alt}
        priority={priority}
        className={cn(
          lightImageClass,
          lightContainerBg,
          "absolute inset-0 h-full w-full",
        )}
      />
      <ViewOnlyShield />
    </div>
  );
}
