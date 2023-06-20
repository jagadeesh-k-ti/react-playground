import { useImmer, useImmerReducer } from "use-immer";
import { useMemo } from "react";
import "./common.css";
import "./Todo.css";
import { Draft } from "immer";
import clsx from "clsx";
import { faker } from "@faker-js/faker";
import invariant from "tiny-invariant";

type Filter = "PENDING" | "COMPLETED";
type Action =
    | { type: "UPDATE" | "REMOVE"; id: string }
    | { type: "SET_FILTER"; fliter: Filter }
    | { type: "ADD"; title: string };
type Todo = Readonly<{ id: string; title: string; completed: boolean }>;
type TodoAppState = { todos: Todo[]; filter: Filter };
type TodoTaskProps = {
    todo: Todo;
    update: (id: string) => void;
    remove: (id: string) => void;
};

const initialState: TodoAppState = { todos: [], filter: "PENDING" };

for (let i = 0; i < 5; i++) {
    initialState.todos.push({
        id: faker.string.uuid(),
        title: faker.commerce.product(),
        completed: false,
    });
}

function reducer(draft: Draft<TodoAppState>, action: Action) {
    switch (action.type) {
        case "UPDATE": {
            const todo = draft.todos.find(t => t.id === action.id);
            invariant(todo);
            todo.completed = !todo.completed;
            break;
        }
        case "REMOVE": {
            draft.todos = draft.todos.filter(t => t.id !== action.id);
            break;
        }
        case "ADD": {
            draft.todos.unshift({
                id: faker.string.uuid(),
                title: action.title,
                completed: false,
            });
            break;
        }
        case "SET_FILTER": {
            draft.filter = action.fliter;
            break;
        }
    }
}

const AddTodo = ({ add }: { add: (title: string) => void }) => {
    const [title, setTitle] = useImmer("");
    return (
        <div className="m-4 flex justify-center gap-2">
            <label htmlFor="add" className="inline-flex items-center text-xl">
                Title:
            </label>
            <input
                placeholder="Task Title..."
                className="rounded bg-slate-100 px-2 dark:bg-slate-600"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyUp={e => (e.key === "Enter" ? add(title) : "")}
                id="add"
                required
            />
            <button
                disabled={title == ""}
                onClick={() => {
                    add(title);
                    setTitle("");
                }}
                className="button bg-slate-100 disabled:opacity-30 dark:bg-slate-600"
            >
                Add
            </button>
        </div>
    );
};

const TodoTask = (props: TodoTaskProps) => {
    const { id, title, completed } = props.todo;
    return (
        <div className="task mb-2 inline-flex rounded-sm bg-slate-100 p-4 text-xl dark:bg-slate-600">
            <div className="inline-flex grow">
                <button
                    aria-label={completed ? "completed" : "pending"}
                    onClick={() => props.update(id)}
                    className={clsx(
                        "h-8 w-8 rounded-full border-2 bg-gray-400",
                        completed ? "bg-green-600" : "dark:bg-slate-800"
                    )}
                >
                    {completed ? (
                        <i className="bi bi-check2-circle text-white"></i>
                    ) : (
                        ""
                    )}
                </button>
                <span className="ml-4">{title}</span>
            </div>
            <div className="justify-end">
                <button onClick={() => props.remove(id)} aria-label="remove">
                    <i className="bi bi-trash3-fill text-red-600"></i>
                </button>
            </div>
        </div>
    );
};

export const TodoComponent = () => {
    const [state, dispatch] = useImmerReducer(reducer, initialState);
    const filteredTodo = useMemo(
        () =>
            state.todos.filter(t =>
                state.filter === "COMPLETED" ? t.completed : !t.completed
            ),
        [state]
    );
    console.log(state.filter);
    return (
        <>
            <div className="m-4 flex flex-col justify-center rounded-sm bg-slate-200 p-4 drop-shadow-lg dark:bg-slate-800">
                <div className="m-2 flex flex-row items-center justify-center">
                    <button
                        onClick={() =>
                            dispatch({ type: "SET_FILTER", fliter: "PENDING" })
                        }
                        className={clsx(
                            "button rounded-r-none border border-black text-xl",
                            state.filter === "PENDING" &&
                                "bg-gray-400 dark:bg-gray-600"
                        )}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() =>
                            dispatch({
                                type: "SET_FILTER",
                                fliter: "COMPLETED",
                            })
                        }
                        className={clsx(
                            "button rounded-l-none border border-black text-xl",
                            state.filter === "COMPLETED" && "bg-green-400"
                        )}
                    >
                        Completed
                    </button>
                </div>
                <div className="mt-4 flex h-[70vh] flex-col overflow-y-scroll">
                    {/* map here */}

                    {filteredTodo.map(t => (
                        <TodoTask
                            key={t.id}
                            todo={t}
                            update={(id: string) =>
                                dispatch({ id: id, type: "UPDATE" })
                            }
                            remove={(id: string) =>
                                dispatch({ id: id, type: "REMOVE" })
                            }
                        />
                    ))}
                </div>
                <AddTodo
                    add={(title: string) =>
                        dispatch({ type: "ADD", title: title })
                    }
                />
            </div>
        </>
    );
};
