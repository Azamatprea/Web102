import { useState } from "react"

// Maps category → CSS class on the card for color theming
const categoryClass = {
  everyday: "card-everyday",
  internet: "card-internet",
  social: "card-social",
  emotions: "card-emotions",
  money: "card-money",
}

const categoryEmoji = {
  everyday: "💬",
  internet: "🌐",
  social: "🤝",
  emotions: "😤",
  money: "💸",
}

function FlashCard({ card }) {
  const [flipped, setFlipped] = useState(false)

  // Reset flip whenever the card changes
  const handleClick = () => setFlipped((prev) => !prev)

  const colorClass = categoryClass[card.category] || "card-everyday"

  return (
    <div className="card-scene" onClick={handleClick}>
      <div className={`card-inner ${flipped ? "is-flipped" : ""}`}>
        {/* FRONT — definition */}
        <div className={`card-face card-front ${colorClass}`}>
          <span className="card-category-badge">
            {categoryEmoji[card.category]} {card.category}
          </span>
          <p className="card-definition">{card.definition}</p>
          <p className="card-hint">Click to see the slang term</p>
        </div>

        {/* BACK — term + example */}
        <div className={`card-face card-back ${colorClass}`}>
          <span className="card-category-badge">
            {categoryEmoji[card.category]} {card.category}
          </span>
          <p className="card-term">{card.term}</p>
          <p className="card-example">{card.example}</p>
          <p className="card-hint">Click to flip back</p>
        </div>
      </div>
    </div>
  )
}

export default FlashCard
