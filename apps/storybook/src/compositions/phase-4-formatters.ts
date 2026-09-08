const locale = "pt-BR";
const timeZone = "America/Fortaleza";

const integer = new Intl.NumberFormat(locale, {
  maximumFractionDigits: 0,
});

const percentage = new Intl.NumberFormat(locale, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: "percent",
});

const currency = new Intl.NumberFormat(locale, {
  currency: "BRL",
  style: "currency",
});

const date = new Intl.DateTimeFormat(locale, {
  day: "2-digit",
  month: "short",
  timeZone,
  year: "numeric",
});

const time = new Intl.DateTimeFormat(locale, {
  hour: "2-digit",
  minute: "2-digit",
  timeZone,
});

export const formatCompositionInteger = (value: number) => integer.format(value);

export const formatCompositionPercentage = (value: number) => percentage.format(value);

export const formatCompositionCurrency = (value: number) => currency.format(value);

export const formatCompositionDate = (value: Date) => date.format(value);

export const formatCompositionDateTime = (value: Date) =>
  `${formatCompositionDate(value)} · ${time.format(value)}`;
