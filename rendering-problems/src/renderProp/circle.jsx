import { Counter } from "./counter";

export function CircleCounter() {
  return (
    <Counter
      render={({count, setCount}) => (
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "lightcoral",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setCount(count + 1)}
        >
          {count}
        </div>
      )}
    />
  );
}
// delegates rendering responsibility to the parent component