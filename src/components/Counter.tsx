import { useImmer } from "use-immer";
import "./Counter.css";

export const Counter = () => {
    const [count, setCount] = useImmer(0);
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 title="count" className="count">
                {count}
            </h1>
            <div>
                <button
                    onClick={() => setCount(count + 1)}
                    className="button bg-green-600"
                >
                    Increment (+)
                </button>
                <button
                    onClick={() => setCount(count - 1)}
                    className="button mx-2 bg-red-600"
                >
                    Decrement (-)
                </button>
                <button
                    onClick={() => setCount(0)}
                    className="button mx-2 bg-yellow-600"
                >
                    Reset (R)
                </button>
            </div>
        </div>
    );
};
