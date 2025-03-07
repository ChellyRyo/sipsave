import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import History from './components/History'
import UserSelect from './components/UserSelect'

interface CheckInRecord {
  date: string
  time: string
  amount: number
}

interface MainAppProps {
  currentUserId: string
  setCurrentUserId: (userId: string) => void
}

function MainApp({ currentUserId, setCurrentUserId }: MainAppProps) {
  const navigate = useNavigate()
  const [selectedUserId, setSelectedUserId] = useState(currentUserId)
  const [totalSavings, setTotalSavings] = useState(0)
  const [totalCups, setTotalCups] = useState(0)
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([])

  useEffect(() => {
    if (selectedUserId) {
      const savedRecords = localStorage.getItem(`checkInRecords_${selectedUserId}`)
      if (savedRecords) {
        const records = JSON.parse(savedRecords)
        setCheckInRecords(records)
        updateStatistics(records)
      } else {
        setCheckInRecords([])
        setTotalSavings(0)
        setTotalCups(0)
      }
    }
  }, [selectedUserId])

  const updateStatistics = (records: CheckInRecord[]) => {
    const total = records.reduce((sum, record) => sum + record.amount, 0)
    setTotalSavings(total)
    setTotalCups(records.length)
  }

  const handleCheckIn = () => {
    if (!selectedUserId) {
      alert('请先选择用户')
      return
    }
    const now = new Date()
    const dateStr = now.toLocaleDateString()
    const timeStr = now.toLocaleTimeString()
    const amount = 19.8
    const newRecord = { date: dateStr, time: timeStr, amount }
    const updatedRecords = [...checkInRecords, newRecord]

    // 更新数据
    setCheckInRecords(updatedRecords)
    localStorage.setItem(`checkInRecords_${selectedUserId}`, JSON.stringify(updatedRecords))
    updateStatistics(updatedRecords)
  }

  return (
    <div className="app-container">
      <header className="header">
        <UserSelect onUserSelect={setSelectedUserId} selectedUserId={selectedUserId} />
        <h1 className="brand">SipSave</h1>
        <div className="tagline-container">
          <p className="tagline-en">Save while you sip</p>
          <p className="tagline-cn">每一口都是一份储蓄</p>
        </div>
        <div className="savings-display">
          <div className="savings-info">
            <span className="currency">¥</span>
            <span className="amount">{totalSavings.toFixed(2)}</span>
            <span className="label">Total Savings</span>
          </div>
          <div className="cups-info">
            <span className="cups-count">{totalCups}</span>
            <span className="label">Cups of Coffee</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="check-in-section">
          <button 
            className="check-in-button" 
            onClick={handleCheckIn}
          >
            <span className="check-in-icon">☕</span>
            <span className="check-in-text">Check</span>
          </button>
          <button 
            className="history-button" 
            onClick={() => {
              setCurrentUserId(selectedUserId)
              navigate('/history')
            }}
          >
            History
          </button>
        </div>
      </main>
    </div>
  )
}

function App() {
  const [currentUserId, setCurrentUserId] = useState('')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp currentUserId={currentUserId} setCurrentUserId={setCurrentUserId} />} />
        <Route path="/history" element={<History userId={currentUserId} />} />
      </Routes>
    </Router>
  )
}

export default App
