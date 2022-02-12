package models

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

type DBModel struct {
	DB *sql.DB
}

//Get returns one movie and error if any
func (m *DBModel) Get(id int) (*Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, title, description, year, release_date, rating, runtime, mpaa_rating, created_at, updated_at
				from movies
				where id = $1`
	row := m.DB.QueryRowContext(ctx, query, id)

	var movie Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.Description,
		&movie.Year,
		&movie.ReleaseDate,
		&movie.Rating,
		&movie.Runtime,
		&movie.MPAARating,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	genres, _ := getGenres(id, m)

	movie.MovieGenre = genres
	return &movie, nil
}

//Get returns all movies and error if any
func (m *DBModel) All(genre ...int) ([]*Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	where := ""
	if len(genre) > 0 {
		where = fmt.Sprintf("where id in (select movie_id from movies_genres where genre_id = %d)", genre[0])
	}

	query := fmt.Sprintf(`select id, title, description, year, release_date, rating, runtime, mpaa_rating, created_at, updated_at
				from movies
				%s
				order by title`, where)
	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*Movie
	for rows.Next() {
		var movie Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.Description,
			&movie.Year,
			&movie.ReleaseDate,
			&movie.Rating,
			&movie.Runtime,
			&movie.MPAARating,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		genres, _ := getGenres(movie.ID, m)
		movie.MovieGenre = genres
		movies = append(movies, &movie)
	}
	return movies, nil
}

func getGenres(mId int, m *DBModel) (map[int]string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `select mg.id, mg.movie_id, mg.genre_id, g.genre_name
			from movies_genres mg
			left join genres g on (g.id = mg.genre_id) 
			where mg.movie_id = $1`
	rows, err := m.DB.QueryContext(ctx, query, mId)
	defer rows.Close()
	if err != nil {
		return nil, err
	}

	genres := make(map[int]string)
	for rows.Next() {
		var mg MovieGenre
		err := rows.Scan(
			&mg.ID,
			&mg.MovieID,
			&mg.GenreID,
			&mg.Genre.GenreName,
		)
		if err != nil {
			return nil, err
		}
		genres[mg.ID] = mg.Genre.GenreName
	}
	return genres, err
}

func (m *DBModel) GenresAll() ([]*Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query :=
		`select id, genre_name, created_at, updated_at
			from genres
		order by genre_name`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*Genre
	for rows.Next() {
		var g Genre
		err := rows.Scan(
			&g.ID,
			&g.GenreName,
			&g.CreatedAt,
			&g.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, &g)
	}
	return genres, nil
}