'use client'
import React, { useState } from "react";
import { useGetData } from "./imperative.hook";
import { useGetDataRx } from "./reactive.hook";

type Props = {};

const MyForm = (props: Props) => {
  const [curr, setCurr] = useState<string>("EUR");

//   const data = useGetDataRx(curr);
  const data = useGetData(curr);

  return (
    <div>
      <select onChange={(e) => setCurr(e.target.value)}>
        {["EUR", "USD"].map((x) => (
          <option value={x} key={x}>
            {x}
          </option>
        ))}
      </select>

      <div>
        Rx Value: 
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      {/* <div>
        Imp Value: 
        <pre>{JSON.stringify(data2, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default MyForm;
