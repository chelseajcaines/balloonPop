import styles from "/src/stylesheets/PlayerInfo.module.css"
import Avatar from "/src/components/Avatar"
import Button from "/src/components/Button"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { avatars } from "/src/data/const.js"

const PlayerInfo = ({ onButtonClick }) => {
    const [activeAvatar, setActiveAvatar] = useState(0)
    const [selectedAvatar, setSelectedAvatar] = useState("")
    const [avatarError, setAvatarError] = useState("")
    const [inputFocus, setInputFocus] = useState(false)
    const [inputError, setInputError] = useState("")
    const [inputValue, setInputValue] = useState("")

    const navigate = useNavigate()

    const inputRef = useRef(null)

    const handleMouseEnter = (avatarId) => {
        setActiveAvatar(avatarId)
    }

    const handleAvatarClick = (avatar) => {
        setSelectedAvatar(avatar)
        setAvatarError("")
        setInputFocus(true)
        inputRef.current.focus()
    }

    const handleInputChange = (e) => {
        setInputError("")
        setInputValue(e.target.value)
    }

    const handleNextPageClick = (e) => {
        e.preventDefault()
        if (!inputValue && !selectedAvatar) {
            setInputError("Please enter a name")
            setAvatarError("Please select avatar")
        } else if (!selectedAvatar && inputValue) {
            setAvatarError("Please select avatar")
            setInputError("")
        } else if (selectedAvatar && !inputValue) {
            setAvatarError("")
            setInputError("Please enter a name")
        } else {
            setInputError("")
            setAvatarError("")
            localStorage.setItem("AVATAR_KEY", JSON.stringify(selectedAvatar))
            navigate(`/SinglePlayer/Categories?name=${inputValue}`)
        }
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight" && !inputFocus) {
                const currentIndex = avatars.findIndex(
                    (avatar) => avatar.id === activeAvatar
                )
                const newIndex = currentIndex + 1
                if (newIndex < avatars.length) {
                    setActiveAvatar(avatars[newIndex].id)
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [activeAvatar, avatars])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                const currentIndex = avatars.findIndex(
                    (avatar) => avatar.id === activeAvatar
                )
                const newIndex = currentIndex - 1
                setActiveAvatar(avatars[newIndex].id)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [activeAvatar, avatars])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && activeAvatar !== "") {
                const selected = avatars.find(
                    (avatar) => avatar.id === activeAvatar
                )
                if (selected) {
                    setSelectedAvatar(selected)
                }
                setAvatarError("")
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [activeAvatar])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowDown" && selectedAvatar) {
                inputRef.current.focus()
                setActiveAvatar("")
                setInputFocus(true)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [selectedAvatar])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight" && inputFocus) {
                setActiveAvatar("")
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [inputFocus])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" && inputFocus) {
                setActiveAvatar("")
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [inputFocus])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowUp" && inputFocus) {
                setActiveAvatar(avatars[0].id)
                setInputFocus(false)
                inputRef.current.blur()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [inputFocus, avatars])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && inputFocus) {
                setInputError("Please enter a name")
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [inputFocus])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && inputFocus && inputValue) {
                setInputError("")
                localStorage.setItem(
                    "AVATAR_KEY",
                    JSON.stringify(selectedAvatar)
                )
                navigate(`/SinglePlayer/Categories?name=${inputValue}`)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [inputFocus, inputValue, selectedAvatar, navigate])

    return (
        <>
            <p className={styles.title}>Choose your avatar</p>

            <div className={styles.avatarGallery}>
                {avatars.map((avatar) => (
                    <Avatar
                        key={avatar.id}
                        src={avatar.src}
                        alt={avatar.alt}
                        onMouseEnter={() => handleMouseEnter(avatar.id)}
                        onClick={() => handleAvatarClick(avatar)}
                        className={
                            avatar.id === activeAvatar
                                ? styles.activeAvatar
                                : styles.avatar
                        }
                    />
                ))}
            </div>

            <div className={styles.selectedAvatarContainer}>
                {selectedAvatar && (
                    <img
                        className={styles.selectedAvatar}
                        src={selectedAvatar.src}
                        alt={selectedAvatar.alt}
                    />
                )}
            </div>

            <p style={{ color: "red" }} className={styles.title}>
                {avatarError}
            </p>

            <p className={styles.title}>Enter name</p>

            <div className={styles.input}>
                <input
                    type="text"
                    onChange={handleInputChange}
                    ref={inputRef}
                />
            </div>

            <p style={{ color: "red" }} className={styles.title}>
                {inputError}
            </p>

            <div className={styles.buttonContainer}>
                <Button
                    text="Next"
                    onClick={onButtonClick || handleNextPageClick}
                />
            </div>
        </>
    )
}

export default PlayerInfo