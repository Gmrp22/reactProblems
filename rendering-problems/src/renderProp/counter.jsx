import { useState } from "react";

export function Counter({render}) {
  const [count, setCount] = useState(0);
 
  return  render({count, setCount})
}
