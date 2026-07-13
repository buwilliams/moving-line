export type ISODate = string;

const DAY = 86_400_000;

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const dateToDay = (date: ISODate) => Math.round(Date.parse(`${date}T00:00:00Z`) / DAY);
export const dayToDate = (day: number) => new Date(day * DAY).toISOString().slice(0, 10);
export const daysBetween = (a: ISODate, b: ISODate) => dateToDay(b) - dateToDay(a);
