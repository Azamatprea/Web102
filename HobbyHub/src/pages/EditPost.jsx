import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../client'

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [id])

  async function fetchPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
      
    if (error) {
      console.error('Error fetching post:', error)
    } else {
      setFormData({
        title: data.title || '',
        content: data.content || '',
        image_url: data.image_url || ''
      })
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('posts')
      .update({ 
        title: formData.title, 
        content: formData.content, 
        image_url: formData.image_url 
      })
      .eq('id', id)

    setSaving(false)
    if (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post.')
    } else {
      navigate(`/post/${id}`)
    }
  }

  if (loading) return <div className="loading-spinner"></div>

  return (
    <div className="animate-fade-in glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '2rem' }}>Edit Post</h2>
      
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
          />
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ flexGrow: 1, padding: '16px', fontSize: '1.1rem' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate(`/post/${id}`)} style={{ padding: '16px', fontSize: '1.1rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
