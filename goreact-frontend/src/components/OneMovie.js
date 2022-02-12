import React, {Fragment, useEffect, useState} from "react";
import axios from "axios";

const OneMovie = (props) => {
    const [loading, setLoading] = useState(false);
    const [movie, setMovie] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async (props) => {
            try {
                const res = await axios.get("http://localhost:4000/v1/movie/" + props.match.params.id);
                setMovie(res.data.movie);
            } catch (e) {
                setError(new Error(e).message);
            }
        };
        setLoading(true);
        fetchMovie(props);
        setLoading(false);
    }, [props]);

    if (error) {
        return <div className="movies row">{error}</div>;
    }
    if (movie.genres) {
        movie.genres = Object.values(movie.genres)
    }else {
        movie.genres = []
    }
    return (
        loading ? (<div>Loading...</div>)
            : (
                <Fragment>
                    <h2>Movie: {movie.title} ({movie.year})</h2>
                    <div className="float-start">
                        <small>Rating: {movie.mpaa_rating}</small>
                    </div>
                    <div className="float-end">
                        {movie.genres.map((m,i) => (
                            <span className="badge bg-secondary me-1" key={i}>
                                {m}
                            </span>
                        ))}
                    </div>
                    <div className="clearfix"></div>
                    <hr />
                    <table className="table table-compact table-striped">
                        <thead></thead>
                        <tbody>
                        <tr>
                            <td><strong>Title:</strong></td>
                            <td>{movie.title}</td>
                        </tr>
                        <tr>
                            <td><strong>Description:</strong></td>
                            <td>{movie.description}</td>
                        </tr>
                        <tr>
                            <td><strong>Run time</strong></td>
                            <td>{movie.runtime} minutes</td>
                        </tr>
                        </tbody>
                    </table>
                < /Fragment>
            )
    )
}

export default OneMovie