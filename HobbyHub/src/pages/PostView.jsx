import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../client'
import { ArrowUp, Edit, Trash2, Clock, MessageCircle, Repeat2, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../context/AuthContext'

export default function PostView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { username } = useAuth()

  const [post, setPost] = useState(null)
  const [repostSource, setRepostSource] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  async function fetchPost() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching post', error)
      setPost(null)
    } else {
      setPost(data)
      if (data.repost_of) {
        const { data: source } = await supabase
          .from('posts')
          .select('id, title')
          .eq('id', data.repost_of)
          .single()
        setRepostSource(source || null)
      } else {
        setRepostSource(null)
      }
    }
    setLoading(false)
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    if (error) console.error('Error fetching comments', error)
    else setComments(data)
  }

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: (post.upvotes || 0) + 1 })
      .eq('id', id)
      .select()

    if (error) console.error('Error upvoting', error)
    else if (data && data.length > 0) {
      setPost(data[0])
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await supabase.from('posts').delete().eq('id', id)
      navigate('/')
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const { error } = await supabase
      .from('comments')
      .insert([{ post_id: id, text: newComment, author: username }])

    if (error) {
      console.error('Error adding comment', error)
    } else {
      setNewComment('')
      fetchComments()
    }
  }

  if (loading) return <div className="loading-spinner"></div>
  if (!post) return <div className="empty-state">Post not found.</div>

  const isOwner = post.author && post.author === username

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel">
        {repostSource && (
          <Link to={`/post/${repostSource.id}`} className="repost-banner">
            <Repeat2 size={16} /> Reposted from "{repostSource.title}"
          </Link>
        )}

        <div className="post-detail-header">
          <div className="post-meta-row">
            <span className="post-meta">
              <Clock size={16} />
              {post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : 'Unknown time'}
            </span>
            <span className="post-meta">
              <User size={16} /> {post.author || 'Anonymous'}
            </span>
            <span className="category-badge">{post.category || 'General'}</span>
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
        </div>

        {post.image_url && (
          <img src={post.image_url} alt="Post cover" className="post-detail-image" />
        )}

        {post.content && (
          <div className="post-detail-content">
            {post.content}
          </div>
        )}

        <div className="post-actions">
          <button className="btn btn-primary" onClick={handleUpvote}>
            <ArrowUp size={18} /> {post.upvotes || 0} Upvotes
          </button>
          <Link to={`/create?repost=${post.id}`} className="btn btn-outline">
            <Repeat2 size={18} /> Repost
          </Link>
          {isOwner && (
            <>
              <Link to={`/edit/${post.id}`} className="btn btn-outline">
                <Edit size={18} /> Edit
              </Link>
              <button className="btn btn-danger" onClick={handleDelete}>
                <Trash2 size={18} /> Delete
              </button>
            </>
          )}
        </div>

        <div className="comments-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <MessageCircle size={20} /> Comments ({comments.length})
          </h3>

          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Leave a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Post</button>
          </form>

          <div className="comment-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-meta">
                  <strong>{comment.author || 'Anonymous'}</strong>
                  {' · '}
                  {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ''}
                </div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
