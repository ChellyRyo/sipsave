interface CheckInRecord {
  date: string
  time: string
  amount: number
}

const API_BASE_URL = '/api'

export async function saveCheckInRecords(userId: string, records: CheckInRecord[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/records`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(records),
    })
    
    if (!response.ok) {
      throw new Error('Failed to save records')
    }

    // 同步成功后，更新本地缓存
    localStorage.setItem(`checkInRecords_${userId}`, JSON.stringify(records))
  } catch (error) {
    console.error('Error saving records:', error)
    // 如果API调用失败，回退到localStorage
    localStorage.setItem(`checkInRecords_${userId}`, JSON.stringify(records))
  }
}

export async function getCheckInRecords(userId: string): Promise<CheckInRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/records`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch records')
    }
    
    const records = await response.json()
    // 同步成功后，更新本地缓存
    localStorage.setItem(`checkInRecords_${userId}`, JSON.stringify(records))
    return records
  } catch (error) {
    console.error('Error fetching records:', error)
    // 如果API调用失败，从localStorage获取数据
    const savedRecords = localStorage.getItem(`checkInRecords_${userId}`)
    return savedRecords ? JSON.parse(savedRecords) : []
  }
}