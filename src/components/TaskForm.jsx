import { useState } from 'react'

const DESC_MAX = 500

export default function TaskForm({ initialValues = {}, onSubmit, onCancel, submitLabel = 'Submit' }) {
  const [title, setTitle]      = useState(initialValues.title || '')
  const [description, setDesc] = useState(initialValues.description || '')
  const [price, setPrice]      = useState(initialValues.price != null ? String(initialValues.price) : '')
  const [errors, setErrors]    = useState({})

  function validate() {
    const e = {}
    if (!title.trim())                e.title       = 'Title is required'
    if (!description.trim())          e.description = 'Description is required'
    if (!price || Number(price) <= 0) e.price       = 'Price must be greater than 0'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit({ title: title.trim(), description: description.trim(), price: Number(price) })
  }

  const descLen  = description.length
  const countCls = descLen > DESC_MAX ? 'char-count over' : descLen > DESC_MAX * 0.85 ? 'char-count warn' : 'char-count'

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Brief summary of the IT problem"
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <div className="form-group-header">
          <label>Description</label>
          <span className={countCls}>{descLen} / {DESC_MAX}</span>
        </div>
        <textarea
          value={description}
          onChange={e => setDesc(e.target.value)}
          placeholder="Describe the problem in detail — what happened, what you need, any relevant context…"
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Budget</label>
        <div className="price-input-wrapper">
          <span className="price-input-prefix">$</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
        {errors.price && <span className="form-error">{errors.price}</span>}
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        )}
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  )
}
