import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

const Movies = () => {
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get("http://localhost:4000/v1/movies");
                setMovies(res.data.movies);
            } catch (e) {
                setError(new Error(e).message);
            }
        };
        setLoading(true);
        fetchMovies();
        setLoading(false);
    }, []);

    if (error) {
        return <div className="movies row">{error}</div>;
    }

    return (
        <div className="movies row">
            <h2>Movies</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="list-group">
                    {movies.map(({id, title}) => (
                        <Link to={`/movies/${id}`} key={id}
                              className="list-group-item list-group-item-action">{title}</Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Movies;