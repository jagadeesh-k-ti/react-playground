import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Todo = { userId: number; id: number; title: string; completed: boolean };

const getTodos = async () => {
    return axios
        .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
        .then(res => res.data);
};

export const TodoQueryComponent = () => {
    const query = useQuery({
        queryKey: ["todos"],
        queryFn: getTodos,
    });
    return (
        <>
            <span>Hello from Query</span>
            {query.data?.map(t => (
                <div>
                    {t.title} | {t.completed.toString()}
                </div>
            ))}
        </>
    );
};
