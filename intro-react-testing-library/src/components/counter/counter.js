import React, { useState } from "react";

export default function Counter() {
  const [counts, setCounts] = useState(0);

  const handleClick = () => {
    setCounts(counts + 1);
  };

  return (
    <>
      <button onClick={handleClick}>Click</button>
      <p>Clicked times: {counts}</p>
    </>
  );
}
