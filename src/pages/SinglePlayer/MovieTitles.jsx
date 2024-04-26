import SinglePlayerGamePlay from "/SinglePlayerGamePlay.jsx"
import "/src/App.css"

const SinglePlayerMovieTitles = () => {
    return (
        <>
            <div className="pageContainer">
                <SinglePlayerGamePlay
                    movieTitles={true}
                    text={"Movie Titles"}
                />
            </div>
        </>
    )
}

export default SinglePlayerMovieTitles
