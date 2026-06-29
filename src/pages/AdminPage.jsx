import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ROLE_LABELS = { client: 'Client', specialist: 'Specialist', manager: 'Manager', admin: 'Admin' }

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
          {user.company    && <div className="admin-pending-dept">{user.company}</div>}
          {user.department && <div className="admin-pending-dept">Dept: {user.department}</div>}
          {user.position   && <div className="admin-pending-dept">{user.position}</div>}
          <div className="admin-pending-date">Applied {formatDate(user.registeredAt)}</div>
        </div>
      </div>
      <div className="admin-pending-actions">
        <button className="btn btn-success btn-sm" onClick={() => onApprove(user.id)}>✓ Approve</button>
        <button className="btn btn-danger btn-sm" onClick={() => onReject(user.id)}>✕ Reject</button>
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

  const totalClients     = allUsers.filter(u => u.role === 'client').length
  const totalSpecialists = allUsers.filter(u => u.role === 'specialist').length
  const totalManagers    = allUsers.filter(u => u.role === 'manager').length

  return (
    <div className="page-container">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">{allUsers.length} registered users · {pendingManagers.length} pending approval</p>
        </div>
        <div className="admin-header-badge">⚙ Administrator</div>
      </div>

      {/* Stat bar */}
      <div className="summary-bar" style={{ marginBottom: 36 }}>
        <div className="summary-chip">
          <span className="count">{allUsers.length}</span>
          <span className="label">Total</span>
        </div>
        <div className="summary-chip s-pending">
          <span className="count">{pendingManagers.length}</span>
          <span className="label">Pending</span>
        </div>
        <div className="summary-chip">
          <span className="count" style={{ color: 'var(--color-primary)' }}>{totalClients}</span>
          <span className="label">Clients</span>
        </div>
        <div className="summary-chip">
          <span className="count" style={{ color: '#a3e635' }}>{totalSpecialists}</span>
          <span className="label">Specialists</span>
        </div>
        <div className="summary-chip">
          <span className="count" style={{ color: '#fbbf24' }}>{totalManagers}</span>
          <span className="label">Managers</span>
        </div>
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
              <PendingManagerCard key={user.id} user={user} onApprove={approveManager} onReject={rejectManager} />
            ))}
          </div>
        )}
      </section>

      {/* All users */}
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">All Users</h2>
          <div className="admin-role-filter">
            {['all', 'client', 'specialist', 'manager'].map(r => (
              <button key={r} className={`admin-filter-btn${filterRole === r ? ' active' : ''}`} onClick={() => setFilterRole(r)}>
                {r === 'all' ? 'All' : ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
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
                      <span className={`admin-role-badge admin-role-badge--${user.role}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-pill-${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="admin-detail-cell">
                      {user.department && <span>Dept: {user.department}</span>}
                      {user.specialty  && <span>{user.specialty}</span>}
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
                        >
                          {confirmDelete === user.id ? '⚠ Confirm' : 'Delete'}
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
