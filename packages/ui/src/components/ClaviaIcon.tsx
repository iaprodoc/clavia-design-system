"use client";

import { type SVGProps, useId } from "react";

export interface ClaviaIconProps extends Omit<SVGProps<SVGSVGElement>, "height" | "width"> {
  size?: number | string;
  title?: string;
}

export function ClaviaIcon({
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  role,
  size = 48,
  title,
  ...props
}: ClaviaIconProps) {
  const generatedId = useId().replaceAll(":", "");
  const clipId = `${generatedId}-clip`;
  const maskId = `${generatedId}-mask`;
  const glowId = `${generatedId}-glow`;
  const lightId = `${generatedId}-light`;
  const overlayId = `${generatedId}-overlay`;
  const titleId = `${generatedId}-title`;
  const isHidden = ariaHidden === true || ariaHidden === "true";
  const hasExternalName = Boolean(ariaLabel || ariaLabelledBy);
  const accessibleTitle = title ?? (!isHidden && !hasExternalName ? "Clavia" : undefined);
  const classes = ["clv-icon", className].filter(Boolean).join(" ");

  return (
    <svg
      {...props}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      aria-labelledby={accessibleTitle ? titleId : ariaLabelledBy}
      className={classes}
      fill="none"
      focusable="false"
      height={size}
      preserveAspectRatio="xMidYMid meet"
      role={isHidden ? undefined : (role ?? "img")}
      viewBox="0 0 456 456"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {accessibleTitle ? <title id={titleId}>{accessibleTitle}</title> : null}
      <g clipPath={`url(#${clipId})`}>
        <mask
          height="456"
          id={maskId}
          maskUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
          width="456"
          x="0"
          y="0"
        >
          <rect fill="#021826" height="456" width="456" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <rect fill="#021826" height="467" width="471" />
          <g filter={`url(#${glowId})`}>
            <circle cx="447" cy="443" fill="#D9D9D9" r="189" />
          </g>
          <g filter={`url(#${lightId})`}>
            <ellipse cx="334" cy="97" fill="#224E82" fillOpacity="0.89" rx="249" ry="211" />
          </g>
          <g filter={`url(#${overlayId})`} style={{ mixBlendMode: "overlay" }}>
            <circle cx="222" cy="507" fill="#224E82" r="279" />
          </g>
        </g>
        <path
          d="M302 267.298V188.139C302 156.084 275.784 130 243.543 130H168.509V156.207H243.543C248.068 156.207 252.347 157.137 256.257 158.825L168.509 244.321C154.614 257.853 150.36 277.257 157.221 295.217C164.427 314.034 183.191 326 203.431 326H288.818C296.098 326 302 320.127 302 312.884V299.769H202.89C193.668 299.769 185.036 294.337 181.814 285.723C178.765 277.599 180.683 269.157 186.954 263.04L274.038 178.18C275.071 181.312 275.661 184.64 275.661 188.115V267.273H302V267.298Z"
          fill="#EFEEED"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="616"
          id={glowId}
          width="616"
          x="139"
          y="135"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="59.5" />
        </filter>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="660"
          id={lightId}
          width="736"
          x="-34"
          y="-233"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="59.5" />
        </filter>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="796"
          id={overlayId}
          width="796"
          x="-176"
          y="109"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="59.5" />
        </filter>
        <clipPath id={clipId}>
          <rect fill="white" height="456" rx="116" width="456" />
        </clipPath>
      </defs>
    </svg>
  );
}
