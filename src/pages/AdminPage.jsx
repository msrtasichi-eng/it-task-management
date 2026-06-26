import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ROLE_LABELS = { client: 'Client', specialist: 'Specialist', manager: 'Manager', admin: 'Admin' }
const STATUS_STYLES = {
  active:   { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' },
  pending:  { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' },
  rejected: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function PendingManagerCard({ user, onApprove, onReject }) {
  return (
    <div className="admin-pending-card">
      <div className="admin-pending-info">
        <div className="admin-pending-avatar">{user.name[0].toUpperCase()}</div>
        <div>
          <div className="admin-pending-name">{user.name}</div>
          <div className="admin-pending-email">{user.email}</div>
          {user.department && (
            <div className="admin-pending-dept">Dept: {user.department}</div>
          )}
          <div className="admin-pending-date">Registered {formatDate(user.registeredAt)}</div>
        </div>
      </div>
      <div className="admin-pending-actions">
        <button className="btn btn-success btn-sm" onClick={() => onApprove(user.id)}>
          ✓ Approve
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onReject(user.id)}>
          ✕ Reject
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { allUsers, pendingManagers, approveManager, rejectManager, deleteUser } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filterRole, setFilterRole] = useState('all')

  const filtered = filterRole === 'all'
    ? allUsers
    : allUsers.filter(u => u.role === filterRole)

  function handleDelete(id) {
    if (confirmDelete === id) {
      deleteUser(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
    }
  }

  return (
    <div className="page-container">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">{allUsers.length} registered users · {pendingManagers.length} pending approval</p>
        </div>
        <div className="admin-header-badge">&#128737; Administrator</div>
      </div>

      {/* Pending managers */}
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">Pending Manager Approvals</h2>
          {pendingManagers.length > 0 && (
            <span className="section-count urgent">{pendingManagers.length}</span>
          )}
        </div>

        {pendingManagers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <p>No pending approvals — all manager requests have been reviewed.</p>
          </div>
        ) : (
          <div className="admin-pending-list">
            {pendingManagers.map(user => (
              <PendingManagerCard
                key={user.id}
                user={user}
                onApprove={approveManager}
                onReject={rejectManager}
              />
            ))}
          </div>
        )}
      </section>

      {/* All users */}
      <section className="admin-section">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <h2 className="section-title">All Users</h2>
          <div className="admin-role-filter">
            {['all', 'client', 'specialist', 'manager'].map(r => (
              <button
                key={r}
                className={`admin-filter-btn${filterRole === r ? ' active' : ''}`}
                onClick={() => setFilterRole(r)}
              >
                {r === 'all' ? 'All' : ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No users found for this filter.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th>Registered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar">{user.name[0].toUpperCase()}</div>
                        <div>
                          <div className="admin-user-name">{user.name}</div>
                          <div className="admin-user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-role-badge admin-role-badge--{user.role}">
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill" style={STATUS_STYLES[user.status]}>
                        {user.status}
                      </span>
                    </td>
                    <td className="admin-detail-cell">
                      {user.department && <span>Dept: {user.department}</span>}
                      {user.specialty && <span>Specialty: {user.specialty}</span>}
                      {user.approvedBy && <span>Approved by {user.approvedBy}</span>}
                    </td>
                    <td className="admin-date-cell">{formatDate(user.registeredAt)}</td>
                    <td>
                      {user.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-success btn-sm" onClick={() => approveManager(user.id)}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => rejectManager(user.id)}>Reject</button>
                        </div>
                      )}
                      {user.status !== 'pending' && (
                        <button
                          className={`btn btn-sm ${confirmDelete === user.id ? 'btn-danger' : 'btn-ghost'}`}
                          onClick={() => handleDelete(user.id)}
                          title={confirmDelete === user.id ? 'Click again to confirm' : 'Delete user'}
                        >
                          {confirmDelete === user.id ? 'Confirm delete' : 'Delete'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
