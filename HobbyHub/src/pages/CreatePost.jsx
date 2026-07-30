import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../client'

export default function CreatePost() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from('posts')
      .insert([{ 
        title: formData.title, 
        content: formData.content, 
        image_url: formData.image_url 
      }])

    setLoading(false)
    if (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Check console.')
    } else {
      navigate('/')
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
        
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
          {loading ? 'Creating...' : 'Publish Post'}
        </button>
      </form>
    </div>
  )
}
