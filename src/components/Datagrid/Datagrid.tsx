import { StudentReport, genReports } from "./data";
import "./Datagrid.css";
import * as R from "remeda";
import { useImmer, useImmerReducer } from "use-immer";

const reports = R.pipe(
    R.range(0, 25),
    R.map(() => genReports())
);

const getKeys = <T extends object>(obj: T) => {
    return Object.keys(obj);
};

type order = "desc" | "asc";
type GridDataType = Record<string, string | number | boolean>;
type GridState<T extends GridDataType> = {
    filtered: T[];
    original: T[];
};
type THeadState = {
    ordering: order;
    search: { toggle: boolean; text: string };
};
type Payload<K> =
    | { action: "search"; of: keyof K; by: string }
    | { action: "sort"; of: keyof K; by: order };

function Reducer<T extends GridDataType>(
    state: GridState<T>,
    payload: Payload<T>
) {
    switch (payload.action) {
        case "search": {
            console.log(payload);
            state.filtered = state.original.filter(p =>
                p[payload.of]
                    .toString()
                    .toLocaleLowerCase()
                    .includes(payload.by.toLocaleLowerCase())
            );
            break;
        }
        case "sort": {
            console.log(payload);
            state.filtered.sort((a, b) => {
                const x = a[payload.of];
                const y = b[payload.of];
                if (typeof x === "string") {
                    const _y = y.toString();
                    return payload.by === "asc"
                        ? x.localeCompare(y.toString())
                        : _y.localeCompare(x);
                } else if (typeof x === "number") {
                    const _y = Number(y);
                    return payload.by === "asc" ? x - _y : _y - x;
                }
                return -1;
            });

            break;
        }
    }
}

const THead = <R extends GridDataType>({
    title,
    dispatch,
}: {
    title: R[keyof R];
    dispatch: (p: Payload<R>) => void;
}) => {
    const [state, setState] = useImmer<THeadState>({
        ordering: "asc",
        search: { toggle: false, text: "" },
    });
    const searchIconClickHandler = () =>
        setState(draft => {
            draft.search.toggle = !draft.search.toggle;
        });
    const sortIconHandler = () => {
        const _t = state.ordering === "asc" ? "desc" : "asc";
        dispatch({
            action: "sort",
            of: title as keyof R,
            by: _t,
        });
        setState(draft => {
            draft.ordering = _t;
        });
    };

    const searchHandler = (text: string) => {
        setState(draft => {
            draft.search.text = text;
        });
        dispatch({
            action: "search",
            of: title as keyof R,
            by: text,
        });
    };

    return (
        <th className="border-1 mx-2 border-black bg-green-300 text-black">
            <span className="text-2xl">
                {title}
                <span className="ps-2 [&>i]:mx-2">
                    <i
                        onClick={searchIconClickHandler}
                        className="bi bi-search cursor-pointer"
                    ></i>
                    <i
                        className="bi bi-sort-down cursor-pointer"
                        onClick={sortIconHandler}
                    ></i>
                </span>
            </span>
            <div>
                <input
                    hidden={!state.search.toggle}
                    value={state.search.text}
                    onChange={ev => searchHandler(ev.target.value)}
                    type="text"
                    className="m-2 rounded-sm ps-1"
                    placeholder="search..."
                />
            </div>
        </th>
    );
};

const DataRow = <T extends string | number | boolean>({
    data,
}: {
    data: T[];
}) => {
    return (
        <tr>
            {data.map(d => (
                <td>{d}</td>
            ))}
        </tr>
    );
};

const initialState = { filtered: reports, original: reports };

export const Datagrid = () => {
    const [state, dispatch] = useImmerReducer(
        Reducer<StudentReport>,
        initialState
    );
    return (
        <div className="my-4 flex justify-center">
            <table className="table-auto">
                <thead>
                    <tr>
                        {getKeys(state.filtered.at(0)!).map(h => (
                            <THead key={h} title={h} dispatch={dispatch} />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {state.filtered.map(p => (
                        <DataRow key={p.id} data={Object.values(p)} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
