import { useState, useEffect } from 'react'

interface UserSelectProps {
  onUserSelect: (userId: string) => void
  selectedUserId: string
}

export default function UserSelect({ onUserSelect, selectedUserId }: UserSelectProps) {
  const [users, setUsers] = useState<string[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{type: 'reset' | 'delete', user: string} | null>(null)

  useEffect(() => {
    const savedUsers = localStorage.getItem('users')
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }
  }, [])

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const updatedUsers = [...users, newUserName.trim()]
      setUsers(updatedUsers)
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      onUserSelect(newUserName.trim())
      setNewUserName('')
      setShowAddUser(false)
    }
  }

  const handleReset = (user: string) => {
    setConfirmAction({ type: 'reset', user })
    setShowConfirmDialog(true)
  }

  const handleDelete = (user: string) => {
    setConfirmAction({ type: 'delete', user })
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    if (!confirmAction) return

    const { type, user } = confirmAction
    if (type === 'reset') {
      localStorage.removeItem(`checkInRecords_${user}`)
      if (selectedUserId === user) {
        onUserSelect(user) // 触发重新加载数据
      }
    } else if (type === 'delete') {
      const updatedUsers = users.filter(u => u !== user)
      setUsers(updatedUsers)
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      localStorage.removeItem(`checkInRecords_${user}`)
      if (selectedUserId === user) {
        onUserSelect('') // 清除选中的用户
      }
    }

    setShowConfirmDialog(false)
    setConfirmAction(null)
  }

  return (
    <div className="user-select">
      <div className="user-list">
        {users.map((user) => (
          <div key={user} className="user-item">
            <button
              className={`user-button ${selectedUserId === user ? 'selected' : ''}`}
              onClick={() => onUserSelect(user)}
            >
              {user}
            </button>
            {selectedUserId === user && (
              <div className="user-actions">
                <button
                  className="reset-button"
                  onClick={() => handleReset(user)}
                >
                  重置
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(user)}
                >
                  删除
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          className="add-user-button"
          onClick={() => setShowAddUser(true)}
        >
          + 添加用户
        </button>
      </div>

      {showAddUser && (
        <div className="add-user-modal">
          <div className="modal-content">
            <h3>添加新用户</h3>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="输入用户名"
              className="user-input"
            />
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowAddUser(false)}
              >
                取消
              </button>
              <button
                className="confirm-button"
                onClick={handleAddUser}
                disabled={!newUserName.trim()}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDialog && confirmAction && (
        <div className="confirm-dialog">
          <div className="modal-content">
            <h3>{confirmAction.type === 'reset' ? '重置确认' : '删除确认'}</h3>
            <p>
              {confirmAction.type === 'reset'
                ? `确定要重置用户 "${confirmAction.user}" 的所有打卡记录吗？此操作不可恢复。`
                : `确定要删除用户 "${confirmAction.user}" 吗？所有相关数据将被永久删除。`}
            </p>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => {
                  setShowConfirmDialog(false)
                  setConfirmAction(null)
                }}
              >
                取消
              </button>
              <button
                className="confirm-button danger"
                onClick={handleConfirm}
              >
                确认{confirmAction.type === 'reset' ? '重置' : '删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}