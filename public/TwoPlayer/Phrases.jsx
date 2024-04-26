import "/src/App.css"
import TwoPlayerGamePlay from "../TwoPlayerGamePlay"

const TwoPlayerPhrases = () => {
    return (
        <>
            <div className="pageContainer">
                <TwoPlayerGamePlay phrases={true} text="Phrases" />
            </div>
        </>
    )
}

export default TwoPlayerPhrases
