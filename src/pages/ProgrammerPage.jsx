import { useState, useMemo } from 'react'
import { useTask } from '../context/TaskContext'
import TaskCard from '../components/TaskCard'

function ClaimActions({ task, onClaim }) {
  const [claiming, setClaiming] = useState(false)
  const [name, setName] = useState('')

  if (!claiming) {
    return (
      <button className="btn btn-primary btn-sm" onClick={() => setClaiming(true)}>
        Claim Task
      </button>
    )
  }

  return (
    <div className="claim-form">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && name.trim() && onClaim(name.trim())}
        autoFocus
      />
      <button
        className="btn btn-primary btn-sm"
        disabled={!name.trim()}
        onClick={() => name.trim() && onClaim(name.trim())}
      >
        Confirm
      </button>
      <button className="btn btn-ghost btn-sm" onClick={() => setClaiming(false)}>
        Cancel
      </button>
    </div>
  )
}

export default function ProgrammerPage() {
  const { poolTasks, inProgressTasks, doneTasks, claimTask, markDone } = useTask()
  const [showDone, setShowDone] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTags, setActiveTags] = useState([])

  const allTags = useMemo(() => {
    const set = new Set()
    poolTasks.forEach(t => (t.tags || []).forEach(tag => set.add(tag)))
    return [...set].sort()
  }, [poolTasks])

  function toggleTag(tag) {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filteredPool = useMemo(() => {
    return poolTasks.filter(task => {
      const q = search.trim().toLowerCase()
      const matchesSearch = !q ||
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        (task.tags || []).some(tag => tag.includes(q))
      const matchesTags = activeTags.length === 0 ||
        activeTags.every(at => (task.tags || []).includes(at))
      return matchesSearch && matchesTags
    })
  }, [poolTasks, search, activeTags])

  return (
    <div className="page-container">
      <h1 className="page-title">Programmer Panel</h1>

      <div className="programmer-sections">
        {/* Search + filter */}
        <div className="search-bar-wrapper">
          <div className="search-input-wrap">
            <span className="search-icon">&#128269;</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search tasks by title, description or tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {allTags.length > 0 && (
            <div className="tag-filter-row">
              <span className="tag-filter-label">Filter by specialty:</span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter-btn${activeTags.includes(tag) ? ' active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
              {activeTags.length > 0 && (
                <button
                  className="tag-filter-clear"
                  onClick={() => setActiveTags([])}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Available tasks */}
        <div>
          <h2 className="section-title">
            Available Tasks
            <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: 6 }}>
              ({filteredPool.length}{filteredPool.length !== poolTasks.length ? ` of ${poolTasks.length}` : ''})
            </span>
          </h2>
          {poolTasks.length === 0 ? (
            <div className="empty-state"><p>No tasks available right now. Check back later!</p></div>
          ) : filteredPool.length === 0 ? (
            <div className="empty-state">
              <p>No tasks match your current filters.</p>
            </div>
          ) : (
            <div className="card-grid">
              {filteredPool.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  actions={
                    <ClaimActions
                      task={task}
                      onClaim={name => claimTask(task.id, name)}
                    />
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* In-progress tasks */}
        <div>
          <h2 className="section-title">My Tasks — In Progress ({inProgressTasks.length})</h2>
          <p className="in-progress-note">Tasks you have claimed and are currently working on.</p>
          {inProgressTasks.length === 0 ? (
            <div className="empty-state"><p>You have not claimed any tasks yet.</p></div>
          ) : (
            <div className="card-grid">
              {inProgressTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  actions={
                    <button className="btn btn-success btn-sm" onClick={() => markDone(task.id)}>
                      Mark as Done
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed — collapsible */}
        {doneTasks.length > 0 && (
          <div>
            <div className="collapsible-header" onClick={() => setShowDone(v => !v)}>
              <span className={`chevron ${showDone ? 'open' : ''}`}>&#9658;</span>
              <h2 className="section-title" style={{ margin: 0 }}>Completed ({doneTasks.length})</h2>
            </div>
            {showDone && (
              <div className="card-grid">
                {doneTasks.map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
