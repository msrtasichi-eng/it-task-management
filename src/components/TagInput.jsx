import { useState } from 'react'

export default function TagInput({ tags = [], onChange }) {
  const [input, setInput] = useState('')

  function addTag(raw) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag])
    }
    setInput('')
  }

  function removeTag(tag) {
    onChange(tags.filter(t => t !== tag))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="tag-input-wrapper">
      {tags.map(tag => (
        <span key={tag} className="tag-chip tag-chip-edit">
          {tag}
          <button
            type="button"
            className="tag-remove"
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
          >
            &#x2715;
          </button>
        </span>
      ))}
      <input
        className="tag-input-field"
        type="text"
        placeholder={tags.length ? '' : 'Add tags (Enter to confirm)'}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input.trim() && addTag(input)}
      />
    </div>
  )
}
