import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const ADMIN_SEED = {
  id: 'admin-001',
  name: 'Administrator',
  email: 'admin@itsystem.com',
  password: 'admin123',
  role: 'admin',
  status: 'active',
  registeredAt: new Date(0).toISOString(),
  approvedAt: null,
  approvedBy: null,
  department: null,
  specialty: null,
}

function loadUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem('it_users') || '[]')
    return stored.find(u => u.id === 'admin-001') ? stored : [ADMIN_SEED, ...stored]
  } catch {
    return [ADMIN_SEED]
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers)

  // Minimal session: just store the user id
  const [sessionId, setSessionId] = useState(() => {
    return sessionStorage.getItem('it_session_id') || null
  })

  useEffect(() => {
    localStorage.setItem('it_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (sessionId) sessionStorage.setItem('it_session_id', sessionId)
    else sessionStorage.removeItem('it_session_id')
  }, [sessionId])

  // Always derive currentUser live from the users array so status changes propagate instantly
  const currentUser = sessionId ? (users.find(u => u.id === sessionId) || null) : null

  function register({ name, email, password, role, phone, company, jobTitle, contactMethod, itNeeds, specialty, experience, availability, portfolio, bio, department, position, teamSize, reason }) {
    if (users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }
    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      status: role === 'manager' ? 'pending' : 'active',
      registeredAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      phone:         phone         || null,
      company:       company       || null,
      jobTitle:      jobTitle      || null,
      contactMethod: contactMethod || null,
      itNeeds:       itNeeds       || null,
      specialty:     specialty     || null,
      experience:    experience    || null,
      availability:  availability  || null,
      portfolio:     portfolio     || null,
      bio:           bio           || null,
      department:    department    || null,
      position:      position      || null,
      teamSize:      teamSize      || null,
      reason:        reason        || null,
    }
    setUsers(prev => [...prev, user])
    return user
  }

  function login(email, password) {
    const user = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    )
    if (!user) throw new Error('Invalid email or password.')
    setSessionId(user.id)
    return user
  }

  function logout() { setSessionId(null) }

  function approveManager(id) {
    setUsers(prev => prev.map(u =>
      u.id === id
        ? { ...u, status: 'active', approvedAt: new Date().toISOString(), approvedBy: currentUser?.name }
        : u
    ))
  }

  function rejectManager(id) {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: 'rejected' } : u
    ))
  }

  function deleteUser(id) {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const pendingManagers = users.filter(u => u.role === 'manager' && u.status === 'pending')
  const allUsers = users.filter(u => u.role !== 'admin')

  return (
    <AuthContext.Provider value={{
      currentUser, users, allUsers, pendingManagers,
      register, login, logout, approveManager, rejectManager, deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
