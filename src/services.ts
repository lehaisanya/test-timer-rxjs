import { interval, of, Subject, merge } from "rxjs"
import {
    distinctUntilChanged, filter, map, mapTo, scan,
    startWith, switchMap, throttleTime, timeInterval
} from "rxjs/operators"

import { formatTime } from "utils"

const DUBLE_CLICK = 300

enum Actions {
    START,
    PAUSE,
    RESET
}

const action$ = new Subject<Actions>()
const wait$ = new Subject()

const doubleClick$ = wait$.pipe(
    timeInterval(),
    map(val => val.interval <= DUBLE_CLICK ? true : false, false),
    filter(click => click),
    throttleTime(DUBLE_CLICK),
    mapTo(Actions.PAUSE)
)

const timer$ = merge(
    action$,
    doubleClick$
).pipe(
    distinctUntilChanged(),
    switchMap(action => {
        switch (action) {
            case Actions.RESET: return of(-1)
            case Actions.START: return interval(1000).pipe(mapTo(1))
            case Actions.PAUSE: return of(0)
        }
    }),
    startWith(0),
    scan((time, inc) => inc < 0 ? 0 : time + inc),
    map(formatTime)
)

export const timerService = {
    observable: () => timer$,
    start: () => {
        action$.next(Actions.START)
    },
    stop: () => {
        action$.next(Actions.PAUSE)
        action$.next(Actions.RESET)
    },
    reset: () => {
        action$.next(Actions.RESET)
        action$.next(Actions.START)
    },
    wait: () => {
        wait$.next()
    }
}
