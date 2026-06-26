import { createContext, useContext, useState, useEffect } from 'react'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('it_tasks') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('it_tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(title, description, price, submittedBy = 'Anonymous') {
    setTasks(prev => [...prev, {
      id: crypto.randomUUID(),
      title,
      description,
      price: Number(price),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      claimedAt: null,
      doneAt: null,
      claimedBy: null,
      submittedBy,
      tags: [],
    }])
  }

  function updateTask(id, patches) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patches } : t))
  }

  function approveTask(id) {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'approved', approvedAt: new Date().toISOString() } : t
    ))
  }

  function claimTask(id, programmerName) {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'in_progress', claimedBy: programmerName, claimedAt: new Date().toISOString() } : t
    ))
  }

  function markDone(id) {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'done', doneAt: new Date().toISOString() } : t
    ))
  }

  const pendingTasks    = tasks.filter(t => t.status === 'pending')
  const poolTasks       = tasks.filter(t => t.status === 'approved')
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress')
  const doneTasks       = tasks.filter(t => t.status === 'done')

  return (
    <TaskContext.Provider value={{
      tasks, addTask, updateTask, approveTask, claimTask, markDone,
      pendingTasks, poolTasks, inProgressTasks, doneTasks,
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTask must be used inside TaskProvider')
  return ctx
}
