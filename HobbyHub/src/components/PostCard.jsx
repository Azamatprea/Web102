import { Link } from 'react-router-dom'
import { ArrowUp, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function PostCard({ post }) {
  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <div className="post-header">
        <div className="post-meta">
          <Clock size={14} />
          {post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : 'Just now'}
        </div>
      </div>
      <h3 className="post-title">{post.title}</h3>
      <div className="post-footer">
        <div className="upvote-badge">
          <ArrowUp size={16} /> {post.upvotes || 0}
        </div>
      </div>
    </Link>
  )
}
