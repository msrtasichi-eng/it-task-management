import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ROLE_OPTIONS = [
  {
    key: 'client',
    icon: '👤',
    label: 'Client',
    desc: 'Submit IT problems and track their resolution.',
  },
  {
    key: 'specialist',
    icon: '💻',
    label: 'Specialist',
    desc: 'Pick up tasks that match your expertise and skills.',
  },
  {
    key: 'manager',
    icon: '📋',
    label: 'Manager',
    desc: 'Review requests, set pricing, release to specialists.',
    note: 'Requires admin approval',
  },
]

function Field({ label, optional, error, children }) {
  return (
    <div className="form-group">
      <label>
        {label}
        {optional && <span className="field-optional"> (optional)</span>}
      </label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}
function Row({ children }) { return <div className="reg-row">{children}</div> }
function SectionHeading({ icon, title }) {
  return (
    <div className="reg-section-heading">
      <span className="reg-section-icon">{icon}</span>
      {title}
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try { login(email, password) }
    catch (err) { setError(err.message) }
    setLoading(false)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <Field label="Email address">
        <input type="email" placeholder="you@example.com" value={email}
          onChange={e => setEmail(e.target.value)} autoFocus />
      </Field>
      <Field label="Password">
        <div className="pw-wrapper">
          <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} />
          <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
            {showPw ? '🙈' : '👁'}
          </button>
        </div>
      </Field>
      {error && <div className="auth-error">{error}</div>}
      <button className="btn btn-primary auth-submit-btn" type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In →'}
      </button>
      <p className="auth-switch">
        Don't have an account?{' '}
        <button type="button" className="auth-switch-btn" onClick={onSwitch}>Create one free</button>
      </p>
      <div className="auth-hint">
        <span className="auth-hint-label">Demo admin:</span> admin@itsystem.com / admin123
      </div>
    </form>
  )
}

function SuccessScreen({ user, onLogin }) {
  const roleIcons = { client: '👤', specialist: '💻', manager: '📋' }
  const isPending = user.status === 'pending'

  return (
    <div className="success-overlay">
      <div className="success-checkmark">
        <div className="success-circle">
          <svg className="success-svg" viewBox="0 0 52 52">
            <circle className="success-circle-bg" cx="26" cy="26" r="25" fill="none" />
            <path className="success-tick" fill="none" d="M14 27 l8 8 l16-16" />
          </svg>
        </div>
      </div>
      <h2 className="success-title">
        {isPending ? 'Application Submitted!' : 'Welcome to ResolvIT!'}
      </h2>
      <p className="success-subtitle">
        {isPending
          ? 'Your manager application is under review by an administrator.'
          : `You're all set, ${user.name.split(' ')[0]}. Let's get to work.`}
      </p>
      <div className="success-card">
        <div className="success-card-header">
          <span className="success-role-icon">{roleIcons[user.role]}</span>
          <div>
            <div className="success-name">{user.name}</div>
            <div className="success-email">{user.email}</div>
          </div>
        </div>
        <div className="success-details">
          <div className="success-detail-row">
            <span className="sdl">Role</span>
            <span className="sdv" style={{ textTransform: 'capitalize' }}>{user.role}</span>
          </div>
          {user.phone && <div className="success-detail-row"><span className="sdl">Phone</span><span className="sdv">{user.phone}</span></div>}
          {user.company && <div className="success-detail-row"><span className="sdl">Company</span><span className="sdv">{user.company}</span></div>}
          {user.jobTitle && <div className="success-detail-row"><span className="sdl">Title</span><span className="sdv">{user.jobTitle}</span></div>}
          {user.department && <div className="success-detail-row"><span className="sdl">Department</span><span className="sdv">{user.department}</span></div>}
          {user.position && <div className="success-detail-row"><span className="sdl">Position</span><span className="sdv">{user.position}</span></div>}
          {user.specialty && <div className="success-detail-row"><span className="sdl">Specialty</span><span className="sdv">{user.specialty}</span></div>}
          {user.experience && <div className="success-detail-row"><span className="sdl">Experience</span><span className="sdv">{user.experience}</span></div>}
          {user.availability && <div className="success-detail-row"><span className="sdl">Availability</span><span className="sdv">{user.availability}</span></div>}
          <div className="success-detail-row">
            <span className="sdl">Status</span>
            <span className={`sdv success-status ${isPending ? 'pending' : 'active'}`}>
              {isPending ? '⏳ Pending approval' : '✓ Active'}
            </span>
          </div>
        </div>
      </div>
      {isPending
        ? <p className="success-note">You will be notified once an admin reviews your application.<br />Try signing in after approval.</p>
        : <p className="success-note">Your account is ready. Sign in to get started.</p>}
      <button className="btn btn-primary success-signin-btn" onClick={onLogin}>Go to Sign In →</button>
    </div>
  )
}

