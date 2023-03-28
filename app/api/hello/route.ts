import { NextRequest, NextResponse } from "next/server";
import {
  bufferCount,
  firstValueFrom,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
} from "rxjs";

const currencies = ["EUR", "USD"] as const;

export type CurrencyData = Record<typeof currencies[number], number>;

const requested = new Subject<void>();

const data: Observable<CurrencyData> = requested.pipe(
  bufferCount(5),
  startWith(null),
  map(() => ({
    EUR: Math.random(),
    USD: Math.random(),
  })),
  shareReplay(1)
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("currency");

  requested.next();

  const st = currencies.find((x) => x === id)
    ? data.pipe(map((d) => d[id as typeof currencies[number]]))
    : data;

  return NextResponse.json(await firstValueFrom<CurrencyData | number>(st));
}
