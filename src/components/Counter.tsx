import { useImmer } from "use-immer";
import "./Counter.css";

export const Counter = () => {
  const [count, setCount] = useImmer(0);
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="count">{count}</h1>
      <div>
        <button
          onClick={() => setCount(count + 1)}
          className="button bg-green-600"
        >
          Increment (+)
        </button>
        <button
          onClick={() => setCount(count - 1)}
          className="button bg-red-600"
        >
          Decrement (-)
        </button>
        <button onClick={() => setCount(0)} className="button bg-yellow-600">
          Reset (R)
        </button>
      </div>
    </div>
  );
};
