import { useState } from 'react'
import { useTask } from '../context/TaskContext'
import { useAuth } from '../context/AuthContext'
import TaskCard from '../components/TaskCard'
import Modal from '../components/Modal'
import TaskForm from '../components/TaskForm'
import TagInput from '../components/TagInput'

function CollapsibleSection({ title, count, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="manager-section">
      <div className="collapsible-header" onClick={() => setOpen(v => !v)}>
        <span className={`chevron ${open ? 'open' : ''}`}>&#9658;</span>
        <h2 className="section-title" style={{ margin: 0 }}>{title}</h2>
        <span className="summary-chip" style={{ marginLeft: 4 }}>
          <span className="count">{count}</span>
        </span>
      </div>
      {open && children}
    </div>
  )
}

export default function ManagerPage() {
  const { pendingTasks, poolTasks, inProgressTasks, doneTasks, rejectedTasks,
          proposeEdit, approveTask, rejectTask, dismissDecision } = useTask()
  const { currentUser } = useAuth()
  const [editingTask, setEditingTask] = useState(null)
  const [editTags, setEditTags] = useState([])
  // rejectingId -> tracks which task has the reject reason input open
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  function openEdit(task) {
    setEditingTask(task)
    setEditTags(task.tags || [])
  }

  function closeEdit() {
    setEditingTask(null)
    setEditTags([])
  }

  function handleSaveEdit({ title, description, price }) {
    proposeEdit(editingTask.id, { title, description, price, tags: editTags }, currentUser.name)
    closeEdit()
  }

  function openReject(id) {
    setRejectingId(id)
    setRejectReason('')
  }

  function cancelReject() {
    setRejectingId(null)
    setRejectReason('')
  }

  function confirmReject(id) {
    rejectTask(id, rejectReason.trim())
    setRejectingId(null)
    setRejectReason('')
  }

  return (
    <div className="page-container">
      <div className="page-welcome-banner">
        <div className="pwb-left">
          <div className="pwb-avatar mgr">{(currentUser.name[0] || 'M').toUpperCase()}</div>
          <div>
            <h1 className="pwb-greeting">Manager Dashboard 📋</h1>
            <p className="pwb-sub">Review incoming requests, adjust details, and route tasks to specialists.</p>
          </div>
        </div>
        <div className="pwb-stats">
          <div className="pwb-stat">
            <span className="pwb-stat-num" style={{ color: 'var(--color-primary)' }}>{pendingTasks.length}</span>
            <span className="pwb-stat-label">Pending</span>
          </div>
          <div className="pwb-stat">
            <span className="pwb-stat-num" style={{ color: '#60a5fa' }}>{poolTasks.length}</span>
            <span className="pwb-stat-label">In Pool</span>
          </div>
          <div className="pwb-stat">
            <span className="pwb-stat-num" style={{ color: '#a78bfa' }}>{inProgressTasks.length}</span>
            <span className="pwb-stat-label">Active</span>
          </div>
          <div className="pwb-stat">
            <span className="pwb-stat-num" style={{ color: 'var(--color-success)' }}>{doneTasks.length}</span>
            <span className="pwb-stat-label">Done</span>
          </div>
        </div>
      </div>

      <div className="summary-bar">
        <div className="summary-chip s-pending">
          <span className="count">{pendingTasks.length}</span>
          <span className="label">Pending</span>
        </div>
        <div className="summary-chip s-pool">
          <span className="count">{poolTasks.length}</span>
          <span className="label">In Pool</span>
        </div>
        <div className="summary-chip s-progress">
          <span className="count">{inProgressTasks.length}</span>
          <span className="label">In Progress</span>
        </div>
        <div className="summary-chip s-done">
          <span className="count">{doneTasks.length}</span>
          <span className="label">Done</span>
        </div>
      </div>

      {/* Pending — always visible */}
      <div className="manager-section">
        <div className="section-header">
          <h2 className="section-title">Pending Review</h2>
          <span className="section-count">{pendingTasks.length}</span>
        </div>
        {pendingTasks.length === 0 ? (
          <div className="empty-state"><p>No pending requests — all caught up!</p></div>
        ) : (
          <div className="card-grid">
            {pendingTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                actions={
                  <>
                    {task.editDecision && (
                      <div className={`edit-decision-banner ${task.editDecision.outcome}`}>
                        {task.editDecision.outcome === 'accepted'
                          ? '✓ Client accepted your edit'
                          : '✕ Client rejected your edit'}
                        <button className="edit-decision-dismiss" onClick={() => dismissDecision(task.id)} title="Dismiss">×</button>
                      </div>
                    )}

                    {rejectingId === task.id ? (
                      <div className="reject-reason-box">
                        <input
                          className="reject-reason-input"
                          placeholder="Reason for rejection (optional)"
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') confirmReject(task.id)
                            if (e.key === 'Escape') cancelReject()
                          }}
                        />
                        <div className="reject-reason-actions">
                          <button className="btn btn-danger btn-sm" onClick={() => confirmReject(task.id)}>
                            Confirm Reject
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={cancelReject}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {task.pendingEdit ? (
                          <span className="pending-edit-badge">Awaiting client review</span>
                        ) : (
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(task)}>
                            Edit
                          </button>
                        )}
                        <button className="btn btn-success btn-sm" onClick={() => approveTask(task.id)}>
                          Approve
                        </button>
                        <button className="btn btn-danger-outline btn-sm" onClick={() => openReject(task.id)}>
                          Reject
                        </button>
                      </>
                    )}
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>

      <CollapsibleSection title="Approved — In Programmer Pool" count={poolTasks.length}>
        {poolTasks.length === 0 ? (
          <div className="empty-state"><p>No tasks in the pool.</p></div>
        ) : (
          <div className="card-grid">
            {poolTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                actions={
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(task)}>
                    Edit Tags
                  </button>
                }
              />
            ))}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="In Progress" count={inProgressTasks.length}>
        {inProgressTasks.length === 0 ? (
          <div className="empty-state"><p>No tasks currently in progress.</p></div>
        ) : (
          <div className="card-grid">
            {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Completed" count={doneTasks.length}>
        {doneTasks.length === 0 ? (
          <div className="empty-state"><p>No completed tasks yet.</p></div>
        ) : (
          <div className="card-grid">
            {doneTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Rejected" count={rejectedTasks.length}>
        {rejectedTasks.length === 0 ? (
          <div className="empty-state"><p>No rejected tasks.</p></div>
        ) : (
          <div className="card-grid">
            {rejectedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </CollapsibleSection>

      <Modal isOpen={!!editingTask} onClose={closeEdit} title="Edit Request">
        {editingTask && (
          <>
            <TaskForm
              initialValues={editingTask}
              onSubmit={handleSaveEdit}
              onCancel={closeEdit}
              submitLabel="Save Changes"
            />
            <div className="modal-tag-section">
              <label className="modal-tag-label">Specialist Tags</label>
              <p className="modal-tag-hint">
                Add tags so programmers can find this task by specialty (e.g. networking, database, security).
              </p>
              <TagInput tags={editTags} onChange={setEditTags} />
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
