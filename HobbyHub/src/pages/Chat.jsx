import { useState, useEffect, useRef } from 'react'
import { supabase } from '../client'
import { Send, Hash } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('Student_' + Math.floor(Math.random() * 1000))
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchMessages()
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('chat_messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
        setMessages(current => [...current, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50)
      
    if (error) console.error('Error fetching messages:', error)
    else setMessages(data)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const { error } = await supabase
      .from('chat_messages')
      .insert([{ sender: username, message: newMessage }])

    if (error) {
      console.error('Error sending message:', error)
    } else {
      setNewMessage('')
      fetchMessages()
    }
  }

  return (
    <div className="animate-fade-in glass-panel chat-container" style={{ maxWidth: '900px', margin: '0 auto', padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <Hash color="#1E88E5" /> School Lounge
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Chatting as:</span>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            style={{ width: '150px', padding: '8px 12px', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className="chat-messages">
        <div className="chat-message system">
          Welcome to the School Lounge! Be respectful.
        </div>
        
        {messages.map((msg, index) => {
          const isMe = msg.sender === username
          return (
            <div key={msg.id || index} className={`chat-message ${isMe ? 'user' : 'other'}`}>
              {!isMe && (
                <div className="chat-message-meta">
                  <span style={{ fontWeight: 600 }}>{msg.sender}</span>
                  <span>{msg.created_at ? formatDistanceToNow(new Date(msg.created_at)) : ''}</span>
                </div>
              )}
              {isMe && (
                <div className="chat-message-meta" style={{ justifyContent: 'flex-end', color: 'rgba(255,255,255,0.7)' }}>
                  <span>{msg.created_at ? formatDistanceToNow(new Date(msg.created_at)) : ''}</span>
                </div>
              )}
              <div style={{ wordBreak: 'break-word' }}>{msg.message}</div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
          <Send size={18} /> Send
        </button>
      </form>
    </div>
  )
}
