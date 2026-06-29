import { useState } from 'react'
import { useTask } from '../context/TaskContext'
import { useAuth } from '../context/AuthContext'
import TaskForm from '../components/TaskForm'
import TaskCard from '../components/TaskCard'

function EditReviewCard({ task, onAccept, onReject }) {
  const e = task.pendingEdit
  const changed = []
  if (e.title !== task.title)
    changed.push({ field: 'Title', original: task.title, proposed: e.title })
  if (e.description !== task.description)
    changed.push({ field: 'Description', original: task.description, proposed: e.description })
  if (Number(e.price) !== Number(task.price))
    changed.push({ field: 'Price', original: `$${Number(task.price).toFixed(2)}`, proposed: `$${Number(e.price).toFixed(2)}` })

  return (
    <div className="edit-review-card">
      <div className="edit-review-header">
        <span className="edit-review-icon">&#9998;</span>
        <div>
          <div className="edit-review-title">Manager proposed changes to your request</div>
          <div className="edit-review-task-name">{task.title}</div>
        </div>
        <div className="edit-review-meta">by {e.editedBy}</div>
      </div>
      {changed.length > 0 ? (
        <table className="edit-diff-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Original</th>
              <th>Proposed</th>
            </tr>
          </thead>
          <tbody>
            {changed.map(({ field, original, proposed }) => (
              <tr key={field}>
                <td className="diff-field">{field}</td>
                <td className="diff-original">{original}</td>
                <td className="diff-proposed">{proposed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="edit-review-no-changes">Only tags were updated — no text fields changed.</p>
      )}
      <div className="edit-review-actions">
        <button className="btn btn-success btn-sm" onClick={() => onAccept(task.id)}>Accept Changes</button>
        <button className="btn btn-danger-outline btn-sm" onClick={() => onReject(task.id)}>Reject Changes</button>
      </div>
    </div>
  )
}

export default function UserPage() {
  const { tasks, addTask, acceptEdit, rejectEdit } = useTask()
  const { currentUser } = useAuth()
  const [showSuccess, setShowSuccess] = useState(false)

  function handleSubmit({ title, description, price }) {
    addTask(title, description, price, currentUser.name)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3500)
  }

  const myTasks    = tasks.filter(t => t.submittedBy === currentUser.name)
  const otherTasks = tasks.filter(t => t.submittedBy !== currentUser.name)
  const pendingEdits = myTasks.filter(t => t.pendingEdit)

  const activeCount = myTasks.filter(t => t.status === 'in_progress').length
  const doneCount   = myTasks.filter(t => t.status === 'done').length

  return (
    <div className="page-container">
      <div className="page-welcome-banner">
        <div className="pwb-left">
          <div className="pwb-avatar">{(currentUser.name[0] || '?').toUpperCase()}</div>
          <div>
            <h1 className="pwb-greeting">Hello, {currentUser.name.split(' ')[0]} 👋</h1>
            <p className="pwb-sub">Submit your IT problem below — our team is ready to help.</p>
          </div>
        </div>
        <div className="pwb-stats">
          <div className="pwb-stat">
            <span className="pwb-stat-num">{myTasks.length}</span>
            <span className="pwb-stat-label">Total</span>
          </div>
          <div className="pwb-stat">
            <span className="pwb-stat-num" style={{ color: 'var(--color-primary)' }}>{activeCount}</span>
            <span className="pwb-stat-label">Active</span>
          </div>
          <div className="pwb-stat">
            <span className="pwb-stat-num" style={{ color: 'var(--color-success)' }}>{doneCount}</span>
            <span className="pwb-stat-label">Resolved</span>
          </div>
        </div>
      </div>

      <div className="form-card">
        {showSuccess && (
          <div className="success-banner">
            Your request has been submitted and is awaiting manager review.
          </div>
        )}
        <TaskForm onSubmit={handleSubmit} submitLabel="Submit Request" />
      </div>

      {pendingEdits.length > 0 && (
        <div className="edit-review-section">
          <div className="section-header">
            <h2 className="section-title" style={{ color: 'var(--color-primary)' }}>Manager Proposed Changes</h2>
            <span className="section-count" style={{ background: '#1a1200', color: 'var(--color-primary)', border: '1px solid #3a2800' }}>
              {pendingEdits.length}
            </span>
          </div>
          <p className="edit-review-intro">
            Review the changes below and decide whether to accept or reject them.
          </p>
          {pendingEdits.map(task => (
            <EditReviewCard
              key={task.id}
              task={task}
              onAccept={acceptEdit}
              onReject={rejectEdit}
            />
          ))}
        </div>
      )}

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
