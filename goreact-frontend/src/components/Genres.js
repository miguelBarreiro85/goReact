import React, {useState, useEffect, Fragment} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const Genres = () => {
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await axios.get("http://localhost:4000/v1/genres");
                setGenres(res.data.genres);
            } catch (e) {
                setError(new Error(e).message);
            }
        };
        setLoading(true);
        fetchGenres();
        setLoading(false);
    }, []);

    if (error) {
        return <h2>Erro: {error.message}</h2>
    }
    return loading ?
        (<h2>Loading...</h2>)
        :
        (
            <Fragment>
                <h2>Genres</h2>
                <div className="list-group">
                    {genres.map(m => (
                        <Link key={m.id} className="list-group-item list-group-item-action"
                              to={{
                                  pathname: `/genre/${m.id}`,
                                  genreName: m.genre_name
                              }}
                        >{m.genre_name}</Link>
                    ))}
                </div>
            </Fragment>
        )
}

export default Genres