import { TaskProvider } from './context/TaskContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import UserPage from './pages/UserPage'
import ManagerPage from './pages/ManagerPage'
import ProgrammerPage from './pages/ProgrammerPage'
import AdminPage from './pages/AdminPage'

const ROLE_LABELS = {
  client: 'Client',
  manager: 'Manager',
  specialist: 'Specialist',
  admin: 'Administrator',
}

const ROLE_CSS = {
  client: 'user',
  manager: 'manager',
  specialist: 'programmer',
  admin: 'admin',
}

function PendingApproval({ onLogout }) {
  return (
    <div className="auth-page">
      <div className="auth-card pending-notice-card">
        <div className="pending-icon">⏳</div>
        <h2>Awaiting Approval</h2>
        <p>
          Your manager account is under review by an administrator.
          You will gain access once approved.
        </p>
        <button className="btn btn-ghost" style={{ marginTop: 24, borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }} onClick={onLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}

function RejectedAccount({ onLogout }) {
  return (
    <div className="auth-page">
      <div className="auth-card pending-notice-card">
        <div className="pending-icon" style={{ filter: 'grayscale(1)' }}>❌</div>
        <h2>Access Denied</h2>
        <p>Your manager registration was not approved. Please contact an administrator.</p>
        <button className="btn btn-ghost" style={{ marginTop: 24, borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }} onClick={onLogout}>
          Sign out
        </button>
      </div>
    </div>
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
      <div className="top-bar">
        <span className="top-bar-brand">IT Task Management</span>
        <div className="top-bar-right">
          <span className="top-bar-user">&#128100; {currentUser.name}</span>
          <span className={`role-badge ${ROLE_CSS[role]}`}>{ROLE_LABELS[role]}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
        </div>
      </div>
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
