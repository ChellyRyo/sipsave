import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface CheckInRecord {
  date: string
  time: string
  amount: number
}

interface HistoryProps {
  userId: string
}

export default function History({ userId }: HistoryProps) {
  const navigate = useNavigate()
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([])
  const [totalSavings, setTotalSavings] = useState(0)

  useEffect(() => {
    const savedRecords = localStorage.getItem(`checkInRecords_${userId}`)
    if (savedRecords) {
      const records = JSON.parse(savedRecords)
      setCheckInRecords(records)
      const total = records.reduce((sum: number, record: CheckInRecord) => sum + record.amount, 0)
      setTotalSavings(total)
    }
  }, [userId])

  return (
    <div className="history-page">
      <header className="history-header">
        <button className="back-button" onClick={() => navigate('/')}>
          Back
        </button>
        <h1>History</h1>
      </header>

      <div className="savings-summary">
        <div className="total-amount">
          <span className="currency">¥</span>
          <span className="amount">{totalSavings.toFixed(2)}</span>
        </div>
        <div className="total-checkins">
          Total Check-ins: {checkInRecords.length}
        </div>
      </div>

      <div className="history-list">
        {checkInRecords.slice().reverse().map((record, index) => (
          <div key={index} className="history-item">
            <div className="history-date">{record.date}</div>
            <div className="history-time">{record.time}</div>
            <div className="history-amount">¥{record.amount.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}