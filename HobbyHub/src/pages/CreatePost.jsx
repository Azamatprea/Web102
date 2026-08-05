import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../client'
import { useAuth } from '../context/AuthContext'

export const CATEGORIES = ['General', 'News', 'Sports', 'Clubs', 'Announcements', 'Question']

export default function CreatePost() {
  const navigate = useNavigate()
  const { username } = useAuth()
  const [searchParams] = useSearchParams()
  const repostParam = searchParams.get('repost') || ''

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    category: 'General',
    repost_of: repostParam
  })
  const [repostTitle, setRepostTitle] = useState('')
  const [repostError, setRepostError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (repostParam) validateRepostId(repostParam)
  }, [repostParam])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateRepostId = async (id) => {
    setRepostError('')
    setRepostTitle('')
    if (!id.trim()) return
    const { data, error } = await supabase
      .from('posts')
      .select('id, title')
      .eq('id', id.trim())
      .single()

    if (error || !data) {
      setRepostError('No post found with that ID.')
    } else {
      setRepostTitle(data.title)
    }
  }

  const handleRepostIdChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, repost_of: value }))
    validateRepostId(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.repost_of.trim() && repostError) return
    setLoading(true)

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url,
        category: formData.category,
        author: username,
        repost_of: formData.repost_of.trim() || null
      }])
      .select()

    setLoading(false)
    if (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Check console.')
    } else {
      navigate(data && data[0] ? `/post/${data[0].id}` : '/')
    }
  }

  return (
    <div className="animate-fade-in glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '2rem' }}>Create New Post</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title (Required)</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="What's happening?"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">Content (Optional)</label>
          <textarea
            id="content"
            name="content"
            className="form-control"
            value={formData.content}
            onChange={handleChange}
            placeholder="Add more details..."
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="image_url">Image URL (Optional)</label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            className="form-control"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="repost_of">Repost of Post ID (Optional)</label>
          <input
            type="text"
            id="repost_of"
            name="repost_of"
            className="form-control"
            value={formData.repost_of}
            onChange={handleRepostIdChange}
            placeholder="Paste an existing post's ID to repost it"
          />
          {repostError && <p className="field-hint field-hint-error">{repostError}</p>}
          {repostTitle && <p className="field-hint field-hint-success">Reposting: "{repostTitle}"</p>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
          {loading ? 'Creating...' : 'Publish Post'}
        </button>
      </form>
    </div>
  )
}
