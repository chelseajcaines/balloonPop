import "/src/App.css"
import { useState, useEffect, useCallback } from "react"
import { movieTitlesEndpoint } from "../data/apiEndpoints"
import PlayerInfoDisplay from "/src/components/PlayerInfoDisplay"
import GamePlaySection from "./GamePlaySection"
import Footer from "./Footer"
import Modal from "/src/components/Modal"

const TwoPlayerGamePlay = ({ movieTitles }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [puzzle, setPuzzle] = useState("")
    const [guessedLetters, setGuessedLetters] = useState([])
    const [showLeaveGameModal, setShowLeaveGameModal] = useState(false)
    const [isHomePageButtonClicked, setIsHomePageButtonClicked] =
        useState(false)
    const [playerTwoTurn, setPlayerTwoTurn] = useState(false)
    const [currentLetter, setCurrentLetter] = useState("")

    const chooseCategorie = () => {
        if (movieTitles) {
            return movieTitlesEndpoint
        }
    }

    const fetchPuzzle = async () => {
        setError(null)
        setGuessedLetters([])
        setPuzzle("")
        setIsLoading(true)

        try {
            const response = await fetch(chooseCategorie())
            if (!response.ok) {
                throw new Error("Failed to fetch movie data.")
            }
            const data = await response.json()
            const randomPuzzleIndex = Math.floor(
                Math.random() * data.items.length
            )
            const randomPuzzle = data.items[randomPuzzleIndex]?.title || ""
            const uppercasePuzzle = randomPuzzle.toUpperCase()
            setPuzzle(uppercasePuzzle)
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPuzzle()
    }, [])

    const activeLetters = guessedLetters.filter((letter) =>
        puzzle.includes(letter)
    )

    const incorrectLetters = guessedLetters.filter(
        (letter) => !puzzle.includes(letter)
    )

    const isLoser = incorrectLetters.length >= 6

    const isWinner =
        guessedLetters.length === 0
            ? false
            : puzzle
                  .split("")
                  .filter((letter) => ![":", "'", " "].includes(letter))
                  .every((filteredLetter) =>
                      guessedLetters.includes(filteredLetter)
                  )

    const addGuessedLetter = useCallback(
        (letter) => {
            if (!guessedLetters.includes(letter) && !isWinner && !isLoser) {
                setGuessedLetters((currentLetters) => [
                    ...currentLetters,
                    letter,
                ])
            }
            setCurrentLetter(letter)
        },

        [guessedLetters, isWinner, isLoser, playerTwoTurn, activeLetters]
    )

    useEffect(() => {
        const activeLettersNew = guessedLetters.filter((letter) =>
            puzzle.includes(letter)
        )
        if (!activeLetters.includes(currentLetter)) {
            setPlayerTwoTurn(!playerTwoTurn)
        }
        console.log(activeLettersNew.includes(currentLetter))
    }, [guessedLetters, currentLetter])

    useEffect(() => {
        const handleKeyDown = (e) => {
            const keyPressed = e.key.toUpperCase()

            if (/^[A-Z]$/.test(keyPressed) && !isWinner && !isLoser) {
                addGuessedLetter(keyPressed)
            }
        }

        window.addEventListener("keypress", handleKeyDown)

        return () => {
            window.removeEventListener("keypress", handleKeyDown)
        }
    }, [isWinner, isLoser, addGuessedLetter])

    const handleNextPuzzle = () => {
        setGuessedLetters([])
        setPuzzle("")
        setIsLoading(true)
        fetchPuzzle()
        setIsNextPuzzleClicked(true)
    }

    const handleQuit = () => {
        setIsHomePageButtonClicked(true)
        setShowLeaveGameModal(true)
    }

    const handleCancelAllModals = () => {
        setShowLeaveGameModal(false)
    }

    const handleSaveAndLeaveGame = () => {
        navigate("/")
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === "b") {
                setShowLeaveGameModal(true)
                setIsHomePageButtonClicked(true)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === "q") {
                handleNextPuzzle()
                setIsNextPuzzleClicked(true)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && isHomePageButtonClicked) e.preventDefault()
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isHomePageButtonClicked])

    return (
        <>
            <div className="pageContainer">
                <h1>Two Player Game Play</h1>
                <div className="playerInfoTP">
                    <div className={!playerTwoTurn ? "playerOneTurn" : ""}>
                        <PlayerInfoDisplay playerOne={true} />
                    </div>
                    <div className={playerTwoTurn ? "playerTwoTurn" : ""}>
                        <PlayerInfoDisplay playerTwo={true} />
                    </div>
                </div>
                <GamePlaySection
                    twoPlayer={true}
                    puzzle={puzzle}
                    isLoading={isLoading}
                    error={error}
                    guessedLetters={guessedLetters}
                    numberOfGuesses={incorrectLetters.length}
                    activeLetters={activeLetters}
                    inactiveLetters={incorrectLetters}
                    handleGuessedLetter={addGuessedLetter}
                    playerTwoTurn={playerTwoTurn}
                />
                <Footer
                    handleQuit={handleQuit}
                    handleNextPuzzle={handleNextPuzzle}
                />
                {showLeaveGameModal && (
                    <Modal
                        leaveGameModal={true}
                        handleCancelAllModals={handleCancelAllModals}
                        handleSaveAndLeaveGame={handleSaveAndLeaveGame}
                        handleQuit={handleQuit}
                    />
                )}
            </div>
        </>
    )
}

export default TwoPlayerGamePlay