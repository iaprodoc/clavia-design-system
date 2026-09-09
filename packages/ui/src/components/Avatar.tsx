"use client";

import { type ImgHTMLAttributes, useState } from "react";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src"> {
  alt?: string;
  initials?: string;
  name: string;
  size?: AvatarSize;
  src?: string;
}

function initialsFromName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase();
}

export function Avatar({
  alt,
  className,
  initials,
  name,
  onError,
  size = "md",
  src,
  ...imageProps
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const fallback = initials ?? initialsFromName(name);
  const classes = ["clv-avatar", `clv-avatar--${size}`, className].filter(Boolean).join(" ");

  return (
    <span
      aria-label={alt ?? name}
      className={classes}
      data-avatar-fallback={imageFailed || !src ? "true" : undefined}
      data-avatar-state={imageFailed || !src ? "fallback" : "loaded"}
      role="img"
    >
      {src && !imageFailed ? (
        <img
          {...imageProps}
          alt=""
          className="clv-avatar__image"
          onError={(event) => {
            setImageFailed(true);
            onError?.(event);
          }}
          src={src}
        />
      ) : (
        <span aria-hidden="true" className="clv-avatar__fallback">
          {fallback}
        </span>
      )}
    </span>
  );
}
