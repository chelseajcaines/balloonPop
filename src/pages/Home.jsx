import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { homeButtons } from "../data/const"
import sun from "/src/assets/sun.png"
import moon from "/src/assets/moon.png"
import noSound from "/src/assets/noSound.png"
import sound from "/src/assets/sound.png"
import balloon from "/src/assets/balloon.png"
import twoBalloons from "/src/assets/twoBalloons.png"
import ribbon from "/src/assets/ribbon.png"
import title from "/src/assets/title.png"
import Button from "/src/components/Button"
import Modal from "../components/Modal"
import Leaderboard from "/src/components/Leaderboard.jsx"
import buttonClick from "/src/assets/buttonHover.flac"
import { Howl } from "howler"
import "/src/App.css"

const Home = () => {
    const buttonClickSound = new Howl({
        src: buttonClick,
    })

    const navigate = useNavigate()

    const [isActive, setIsActive] = useState(0)
    const [showLeaderBoardModal, setShowLeaderBoardModal] = useState(false)
    const [isLeaderBoardButtonClicked, setIsLeaderBoardButtonClicked] =
        useState(false)
    const [isDarkMode, setIsDarkMode] = useState(getInitialMode())
    const [showAboutMeModal, setShowAboutMeModal] = useState(false)
    const [soundOn, setSoundOn] = useState(true)
    const [isMaxWidth649, setIsMaxWidth649] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMaxWidth649(window.innerWidth <= 649) // Adjust threshold as needed
        }

        // Set initial size
        handleResize()

        // Add event listener to handle window resize
        window.addEventListener("resize", handleResize)

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("dark", JSON.stringify(isDarkMode))
    }, [isDarkMode])

    function getInitialMode() {
        const savedMode = JSON.parse(localStorage.getItem("dark"))
        return (
            savedMode ||
            window.matchMedia("(prefers-color-scheme: dark)").matches
        )
    }

    useEffect(() => {
        const savedSoundSetting = localStorage.getItem("SOUND_EFFECT_KEY")
        if (savedSoundSetting !== null) {
            setSoundOn(JSON.parse(savedSoundSetting))
        }
    }, [])

    const toggleSound = () => {
        setSoundOn(!soundOn)
        localStorage.setItem("SOUND_EFFECT_KEY", JSON.stringify(!soundOn))
    }

    const playSoundEffect = () => {
        if (soundOn) {
            buttonClickSound.play()
        }
    }

    function toggleDarkMode() {
        setIsDarkMode((prevMode) => !prevMode)
        playSoundEffect()
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && isLeaderBoardButtonClicked)
                e.preventDefault()
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isLeaderBoardButtonClicked])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                playSoundEffect()
                const currentIndex = homeButtons.findIndex(
                    (button) => button.id === isActive
                )
                let nextIndex

                if (e.key === "ArrowRight") {
                    nextIndex =
                        currentIndex < homeButtons.length - 1
                            ? currentIndex + 1
                            : currentIndex
                } else if (e.key === "ArrowLeft") {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : 0
                }

                setIsActive(homeButtons[nextIndex].id)
            } else if (e.key === "Enter") {
                e.preventDefault()
                const currentIndex = homeButtons.findIndex(
                    (button) => button.id === isActive
                )
                if (currentIndex === 2) {
                    setShowLeaderBoardModal(true)
                    setIsLeaderBoardButtonClicked(true)
                } else {
                    playSoundEffect()
                    navigate(homeButtons[currentIndex].nextPage)
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isActive, navigate, soundOn])

    useEffect(() => {
        const handleKeyDown = (e) => {
            playSoundEffect()
            if (showLeaderBoardModal && e.key === "Enter") {
                setShowLeaderBoardModal(false)
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [showLeaderBoardModal, soundOn])

    const handleMouseEnter = (buttonId) => {
        setIsActive(buttonId)
    }

    const handleDisplayLeaderBoard = () => {
        playSoundEffect()
        setShowLeaderBoardModal(true)
        setIsLeaderBoardButtonClicked(true)
    }

    const handleClickAboutMe = () => {
        playSoundEffect()
        setShowAboutMeModal(true)
    }

    const handleCancelAndPlaySound = () => {
        playSoundEffect()
        setShowLeaderBoardModal(false)
        setShowAboutMeModal(false)
    }

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark-mode")
        } else {
            document.body.classList.remove("dark-mode")
        }
    }, [isDarkMode])

    return (
        <>
            <div className="pageContainer">
                <div className="headerHome">
                    <img
                        src={title}
                        alt="Balloon Pop"
                        className="titleImageHome"
                    />
                </div>
                <div className="imagesContainer">
                    <div className="imageContainer">
                        <img
                            src={balloon}
                            alt="balloon"
                            className="balloonOne"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/SinglePlayer/Info")}
                        />
                    </div>
                    <div className="imageContainer">
                        <img
                            src={twoBalloons}
                            alt="twoBalloons"
                            className="balloonTwo"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/TwoPlayer/Info")}
                        />
                    </div>
                    <div className="imageContainer">
                        <img
                            src={ribbon}
                            alt="ribbon"
                            className="ribbonImg"
                            style={{ cursor: "pointer" }}
                            onClick={handleDisplayLeaderBoard}
                        />
                    </div>
                </div>
                <div className="buttonsContainer">
                    {homeButtons.map((button) => (
                        <div className="innerButtonContainer">
                            <Button
                                key={button.id}
                                text={button.text}
                                onClick={() => {
                                    if (button.id === 2) {
                                        handleDisplayLeaderBoard()
                                    } else {
                                        navigate(button.nextPage)
                                        playSoundEffect()
                                    }
                                }}
                                isActive={button.id === isActive}
                                onMouseEnter={() => handleMouseEnter(button.id)}
                            />
                        </div>
                    ))}
                </div>

                <div
                    className={
                        !isMaxWidth649 ? "footerHome" : "footerHomeTwoPlayer"
                    }
                >
                    <div
                        className={
                            !isMaxWidth649 ? "imgWrapper" : "imgWrapperGamePlay"
                        }
                    >
                        <img
                            src={soundOn ? sound : noSound}
                            alt="sound ON/OFF"
                            className={
                                !isMaxWidth649 ? "innerImg" : "innerImgGamePlay"
                            }
                            onClick={toggleSound}
                        />
                    </div>
                    <button
                        className={
                            !isMaxWidth649
                                ? "aboutMeButton"
                                : "aboutMeButtonGamePlay"
                        }
                        onClick={handleClickAboutMe}
                    >
                        CLICK ME!
                    </button>

                    <div
                        className={
                            !isMaxWidth649 ? "imgWrapper" : "imgWrapperGamePlay"
                        }
                    >
                        <img
                            src={isDarkMode ? sun : moon}
                            alt="dark mode"
                            className={
                                !isMaxWidth649 ? "innerImg" : "innerImgGamePlay"
                            }
                            onClick={toggleDarkMode}
                        />
                    </div>
                </div>
                {showLeaderBoardModal && (
                    <div>
                        <Modal
                            leaderboardModal={true}
                            handleCancelAllModals={handleCancelAndPlaySound}
                            leaderboard={<Leaderboard />}
                        />
                    </div>
                )}
                {showAboutMeModal && (
                    <div>
                        <Modal
                            aboutMe={true}
                            handleCancelAllModals={() =>
                                setShowAboutMeModal(false)
                            }
                            isDarkMode={isDarkMode}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default Home
