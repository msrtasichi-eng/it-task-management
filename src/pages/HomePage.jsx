export default function HomePage({ onSelectRole }) {
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-badge">
          <span className="home-badge-dot" />
          IT Service Management Platform
        </div>

        <div className="home-hero">
          <h1>Manage IT requests<br /><span>end-to-end</span></h1>
          <p>
            Submit problems, review and price them, then let specialists
            claim and resolve — all in one streamlined workflow.
          </p>
        </div>

        <div className="role-cards">
          <button className="role-card" onClick={() => onSelectRole('user')}>
            <div className="role-card-icon-wrap client">&#128100;</div>
            <h3>Client</h3>
            <p>Submit an IT problem with a description and the budget you'll pay.</p>
          </button>

          <button className="role-card" onClick={() => onSelectRole('manager')}>
            <div className="role-card-icon-wrap manager">&#128203;</div>
            <h3>Manager</h3>
            <p>Review requests, adjust pricing and details, then release to specialists.</p>
          </button>

          <button className="role-card" onClick={() => onSelectRole('programmer')}>
            <div className="role-card-icon-wrap programmer">&#128187;</div>
            <h3>Specialist</h3>
            <p>Browse the task pool by specialty tag, claim a task, and mark it done.</p>
          </button>
        </div>
      </div>
    </div>
  )
}
