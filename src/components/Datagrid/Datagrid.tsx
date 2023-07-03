import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { StudentReport, genReports } from "./data";
import * as R from "remeda";
import { useImmer, useImmerReducer } from "use-immer";
import invariant from "tiny-invariant";
import { useRef } from "react";
import "./Datagrid.css";

/* types */
type order = "desc" | "asc";
type GridDataType = Record<string, string | number | boolean> & {
    id: number | string;
};
type PageProps = { current: number; total: number; perpage: number };
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
/* END */

/* utility */
const getKeys = <T extends GridDataType>(data: T[]): (keyof T)[] => {
    const first = data.at(0);
    invariant(first);
    return Object.keys(first);
};
/* END */

function Reducer<T extends GridDataType>(
    state: GridState<T>,
    payload: Payload<T>
) {
    console.log(payload);
    switch (payload.action) {
        case "search": {
            state.filtered = state.original.filter(p =>
                p[payload.of]
                    .toString()
                    .toLocaleLowerCase()
                    .includes(payload.by.toLocaleLowerCase())
            );
            break;
        }
        case "sort": {
            state.filtered.sort((a, b) => {
                const x = a[payload.of];
                const y = b[payload.of];
                if (typeof x === "string") {
                    return payload.by === "asc"
                        ? x.localeCompare(String(y))
                        : String(y).localeCompare(x);
                } else if (typeof x === "number") {
                    return payload.by === "asc" ? x - Number(y) : Number(y) - x;
                } else if (typeof x === "boolean") {
                    return payload.by === "asc" ? (x ? 1 : -1) : y ? 1 : -1;
                } else {
                    return -1;
                }
            });

            break;
        }
    }
}

const THead = <T extends GridDataType>({
    title,
    dispatch,
}: {
    title: keyof T;
    dispatch: (p: Payload<T>) => void;
}) => {
    const [state, setState] = useImmer<THeadState>({
        ordering: "asc",
        search: { toggle: false, text: "" },
    });
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchIconClickHandler = () => {
        setState(draft => {
            draft.search.toggle = !draft.search.toggle;
        });
        setTimeout(() => searchInputRef.current!.focus(), 100);
    };
    const sortIconHandler = () => {
        const _t = state.ordering === "asc" ? "desc" : "asc";
        dispatch({
            action: "sort",
            of: title as keyof T,
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
            of: title as keyof T,
            by: text,
        });
    };

    return (
        <th className="border-1 mx-2 border-black bg-green-300 text-black">
            <span className="text-2xl">
                {title as string}
                <span className="ps-2 [&>i]:mx-2">
                    <i
                        onClick={searchIconClickHandler}
                        className="bi bi-search cursor-pointer"
                    ></i>
                    <i
                        className={clsx(
                            "bi cursor-pointer",
                            state.ordering === "asc"
                                ? "bi-sort-down"
                                : "bi-sort-up"
                        )}
                        onClick={sortIconHandler}
                    ></i>
                </span>
            </span>
            <div>
                <input
                    value={state.search.text}
                    onChange={ev => searchHandler(ev.target.value)}
                    type="text"
                    ref={searchInputRef}
                    className={clsx(
                        "m-2 rounded-sm ps-1",
                        !state.search.toggle && "hidden"
                    )}
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
                <td key={d as string}>{d}</td>
            ))}
        </tr>
    );
};

const DatagridView = <T extends GridDataType>({
    data,
    dispatch,
    pageprops,
}: {
    data: T[];
    dispatch: (p: Payload<T>) => void;
    pageprops: PageProps;
}) => {
    const sliceStop = pageprops.current * pageprops.perpage;
    const sliceStart = sliceStop - pageprops.perpage;
    console.log(sliceStart, sliceStop);
    return (
        <div className="my-4 flex justify-center">
            <table className="table-auto">
                <thead>
                    <tr>
                        {getKeys(data).map(h => (
                            <THead
                                key={h as string}
                                title={h}
                                dispatch={dispatch}
                            />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.slice(sliceStart, sliceStop).map(p => (
                        <DataRow key={p.id} data={Object.values(p)} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const reports = R.pipe(
    R.range(0, 98),
    R.map(() => genReports())
);
const initialState = { filtered: reports, original: reports };

const Pagination = ({
    pageprops,
    setPage,
}: {
    pageprops: PageProps;
    setPage: (i: number) => void;
}) => {
    return (
        <div className="flex justify-center gap-2 py-2 text-2xl">
            {R.pipe(
                R.range(1, Math.ceil(pageprops.total / pageprops.perpage) + 1),
                R.map(i => (
                    <a
                        className={clsx(
                            "cursor-pointer",
                            pageprops.current === i &&
                                "text-orange-500 underline"
                        )}
                        onClick={() => setPage(i)}
                    >
                        {i}
                    </a>
                ))
            )}
        </div>
    );
};

export const Datagrid = () => {
    const [state, dispatch] = useImmerReducer(
        Reducer<StudentReport>,
        initialState
    );
    const [searchParams, setSearchParams] = useSearchParams({
        page: "1",
    });
    const setPage = (i: number) => setSearchParams({ page: String(i) });
    const page = searchParams.get("page") ?? "1";
    const n_perpage = "5";
    const pp = {
        current: Number(page),
        perpage: Number(n_perpage),
        total: state.filtered.length,
    };
    return (
        <div>
            <DatagridView
                pageprops={pp}
                data={state.filtered}
                dispatch={dispatch}
            />
            <Pagination pageprops={pp} setPage={setPage} />
        </div>
    );
};
