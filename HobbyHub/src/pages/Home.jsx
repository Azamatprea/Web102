import { useEffect, useState } from 'react'
import { Search, Loader, ListFilter } from 'lucide-react'
import { supabase } from '../client'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('id, created_at, title, upvotes')
      .order(sortBy, { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data)
    }
    setLoading(false)
  }

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <div className="controls-bar">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search posts by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="sort-controls">
          <ListFilter size={20} color="var(--text-muted)" />
          <button 
            className={`btn ${sortBy === 'created_at' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSortBy('created_at')}
          >
            Newest
          </button>
          <button 
            className={`btn ${sortBy === 'upvotes' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSortBy('upvotes')}
          >
            Most Popular
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <ListFilter size={48} />
          <h2>No posts found</h2>
          <p>Try adjusting your search or be the first to create a post!</p>
        </div>
      ) : (
        <div className="post-grid">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
