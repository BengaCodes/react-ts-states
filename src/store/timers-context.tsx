import { createContext, ReactNode, useContext, useReducer } from 'react'

export type Timer = {
  name: string
  duration: number
}

type TimersState = {
  isRunning: boolean
  timers: Timer[]
}

type TimersContextValue = TimersState & {
  addTimer: (timerData: Timer) => void
  startTimers: () => void
  stopTimers: () => void
}

enum ActionTypes {
  start = 'START',
  stop = 'STOP',
  add = 'ADD'
}

type StartTimersAction = {
  type: ActionTypes.start
}

type StopTimersAction = {
  type: ActionTypes.stop
}

type AddTimersAction = {
  type: ActionTypes.add
  payload: Timer
}

type Actions = StartTimersAction | StopTimersAction | AddTimersAction

export const TimersContext = createContext<TimersContextValue | null>(null)

export function useTimersContext() {
  const timersCtx = useContext(TimersContext)

  if (timersCtx === null) {
    throw new Error('TimersContext is null - that should not be the case!')
  }
  return timersCtx
}

type TimersContextProviderProps = {
  children: ReactNode
}

const initialState: TimersState = {
  timers: [],
  isRunning: true
}

function timersReducer(state: TimersState, action: Actions) {
  switch (action?.type) {
    case ActionTypes.start:
      return {
        ...state,
        isRunning: true
      }
    case ActionTypes.stop:
      return {
        ...state,
        isRunning: false
      }
    case ActionTypes.add:
      return {
        ...state,
        timers: [...state?.timers, action?.payload]
      }
    default:
      return state
  }
}

function TimersContextProvider({ children }: TimersContextProviderProps) {
  const [timersState, dispatch] = useReducer(timersReducer, initialState)

  const ctx: TimersContextValue = {
    timers: timersState?.timers,
    isRunning: timersState?.isRunning,
    addTimer: (timerData: Timer) => {
      dispatch({ type: ActionTypes.add, payload: timerData })
    },
    startTimers: () => {
      dispatch({ type: ActionTypes.start })
    },
    stopTimers: () => {
      dispatch({ type: ActionTypes.stop })
    }
  }

  return <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
}

export default TimersContextProvider
