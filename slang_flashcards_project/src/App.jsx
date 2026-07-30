import { useState } from "react"
import FlashCard from "./components/FlashCard"
import initialCards from "./data/cards"

function App() {
  const [cards, setCards] = useState(initialCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  // key forces FlashCard to remount (resetting its flip state) on card change
  const [cardKey, setCardKey] = useState(0)

  // Guess state
  const [userGuess, setUserGuess] = useState("")
  const [guessResult, setGuessResult] = useState(null) // null, "correct", "incorrect"

  // Streak state
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)

  const currentCard = cards[currentIndex]

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setCardKey((k) => k + 1)
      setUserGuess("")
      setGuessResult(null)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setCardKey((k) => k + 1)
      setUserGuess("")
      setGuessResult(null)
    }
  }

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setCardKey((k) => k + 1)
    setUserGuess("")
    setGuessResult(null)
  }

  const handleMarkMastered = () => {
    if (cards.length === 0) return
    const newCards = cards.filter((c) => c.id !== currentCard.id)
    setCards(newCards)
    if (currentIndex >= newCards.length && newCards.length > 0) {
      setCurrentIndex(newCards.length - 1)
    }
    setCardKey((k) => k + 1)
    setUserGuess("")
    setGuessResult(null)
  }

  const handleGuessSubmit = (e) => {
    e.preventDefault()
    if (!userGuess.trim() || !currentCard) return

    const actualTerm = currentCard.term.toLowerCase().replace(/[^a-z0-9]/g, "")
    const actualDefinition = currentCard.definition.toLowerCase().replace(/[^a-z0-9]/g, "")
    const guess = userGuess.toLowerCase().replace(/[^a-z0-9]/g, "")

    // Fuzzy matching logic: match term or definition, ignoring punctuation
    if (
      guess === actualTerm || 
      (guess.length > 2 && actualTerm.includes(guess)) ||
      guess === actualDefinition ||
      (guess.length > 4 && actualDefinition.includes(guess))
    ) {
      setGuessResult("correct")
      setCurrentStreak((prev) => {
        const newStreak = prev + 1
        setLongestStreak((l) => Math.max(l, newStreak))
        return newStreak
      })
    } else {
      setGuessResult("incorrect")
      setCurrentStreak(0)
    }
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
        <p className="app-streak">
          Current Streak: {currentStreak}, Longest Streak: {longestStreak}
        </p>
      </header>

      {/* ── CARD AREA ── */}
      <main className="card-area">
        {cards.length > 0 ? (
          <FlashCard key={cardKey} card={currentCard} />
        ) : (
          <div className="all-mastered">
            <h2>You have mastered all the cards! 🎉</h2>
            <p>Refresh the page to start over.</p>
          </div>
        )}
      </main>

      {/* ── GUESS AREA ── */}
      {cards.length > 0 && (
        <form className="guess-area" onSubmit={handleGuessSubmit}>
          <label htmlFor="guess">Guess the answer here:</label>
          <input
            id="guess"
            type="text"
            placeholder="Place your answer here..."
            value={userGuess}
            onChange={(e) => {
              setUserGuess(e.target.value)
              setGuessResult(null) // reset visual feedback when typing
            }}
            className={guessResult === "correct" ? "input-correct" : guessResult === "incorrect" ? "input-incorrect" : ""}
          />
          <button type="submit" className="btn-submit">Submit Guess</button>
        </form>
      )}

      {/* ── CONTROLS ── */}
      {cards.length > 0 && (
        <div className="controls">
          <button className="btn-nav" onClick={handlePrev} disabled={currentIndex === 0}>
            ←
          </button>
          <button className="btn-nav" onClick={handleNext} disabled={currentIndex === cards.length - 1}>
            →
          </button>
          <button className="btn-nav" onClick={handleShuffle}>
            Shuffle Cards
          </button>
          <button className="btn-nav btn-mastered" onClick={handleMarkMastered}>
            Mark as Mastered
          </button>
        </div>
      )}
    </div>
  )
}

export default App
