import { useEffect, useRef, useState } from 'react'
import {
  useTimersContext,
  type Timer as TimerType
} from '../store/timers-context.tsx'
import Container from './UI/Container.tsx'

type TimerProps = TimerType

export default function Timer({ name, duration }: TimerProps) {
  const [remainingTime, setRemainingTime] = useState(duration * 1000)
  const interval = useRef<number | null>(null)

  const { isRunning } = useTimersContext()

  console.log({ isRunning })

  if (remainingTime <= 0 && interval?.current) {
    clearInterval(interval?.current)
  }

  useEffect(() => {
    let timer: number
    if (isRunning) {
      timer = setInterval(() => {
        setRemainingTime((prevState) => {
          if (prevState <= 0) {
            return prevState
          }
          return prevState - 50
        })
      }, 50)
      interval.current = timer
    } else if (interval.current) {
      clearInterval(interval.current)
    }

    return () => clearInterval(timer)
  }, [remainingTime, interval, isRunning])

  const formatRemainingTime = (remainingTime / 1000).toFixed(2)

  return (
    <Container as='article'>
      <h2>{name}</h2>
      <p>
        <progress max={duration * 1000} value={remainingTime} />
      </p>
      <p>{formatRemainingTime}</p>
    </Container>
  )
}
