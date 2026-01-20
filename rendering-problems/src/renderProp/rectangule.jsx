import { Counter } from "./counter";

export function RectangleCounter() {
  return (
    <Counter
      render={({count, setCount}) => (
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "0%",
            backgroundColor: "blue",
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
