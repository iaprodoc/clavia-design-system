"use client";

import { type ReactNode, useId } from "react";
import {
  Slider as AriaSlider,
  Label,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

export type SliderValue = number | number[];
export type SliderOrientation = "horizontal" | "vertical";

export interface SliderProps {
  className?: string;
  defaultValue?: SliderValue;
  description?: ReactNode;
  disabled?: boolean;
  error?: string;
  formatOptions?: Intl.NumberFormatOptions;
  formatValue?: (value: number) => string;
  id?: string;
  label: ReactNode;
  maxValue?: number;
  minValue?: number;
  name?: string;
  onValueChange?: (value: SliderValue) => void;
  onValueChangeEnd?: (value: SliderValue) => void;
  orientation?: SliderOrientation;
  required?: boolean;
  step?: number;
  thumbLabels?: readonly string[];
  value?: SliderValue;
}

function formatOutput(
  values: number[],
  formatValue: SliderProps["formatValue"],
  getThumbValueLabel: (index: number) => string,
) {
  return values
    .map((value, index) => formatValue?.(value) ?? getThumbValueLabel(index))
    .join(" – ");
}

export function Slider({
  className,
  defaultValue,
  description,
  disabled = false,
  error,
  formatOptions,
  formatValue,
  id,
  label,
  maxValue = 100,
  minValue = 0,
  name,
  onValueChange,
  onValueChangeEnd,
  orientation = "horizontal",
  required = false,
  step = 1,
  thumbLabels,
  value,
}: SliderProps) {
  const generatedId = useId();
  const descriptionId = description && !error ? `${generatedId}-description` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy = errorId ?? descriptionId;
  const classes = ["clv-slider", className].filter(Boolean).join(" ");

  return (
    <AriaSlider
      className={classes}
      isDisabled={disabled}
      maxValue={maxValue}
      minValue={minValue}
      orientation={orientation}
      step={step}
      {...(id ? { id } : {})}
      {...(describedBy ? { "aria-describedby": describedBy } : {})}
      {...(error ? { "data-invalid": "true" } : {})}
      {...(required ? { "aria-required": true } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(formatOptions ? { formatOptions } : {})}
      {...(onValueChange ? { onChange: onValueChange } : {})}
      {...(onValueChangeEnd ? { onChangeEnd: onValueChangeEnd } : {})}
      {...(value !== undefined ? { value } : {})}
    >
      <Label className="clv-slider__label">{label}</Label>
      <SliderOutput className="clv-slider__output">
        {({ state }) => formatOutput(state.values, formatValue, state.getThumbValueLabel)}
      </SliderOutput>
      <SliderTrack className="clv-slider__track">
        {({ state }) => (
          <>
            <SliderFill
              className="clv-slider__fill"
              style={({ orientation }) =>
                orientation === "vertical"
                  ? { width: "var(--clv-slider-fill-thickness-vertical)" }
                  : { height: "var(--clv-slider-fill-thickness-horizontal)" }
              }
            />
            {state.values.map((_, index) => (
              <SliderThumb
                className="clv-slider__thumb"
                index={index}
                // biome-ignore lint/suspicious/noArrayIndexKey: cada thumb é definido pelo índice estável do valor no Slider.
                key={index}
                {...(name ? { name: state.values.length > 1 ? `${name}[]` : name } : {})}
                {...(thumbLabels?.[index] ? { "aria-label": thumbLabels[index] } : {})}
              />
            ))}
          </>
        )}
      </SliderTrack>
      {description && !error ? (
        <p className="clv-slider__description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="clv-slider__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </AriaSlider>
  );
}
