import React, { useState, useEffect } from "react";
import MovieDetails from "./MovieDetails"; // <-- import your component

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(
        `${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`
      );
      const data = await res.json();
      setMovies(data.results || []);
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Trending Movies</h1>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition"
            onClick={() => setSelectedMovie(movie)} // <-- open modal
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <p className="p-2 text-center truncate">{movie.title}</p>
          </div>
        ))}
      </div>

      {/* MovieDetails Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;