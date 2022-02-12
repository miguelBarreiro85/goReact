import React, {ChangeEvent, FormEvent, FormEventHandler, Fragment, SyntheticEvent, useEffect, useState} from "react";
import './EditMovie.css'
import axios from "axios";
import Input from "./form-components/Input";
import TextArea from "./form-components/TextArea";
import Select from "./form-components/Select";
import {Movie, Option} from "../interfaces/Interfaces";
import {RouteComponentProps} from "react-router-dom";

type Params = { id: string }

const EditMovie = (props : RouteComponentProps<Params>) => {
    const mpaaOtions : Option[] = [
        {id: "G", value: "G"},
        {id: "PG", value: "PG"},
        {id: "PG13", value: "PG13"},
        {id: "R", value: "R"},
        {id: "NC17", value: "NC17"},
    ]
    const [loading, setLoading] = useState<boolean>(false);
    const [movie, setMovie] = useState<Movie>({
        id: "0",
        title: "",
        release_date: null,
        runtime: 0,
        rating: "",
        description: "",
        mpaa_rating: ""
    });
    const [error, setError] = useState<Error | null>(null)
    const [errors,setErrors] =  useState<string[]>([])

    useEffect(() => {
        const fetchMovie = async (props : RouteComponentProps<Params>) => {
            try {
                const res = await axios.get("http://localhost:4000/v1/movie/" + props.match.params.id);
                if (res.status !== 200) {
                    const err = new Error()
                    err.message = "Invalid response code: " + res.status
                    setError(err)
                } else {
                    const movie = res.data.movie
                    const releaseDate = new Date(movie.release_date)
                    setMovie(
                        {
                            id: props.match.params.id,
                            title: movie.title,
                            release_date: releaseDate,
                            runtime: movie.runtime,
                            mpaa_rating: movie.mpaa_rating,
                            rating: movie.rating,
                            description: movie.description
                        });
                }

            } catch (e) {
                // @ts-ignore
                setError(new Error(e.message));
            }
        };
        //converter string para number
        if (+props.match.params.id > 0) {
            setLoading(true);
            fetchMovie(props);
            setLoading(false);
        }
    }, [props]);

    const isFormValid = () => {
        const updatedErrors : string[]= []
        Object.keys(movie).forEach(key => {
            switch (key){
                case "release_date":
                    if(movie.release_date === null) {
                        updatedErrors.push("release_date")
                    }
                    break
                case "runtime":
                    if(movie.runtime === 0) {
                        updatedErrors.push("runtime")
                    }
                    break
                default:
                    // @ts-ignore
                    if(movie[key] === "") {
                        updatedErrors.push(key)
                    }
                    break
            }
        })
        setErrors(updatedErrors)
        if(errors.length > 0) {
            return false
        }
        return true
    }
    const handleSubmit = async (e : SyntheticEvent<HTMLFormElement>  ) => {
        e.preventDefault()
        if (!isFormValid()) {
            return false
        }

        // @ts-ignore
        const data = new FormData(e.target)
        const payload = Object.fromEntries(data.entries())
        const res = await axios.post('http://localhost:4000/v1/admin/editmovie', payload)
        console.log(res.data)
    }

    const handleChange = (e : ChangeEvent<any>) => {
        let value = e.target.value
        let name = e.target.name
        if (e.target.name === "release_date") {
            value = new Date(value)
        }
        setMovie(prevMovie => ({
            ...prevMovie,
            [name]: value
        }))
    }

    const hasError = (key : string) => {
        return errors.indexOf(key) !== -1
    }
    if(error) {
        return <div>ERROR: {error.message}</div>
    }
    return (
        <Fragment>
            <h2>Add/Edit Movie</h2>
            <hr/>
            {loading ? <h2>Loading</h2>
                : (
                    <Fragment>
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="id" id="id" value={movie.id} onChange={handleChange}/>

                            <Input title="Title" type="text" name="title" value={movie.title}
                                   handleChange={handleChange} className={hasError("title") ? "is-invalid" : ""}
                                   errorDiv={hasError("title") ? "text-danger" : "d-none"}
                                   errorMsg = {"Please enter a title"}
                            />

                            <Input title="Release Date" type="date" name="release_date" value={movie.release_date ? movie.release_date.toISOString().split("T")[0] : "" }
                                   handleChange={handleChange} className={hasError("release_date") ? "is-invalid" : ""}
                                   errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                                   errorMsg = {"Please enter a Release Date"}/>

                            <Input title="Run Time" type="text" name="runtime" value={movie.runtime}
                                   handleChange={handleChange} className={hasError("runtime") ? "is-invalid" : ""}
                                   errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                                   errorMsg = {"Please enter the runtime"}/>

                            <Select title="MPAA Rating"
                                    name={"mpaa_rating"}
                                    options={mpaaOtions}
                                    value={movie.mpaa_rating}
                                    handleChange={handleChange}
                                    placeholder="Choose..."
                                    className={hasError("mpaa_rating") ? "is-invalid" : ""}
                                    errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                                    errorMsg = {"Please enter the MPAA Rating"}
                            />

                            <Input
                                title="Rating"
                                type="text"
                                name="rating"
                                value={movie.rating}
                                handleChange={handleChange}
                                className={hasError("rating") ? "is-invalid" : ""}
                                errorDiv={hasError("rating") ? "text-danger" : "d-none"}
                                errorMsg = {"Please enter the rating"}
                            />

                            <TextArea
                                title="Description"
                                name="description"
                                value={movie.description}
                                rows={3}
                                handleChange={handleChange}
                                className={hasError("description") ? "is-invalid" : ""}
                                errorDiv={hasError("description") ? "text-danger" : "d-none"}
                                errorMsg = {"Please enter the description"}
                            />

                            <button className="btn btn-primary">Save</button>

                        </form>
                        {/*<div className="mt-3">*/}
                        {/*    <pre>{JSON.stringify({...movie, ...loading, ...error})}</pre>*/}
                        {/*</div>*/}
                    </Fragment>

                )
            }
        </Fragment>
    )
}

export default EditMovie