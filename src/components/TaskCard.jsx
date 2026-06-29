import { useState } from 'react'

const STATUS_LABELS = {
  pending:     'Pending Review',
  approved:    'In Pool',
  in_progress: 'In Progress',
  done:        'Done',
  rejected:    'Rejected',
}

const TIMELINE_STEPS = [
  { key: 'pending',     label: 'Submitted' },
  { key: 'approved',    label: 'Approved' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done',        label: 'Done' },
]
const STATUS_ORDER = { pending: 0, approved: 1, in_progress: 2, done: 3 }

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
  const currentStep = STATUS_ORDER[task.status] ?? -1
  const isRejected = task.status === 'rejected'

  return (
    <div className={`task-card${isRejected ? ' task-card-rejected' : ''}`}>
      <div className={`task-card-accent ${task.status}`} />

      <div className="task-card-body">
        {/* Header */}
        <div className="task-card-header">
          <span className="task-card-title">{task.title}</span>
          <span className={`task-price${Number(task.price) >= 500 ? ' task-price-high' : ''}`}>
            {formatPrice(task.price)}
          </span>
        </div>

        {/* Submitter */}
        <div className="task-card-submitter">
          <span className="task-avatar-sm">{(task.submittedBy || 'A')[0].toUpperCase()}</span>
          <span className="task-submitter-name">{task.submittedBy || 'Anonymous'}</span>
          <span className="task-submitter-dot">·</span>
          <span className="task-submitter-date">{formatDate(task.submittedAt)}</span>
        </div>

        {/* Description */}
        <div>
          <p className={`task-description${isLong && !expanded ? ' truncated' : ''}`}>
            {task.description}
          </p>
          {isLong && (
            <button className="expand-btn" onClick={() => setExpanded(v => !v)}>
              {expanded ? 'Show less ↑' : 'Show more ↓'}
            </button>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="tag-list">
            {task.tags.map(tag => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>
        )}

        {/* Status badge + rejection reason */}
        <div className="task-status-row">
          <span className={`status-badge status-${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
          {task.claimedBy && (
            <span className="task-claimed-by">⚙ {task.claimedBy}</span>
          )}
          {task.doneAt && (
            <span className="task-done-at">✓ Done {formatDate(task.doneAt)}</span>
          )}
        </div>
        {task.rejectionReason && (
          <p className="rejection-reason">&#8220;{task.rejectionReason}&#8221;</p>
        )}

        {/* Timeline (not shown for rejected) */}
        {!isRejected && (
          <div className="task-timeline">
            {TIMELINE_STEPS.map((step, i) => {
              const done = currentStep >= i
              const active = currentStep === i
              return (
                <div key={step.key} className={`tl-step${done ? ' done' : ''}${active ? ' active' : ''}`}>
                  <div className="tl-dot" />
                  {i < TIMELINE_STEPS.length - 1 && <div className={`tl-line${done && currentStep > i ? ' done' : ''}`} />}
                  <div className="tl-label">{step.label}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {actions && <div className="task-actions">{actions}</div>}
    </div>
  )
}
