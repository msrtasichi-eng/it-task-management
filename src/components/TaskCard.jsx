import { useState } from 'react'

const STATUS_LABELS = {
  pending: 'Pending Review',
  approved: 'In Pool',
  in_progress: 'In Progress',
  done: 'Done',
}

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatPrice(price) {
  return '$' + Number(price).toFixed(2)
}

export default function TaskCard({ task, actions }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = task.description.length > 150

  return (
    <div className="task-card">
      <div className={`task-card-accent ${task.status}`} />

      <div className="task-card-body">
        <div className="task-card-header">
          <span className="task-card-title">{task.title}</span>
          <span className="task-price">{formatPrice(task.price)}</span>
        </div>

        <div>
          <p className={`task-description${isLong && !expanded ? ' truncated' : ''}`}>
            {task.description}
          </p>
          {isLong && (
            <button className="expand-btn" onClick={() => setExpanded(v => !v)}>
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="tag-list">
            {task.tags.map(tag => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>
        )}

        <div>
          <span className={`status-badge status-${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </div>

        <div className="task-meta">
          {task.submittedBy && (
            <span className="task-meta-item">&#128100; {task.submittedBy}</span>
          )}
          <span className="task-meta-item">&#128337; {formatDate(task.submittedAt)}</span>
          {task.approvedAt && <span className="task-meta-item">&#10003; Approved {formatDate(task.approvedAt)}</span>}
          {task.claimedBy  && <span className="task-meta-item">&#9874; {task.claimedBy}</span>}
          {task.doneAt     && <span className="task-meta-item">&#127881; Done {formatDate(task.doneAt)}</span>}
        </div>
      </div>

      {actions && <div className="task-actions">{actions}</div>}
    </div>
  )
}
