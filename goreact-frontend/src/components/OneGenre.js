import React, {Fragment, useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

const OneGenre = (props) => {
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [genreName, setGenreName] = useState('')

    useEffect(() => {
        const fetchMovies = async (props) => {
            try {
                const res = await axios.get("http://localhost:4000/v1/movies/" + props.match.params.id);
                if (res.data.movies) {
                    setMovies(res.data.movies);
                }
            } catch (e) {
                setError(new Error(e).message);
            }
        };
        setLoading(true);
        fetchMovies(props);
        setGenreName(props.location.genreName)
        setLoading(false);
    }, [props]);

    if (error) {
        return <div className="movies row">{error}</div>;
    }
    return (
        <div className="movies row">
            <h2>Genre: {genreName}</h2>
            {loading ? (
                <div>Loading ...</div>
            ) : (
                <div className="list-group">
                    {movies.map(({id, title}, i) => (
                        <Link to={`/movies/${id}`} className="list-group-item list-group-item-action"
                              key={i}>{title}</Link>
                    ))}
                </div>
            )}
        </div>
    );

}

export default OneGenre