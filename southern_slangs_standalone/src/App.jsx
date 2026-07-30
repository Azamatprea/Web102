import { useState } from "react"
import FlashCard from "./components/FlashCard"
import cards from "./data/cards"

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  // key forces FlashCard to remount (resetting its flip state) on card change
  const [cardKey, setCardKey] = useState(0)

  const currentCard = cards[currentIndex]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
    setCardKey((k) => k + 1)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    setCardKey((k) => k + 1)
  }

  return (
    <div className="app">
      {/* ── HEADER ── */}
      <header className="app-header">
        <h1 className="app-title">The Ultimate Cowboy!</h1>
        <p className="app-description">
          How good of a cowboy are you? Test all of your southern knowledge here!
        </p>
        <p className="app-count">
          Number of cards: {cards.length}
        </p>
      </header>

      {/* ── CARD AREA ── */}
      <main className="card-area">
        <FlashCard key={cardKey} card={currentCard} />
      </main>

      {/* ── CONTROLS ── */}
      <div className="controls">
        <button className="btn-nav" onClick={handlePrev}>
          ←
        </button>
        <button className="btn-nav" onClick={handleNext}>
          →
        </button>
      </div>
    </div>
  )
}

export default App
