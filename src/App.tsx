import React from 'react'

import { useObservable } from 'hooks'
import { timerService } from 'services'

const timer$ = timerService.observable()

const App = () => {
    const time = useObservable(timer$)

    return (
        <div className="app">
            <div className="container">
                <div className="timer">{time}</div>
                <div className="buttons">
                    <button className="start" onClick={timerService.start}>Start</button>
                    <button className="stop" onClick={timerService.stop}>Stop</button>
                    <button className="wait" onClick={timerService.wait}>Wait</button>
                    <button className="reset" onClick={timerService.reset}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default App