function RegisterForm({ onSwitch }) {
  const { register } = useAuth()
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [contactMethod, setContact] = useState('email')
  const [itNeeds, setItNeeds] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [experience, setExperience] = useState('')
  const [availability, setAvail] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [bio, setBio] = useState('')
  const [department, setDept] = useState('')
  const [position, setPosition] = useState('')
  const [manCompany, setManCompany] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [manExp, setManExp] = useState('')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdUser, setCreatedUser] = useState(null)

  function validate() {
    const e = {}
    if (!role) e.role = 'Please select your role.'
    if (!name.trim()) e.name = 'Full name is required.'
    if (!email.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.'
    if (phone && !/^[+\d\s\-()]{7,}$/.test(phone)) e.phone = 'Enter a valid phone number.'
    if (!password) e.password = 'Password is required.'
    else if (password.length < 6) e.password = 'At least 6 characters required.'
    if (password !== confirm) e.confirm = 'Passwords do not match.'
    if (role === 'manager') {
      if (!department.trim()) e.department = 'Department is required.'
      if (!position.trim())   e.position   = 'Position is required.'
      if (!manCompany.trim()) e.manCompany  = 'Company is required.'
    }
    if (role === 'specialist') {
      if (!specialty.trim()) e.specialty    = 'Primary specialty is required.'
      if (!experience)       e.experience   = 'Please select years of experience.'
      if (!availability)     e.availability = 'Please select availability.'
    }
    if (role === 'client') {
      if (!company.trim())  e.company  = 'Company / organization is required.'
      if (!jobTitle.trim()) e.jobTitle = 'Job title is required.'
    }
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const user = register({
        name, email, password, role, phone,
        company:       role === 'client'     ? company    : (role === 'manager' ? manCompany : undefined),
        jobTitle:      role === 'client'     ? jobTitle   : undefined,
        contactMethod: role === 'client'     ? contactMethod : undefined,
        itNeeds:       role === 'client'     ? itNeeds    : undefined,
        specialty:     role === 'specialist' ? specialty  : undefined,
        experience:    role === 'specialist' ? experience : (role === 'manager' ? manExp : undefined),
        availability:  role === 'specialist' ? availability : undefined,
        portfolio:     role === 'specialist' ? portfolio  : undefined,
        bio:           role === 'specialist' ? bio        : undefined,
        department:    role === 'manager'    ? department : undefined,
        position:      role === 'manager'    ? position   : undefined,
        teamSize:      role === 'manager'    ? teamSize   : undefined,
        reason:        role === 'manager'    ? reason     : undefined,
      })
      setCreatedUser(user)
    } catch (err) {
      setApiError(err.message)
    }
    setLoading(false)
  }

  if (createdUser) return <SuccessScreen user={createdUser} onLogin={() => onSwitch()} />

  const showAccount = !!role

  return (
    <form className="auth-form reg-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>I am a…</label>
        <div className="register-role-grid">
          {ROLE_OPTIONS.map(r => (
            <button key={r.key} type="button"
              className={`register-role-btn${role === r.key ? ' selected' : ''}`}
              onClick={() => setRole(r.key)}>
              <span className="rrb-icon">{r.icon}</span>
              <span className="rrb-label">{r.label}</span>
              <span className="rrb-desc">{r.desc}</span>
              {r.note && <span className="rrb-note">⚠ {r.note}</span>}
            </button>
          ))}
        </div>
        {errors.role && <span className="form-error">{errors.role}</span>}
      </div>

      {showAccount && (
        <>
          <SectionHeading icon="🔐" title="Account Information" />
          <Row>
            <Field label="Full name" error={errors.name}>
              <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} />
            </Field>
            <Field label="Phone number" optional error={errors.phone}>
              <input type="tel" placeholder="+1 555 000 0000" value={phone} onChange={e => setPhone(e.target.value)} />
            </Field>
          </Row>
          <Field label="Email address" error={errors.email}>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </Field>
          <Row>
            <Field label="Password" error={errors.password}>
              <div className="pw-wrapper">
                <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>{showPw ? '🙈' : '👁'}</button>
              </div>
            </Field>
            <Field label="Confirm password" error={errors.confirm}>
              <div className="pw-wrapper">
                <input type={showCf ? 'text' : 'password'} placeholder="Repeat password"
                  value={confirm} onChange={e => setConfirm(e.target.value)} />
                <button type="button" className="pw-toggle" onClick={() => setShowCf(v => !v)}>{showCf ? '🙈' : '👁'}</button>
              </div>
            </Field>
          </Row>

          {role === 'client' && (
            <>
              <SectionHeading icon="👤" title="Client Details" />
              <Row>
                <Field label="Company / Organization" error={errors.company}>
                  <input type="text" placeholder="Acme Corp" value={company} onChange={e => setCompany(e.target.value)} />
                </Field>
                <Field label="Job title" error={errors.jobTitle}>
                  <input type="text" placeholder="e.g. Office Manager" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                </Field>
              </Row>
              <Field label="Preferred contact method">
                <div className="radio-group">
                  {['email', 'phone', 'both'].map(v => (
                    <label key={v} className="radio-label">
                      <input type="radio" name="contact" value={v} checked={contactMethod === v} onChange={() => setContact(v)} />
                      <span className="radio-custom" />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Typical IT needs" optional>
                <textarea placeholder="Describe the type of IT problems you usually face…"
                  value={itNeeds} onChange={e => setItNeeds(e.target.value)} style={{ minHeight: 80 }} />
              </Field>
            </>
          )}

          {role === 'specialist' && (
            <>
              <SectionHeading icon="💻" title="Professional Details" />
              <Row>
                <Field label="Primary specialty" error={errors.specialty}>
                  <input type="text" placeholder="e.g. Networking, Security, DevOps"
                    value={specialty} onChange={e => setSpecialty(e.target.value)} />
                </Field>
                <Field label="Years of experience" error={errors.experience}>
                  <select className="reg-select" value={experience} onChange={e => setExperience(e.target.value)}>
                    <option value="">Select…</option>
                    <option>Less than 1 year</option>
                    <option>1 – 3 years</option>
                    <option>3 – 5 years</option>
                    <option>5 – 10 years</option>
                    <option>10+ years</option>
                  </select>
                </Field>
              </Row>
              <Field label="Availability" error={errors.availability}>
                <div className="radio-group">
                  {['Full-time', 'Part-time', 'Freelance', 'On-call'].map(v => (
                    <label key={v} className="radio-label">
                      <input type="radio" name="avail" value={v} checked={availability === v} onChange={() => setAvail(v)} />
                      <span className="radio-custom" />
                      {v}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Portfolio / LinkedIn / GitHub URL" optional>
                <input type="url" placeholder="https://github.com/yourname"
                  value={portfolio} onChange={e => setPortfolio(e.target.value)} />
              </Field>
              <Field label="Short bio" optional>
                <textarea placeholder="Tell us about your background and what you specialise in…"
                  value={bio} onChange={e => setBio(e.target.value)} style={{ minHeight: 80 }} />
              </Field>
            </>
          )}

          {role === 'manager' && (
            <>
              <SectionHeading icon="📋" title="Manager Details" />
              <Row>
                <Field label="Company" error={errors.manCompany}>
                  <input type="text" placeholder="Acme Corp" value={manCompany} onChange={e => setManCompany(e.target.value)} />
                </Field>
                <Field label="Department" error={errors.department}>
                  <input type="text" placeholder="e.g. IT, DevOps, Support"
                    value={department} onChange={e => setDept(e.target.value)} />
                </Field>
              </Row>
              <Row>
                <Field label="Position / Title" error={errors.position}>
                  <input type="text" placeholder="e.g. IT Manager, Head of DevOps"
                    value={position} onChange={e => setPosition(e.target.value)} />
                </Field>
                <Field label="Team size" optional>
                  <select className="reg-select" value={teamSize} onChange={e => setTeamSize(e.target.value)}>
                    <option value="">Select…</option>
                    <option>1 – 5 people</option>
                    <option>5 – 15 people</option>
                    <option>15 – 50 people</option>
                    <option>50+ people</option>
                  </select>
                </Field>
              </Row>
              <Field label="Years of management experience" optional>
                <select className="reg-select" value={manExp} onChange={e => setManExp(e.target.value)}>
                  <option value="">Select…</option>
                  <option>Less than 1 year</option>
                  <option>1 – 3 years</option>
                  <option>3 – 5 years</option>
                  <option>5 – 10 years</option>
                  <option>10+ years</option>
                </select>
              </Field>
              <Field label="Why do you want to join?" optional>
                <textarea placeholder="Describe your goals and what you'd like to manage on this platform…"
                  value={reason} onChange={e => setReason(e.target.value)} style={{ minHeight: 80 }} />
              </Field>
              <div className="manager-notice">
                ⚠ Manager accounts require admin approval before you can sign in.
              </div>
            </>
          )}

          {apiError && <div className="auth-error">{apiError}</div>}
          <button className="btn btn-primary auth-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : role === 'manager' ? '📋 Submit for Approval' : '✓ Create Account'}
          </button>
        </>
      )}

      <p className="auth-switch" style={{ marginTop: showAccount ? 16 : 24 }}>
        Already have an account?{' '}
        <button type="button" className="auth-switch-btn" onClick={onSwitch}>Sign in</button>
      </p>
    </form>
  )
}

export default function AuthPage() {
  const [tab, setTab] = useState('login')

  return (
    <div className="auth-page-split">
      {/* Left hero panel */}
      <div className="auth-hero-panel">
        <div className="auth-hero-content">
          <div className="auth-logo-mark">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <polygon points="19,2 34,10 34,28 19,36 4,28 4,10" stroke="#f5c518" strokeWidth="1.5" fill="rgba(245,197,24,0.07)" />
              <path d="M21 8l-8 13h7l-3 9 8-13h-7l3-9z" fill="#f5c518" />
            </svg>
          </div>
          <h1 className="auth-hero-brand">ResolvIT</h1>
          <p className="auth-hero-tagline">Fix faster. Think smarter.</p>

          <div className="auth-hero-steps">
            <div className="auth-step">
              <div className="auth-step-num">01</div>
              <div className="auth-step-info">
                <div className="auth-step-title">Submit</div>
                <div className="auth-step-desc">Clients describe their IT problem and set a budget</div>
              </div>
            </div>
            <div className="auth-step-connector" />
            <div className="auth-step">
              <div className="auth-step-num">02</div>
              <div className="auth-step-info">
                <div className="auth-step-title">Review</div>
                <div className="auth-step-desc">Managers refine the request and route it to specialists</div>
              </div>
            </div>
            <div className="auth-step-connector" />
            <div className="auth-step">
              <div className="auth-step-num">03</div>
              <div className="auth-step-info">
                <div className="auth-step-title">Resolve</div>
                <div className="auth-step-desc">Specialists claim and complete the task</div>
              </div>
            </div>
          </div>

          <div className="auth-hero-badge">
            <span className="auth-hero-badge-dot" />
            Trusted by IT teams worldwide
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className={`auth-card${tab === 'register' ? ' auth-card-wide' : ''}`}>
          <div className="auth-card-logo">
            <svg width="22" height="22" viewBox="0 0 38 38" fill="none">
              <polygon points="19,2 34,10 34,28 19,36 4,28 4,10" stroke="#f5c518" strokeWidth="1.5" fill="rgba(245,197,24,0.07)" />
              <path d="M21 8l-8 13h7l-3 9 8-13h-7l3-9z" fill="#f5c518" />
            </svg>
            <span className="auth-card-brand-name">ResolvIT</span>
          </div>

          <h2 className="auth-title">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="auth-subtitle">
            {tab === 'login'
              ? 'Sign in to manage your IT requests'
              : 'Join the platform and get started today'}
          </p>

          <div className="auth-tabs">
            <button className={`auth-tab-btn${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
            <button className={`auth-tab-btn${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>

          {tab === 'login'
            ? <LoginForm onSwitch={() => setTab('register')} />
            : <RegisterForm onSwitch={() => setTab('login')} />}
        </div>
      </div>
    </div>
  )
}
