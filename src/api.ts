interface CheckInRecord {
  date: string
  time: string
  amount: number
}

const API_BASE_URL = '/api'
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

let pendingRecords: { [key: string]: CheckInRecord[] } = {}

async function retryFetch(url: string, options?: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, options)
    if (response.ok) return response
    throw new Error('Request failed')
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return retryFetch(url, options, retries - 1)
    }
    throw error
  }
}

async function syncPendingRecords(userId: string): Promise<void> {
  const pendingKey = `pendingRecords_${userId}`
  const pendingData = localStorage.getItem(pendingKey)
  
  if (pendingData) {
    try {
      const records = JSON.parse(pendingData)
      await retryFetch(`${API_BASE_URL}/users/${userId}/records`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(records),
      })
      localStorage.removeItem(pendingKey)
    } catch (error) {
      console.error('Failed to sync pending records:', error)
    }
  }
}

export async function saveCheckInRecords(userId: string, records: CheckInRecord[]): Promise<void> {
  try {
    await retryFetch(`${API_BASE_URL}/users/${userId}/records`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(records),
    })
    
    localStorage.setItem(`checkInRecords_${userId}`, JSON.stringify(records))
    // 清除待同步数据
    localStorage.removeItem(`pendingRecords_${userId}`)
  } catch (error) {
    console.error('Error saving records:', error)
    // 存储到待同步队列
    localStorage.setItem(`pendingRecords_${userId}`, JSON.stringify(records))
    // 保存到本地缓存
    localStorage.setItem(`checkInRecords_${userId}`, JSON.stringify(records))
  }
}

export async function getCheckInRecords(userId: string): Promise<CheckInRecord[]> {
  try {
    // 尝试同步待同步的数据
    await syncPendingRecords(userId)
    
    const response = await retryFetch(`${API_BASE_URL}/users/${userId}/records`)
    const records = await response.json()
    localStorage.setItem(`checkInRecords_${userId}`, JSON.stringify(records))
    return records
  } catch (error) {
    console.error('Error fetching records:', error)
    const savedRecords = localStorage.getItem(`checkInRecords_${userId}`)
    return savedRecords ? JSON.parse(savedRecords) : []
  }
}

// 添加网络状态监听，在重新联网时尝试同步数据
window.addEventListener('online', () => {
  const userIds = Object.keys(pendingRecords)
  userIds.forEach(userId => syncPendingRecords(userId))
})