import "./App.css";
import { Counter } from "./components/Counter";
import { TodoComponent } from "./components/Todo";

function App() {
    return (
        <>
            <TodoComponent />
            <Counter />
        </>
    );
}

export default App;
