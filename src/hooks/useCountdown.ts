import { useState, useEffect } from 'react'

export const useCountdown = (targetDate: string) => {
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const distance = target - now

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        clearInterval(interval)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds, isExpired: false })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return countdown
}

export const formatCountdown = (days: number, hours: number, minutes: number, seconds: number): string => {
  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m ${seconds}s`
}

export const getCountdownColor = (days: number, hours: number): string => {
  const totalHours = days * 24 + hours
  if (totalHours < 24) return 'bg-red-100 text-red-800 border-red-300'
  if (totalHours < 72) return 'bg-amber-100 text-amber-800 border-amber-300'
  return 'bg-blue-100 text-blue-800 border-blue-300'
}
