import { useState } from 'react'
import { useTask } from '../context/TaskContext'
import { useAuth } from '../context/AuthContext'
import TaskForm from '../components/TaskForm'
import TaskCard from '../components/TaskCard'

export default function UserPage() {
  const { tasks, addTask } = useTask()
  const { currentUser } = useAuth()
  const [showSuccess, setShowSuccess] = useState(false)

  function handleSubmit({ title, description, price }) {
    addTask(title, description, price, currentUser.name)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3500)
  }

  const myTasks    = tasks.filter(t => t.submittedBy === currentUser.name)
  const otherTasks = tasks.filter(t => t.submittedBy !== currentUser.name)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Submit an IT Request</h1>
        <p className="page-subtitle">Describe your problem and set a budget — a manager will review it shortly.</p>
      </div>

      <div className="form-card">
        {showSuccess && (
          <div className="success-banner">
            Your request has been submitted and is awaiting manager review.
          </div>
        )}
        <TaskForm onSubmit={handleSubmit} submitLabel="Submit Request" />
      </div>

      <div className="user-history">
        <div className="section-header">
          <h2 className="section-title">My Requests</h2>
          <span className="section-count">{myTasks.length}</span>
        </div>
        {myTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>You haven't submitted any requests yet.<br />Fill out the form above to get started.</p>
          </div>
        ) : (
          <div className="card-grid">
            {[...myTasks].reverse().map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        )}
      </div>

      {otherTasks.length > 0 && (
        <div className="user-history">
          <div className="section-header">
            <h2 className="section-title" style={{ color: 'var(--color-text-muted)' }}>Other Requests</h2>
            <span className="section-count">{otherTasks.length}</span>
          </div>
          <div className="card-grid">
            {[...otherTasks].reverse().map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        </div>
      )}
    </div>
  )
}
