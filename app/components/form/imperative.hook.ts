"use client";
import { type CurrencyData } from "@rxjs-sample/app/api/hello/route";
import { memoizeWith } from "ramda";
import { useEffect, useState } from "react";


const fetchCurrencyData = (currency: string) =>
  fetch(`/api/hello?currency=${currency}`).then((res) => res.json());

type Updater = ReturnType<typeof useState<CurrencyData | undefined>>[1];

const getCurrencyData = memoizeWith(
  (x: string) => x,
  (currency) => {
    let subscribers: Updater[] = [];
    let intervalId: any = null;
    let lastVal: CurrencyData;

    const addSubscriber = (updater: Updater) => {
      subscribers.push(updater);

      if (subscribers.length === 1) {
        intervalId = onFetchCurrencyData();
      }

      if (lastVal) updater(lastVal);
    };

    const removeSubscriber = (updater: Updater) => {
      subscribers = subscribers.filter((callback) => callback !== updater);

      if (!subscribers.length) {
        clearInterval(intervalId);
      }
    };

    const foo = async () => {
      const currencyData = await fetchCurrencyData(currency);
      lastVal = currencyData;
      subscribers.forEach((update) => update(currencyData));
    };

    const onFetchCurrencyData = () => {
      foo();
      return setInterval(foo, 4000);
    };

    return {
      addSubscriber,
      removeSubscriber,
    };
  }
);

export const useGetData = (currency: string) => {
  const [data, setData] = useState<CurrencyData>();

  useEffect(() => {
    const { addSubscriber, removeSubscriber } = getCurrencyData(currency);

    addSubscriber(setData);

    return () => {
      removeSubscriber(setData);
    };
  }, [currency]);

  return data;
};
