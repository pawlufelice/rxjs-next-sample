"use client";
import { type CurrencyData } from "@rxjs-sample/app/api/hello/route";
import { useEffect, useState } from "react";

export const useGetData = (currency: string) => {
  const [data, setData] = useState<CurrencyData>();

  useEffect(() => {
    fetch(`/api/hello?currency=${currency}`)
      .then((res) => res.json())
      .then(setData);
  }, [currency]);

  return data;
};
