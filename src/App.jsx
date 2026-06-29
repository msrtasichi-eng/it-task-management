import { TaskProvider } from './context/TaskContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import UserPage from './pages/UserPage'
import ManagerPage from './pages/ManagerPage'
import ProgrammerPage from './pages/ProgrammerPage'
import AdminPage from './pages/AdminPage'

const ROLE_META = {
  client:     { label: 'Client',        icon: '👤', css: 'user' },
  manager:    { label: 'Manager',       icon: '📋', css: 'manager' },
  specialist: { label: 'Specialist',    icon: '💻', css: 'programmer' },
  admin:      { label: 'Administrator', icon: '⚙️',  css: 'admin' },
}

function PendingApproval({ onLogout }) {
  return (
    <div className="auth-page-split status-only-page">
      <div className="status-notice-card">
        <div className="status-notice-icon pending">⏳</div>
        <h2>Under Review</h2>
        <p>Your manager account is being reviewed by an administrator. You'll receive access once approved.</p>
        <div className="status-notice-steps">
          <span className="sn-step done">✓ Registered</span>
          <span className="sn-step active">⏳ Admin review</span>
          <span className="sn-step">Access granted</span>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 28, borderColor: '#333', color: '#666' }} onClick={onLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}

function RejectedAccount({ onLogout }) {
  return (
    <div className="auth-page-split status-only-page">
      <div className="status-notice-card">
        <div className="status-notice-icon rejected">✕</div>
        <h2>Application Not Approved</h2>
        <p>Your manager registration was not approved by an administrator. Contact support for more information.</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 28, borderColor: '#333', color: '#666' }} onClick={onLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}

function TopBar({ user, onLogout }) {
  const meta = ROLE_META[user.role]
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="top-bar-logo">
          <svg width="22" height="22" viewBox="0 0 38 38" fill="none">
            <polygon points="19,2 34,10 34,28 19,36 4,28 4,10" stroke="#f5c518" strokeWidth="1.5" fill="rgba(245,197,24,0.07)" />
            <path d="M21 8l-8 13h7l-3 9 8-13h-7l3-9z" fill="#f5c518" />
          </svg>
        </div>
        <span className="top-bar-brand">ResolvIT</span>
        <span className="top-bar-divider" />
        <span className={`role-badge ${meta.css}`}>{meta.icon} {meta.label}</span>
      </div>

      <div className="top-bar-right">
        <div className="top-bar-user-info">
          <div className="top-bar-avatar">{initials}</div>
          <div className="top-bar-user-details">
            <span className="top-bar-user-name">{user.name}</span>
            <span className="top-bar-user-email">{user.email}</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm top-bar-signout" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </header>
  )
}

function AppShell() {
  const { currentUser, logout } = useAuth()
  if (!currentUser) return <AuthPage />
  const { role, status } = currentUser
  if (role === 'manager' && status === 'pending')  return <PendingApproval  onLogout={logout} />
  if (role === 'manager' && status === 'rejected') return <RejectedAccount  onLogout={logout} />
  const PageMap = { client: UserPage, manager: ManagerPage, specialist: ProgrammerPage, admin: AdminPage }
  const Page = PageMap[role]
  return (
    <>
      <TopBar user={currentUser} onLogout={logout} />
      <Page />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppShell />
      </TaskProvider>
    </AuthProvider>
  )
}
