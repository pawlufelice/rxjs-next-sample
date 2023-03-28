"use client";
import { type CurrencyData } from "@rxjs-sample/app/api/hello/route";
import { memoizeWith } from "ramda";
import { useEffect, useState } from "react";

import { interval, share, startWith, switchMap } from "rxjs";

const currencyData = memoizeWith(String, (curr) =>
  interval(4000).pipe(
    startWith(1),
    switchMap(() => fetch(`/api/hello?currency=${curr}`)),
    switchMap((res) => res.json()),
    share()
  )
);

export const useGetDataRx = (currency: string) => {
  const [data, setData] = useState<CurrencyData>();

  useEffect(() => {
    const sub = currencyData(currency).subscribe(setData);
    return () => sub.unsubscribe();
  }, [currency]);

  return data;
};
