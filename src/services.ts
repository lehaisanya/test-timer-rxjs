import { EMPTY, merge, of, Subject, timer } from "rxjs";
import {
    map,
    mapTo,
    mergeMap,
    scan,
    startWith,
    switchMap,
    throttleTime,
    timeInterval
} from "rxjs/operators";
import { formatTime } from "utils";

const DUBLE_CLICK = 300;

enum Actions {
    START,
    PAUSE,
    RESET,
}

const actionSubject$ = new Subject<Actions>();
const waitActionSubject$ = new Subject<Actions>();

const waitAction$ = waitActionSubject$.pipe(
    timeInterval(),
    mergeMap(({ value, interval }) =>
        interval <= DUBLE_CLICK ? of(value) : EMPTY
    ),
    throttleTime(DUBLE_CLICK)
);

const action$ = merge(actionSubject$, waitAction$);

const timer$ = action$.pipe(
    startWith(Actions.PAUSE),
    switchMap((action) => {
        switch (action) {
            case Actions.RESET:
                return of(-1);
            case Actions.START:
                return timer(1000, 1000).pipe(mapTo(1));
            case Actions.PAUSE:
                return of(0);
        }
    }),
    scan((time, inc) => {
        if (inc === 0) {
            return time
        } else if (inc > 0) {
            return time + 1
        } else {
            return 0
        }
    }),
    map(formatTime)
);

export const timerService = {
    observable: () => timer$,
    start: () => {
        actionSubject$.next(Actions.START);
    },
    stop: () => {
        actionSubject$.next(Actions.PAUSE);
        actionSubject$.next(Actions.RESET);
    },
    reset: () => {
        actionSubject$.next(Actions.RESET);
        actionSubject$.next(Actions.START);
    },
    wait: () => {
        waitActionSubject$.next(Actions.PAUSE);
    },
};
