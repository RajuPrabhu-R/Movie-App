import React, { useEffect, useState, Suspense } from "react";
import { useDebounce } from "react-use";

// Lazy load MovieDetails
const MovieDetails = React.lazy(() => import("./components/MovieDetails.jsx"));

// Components (ensure these files exist)
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";

// TMDb API setup
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);

  // Debounce input
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Fetch movies
  const fetchMovies = async (query = "", page = 1) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&api_key=${API_KEY}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}&api_key=${API_KEY}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      setMovieList((prev) =>
        page === 1 ? data.results : [...prev, ...data.results]
      );
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when search term changes
  useEffect(() => {
    setPage(1);
    fetchMovies(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm]);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="wrapper max-w-5xl mx-auto p-4">
        <header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <Suspense fallback={<p className="text-white">Loading Movie Details...</p>}>
            {selectedMovie && (
              <MovieDetails
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
              />
            )}
          </Suspense>

          <h2 className="mt-10 text-2xl font-bold">All Movies</h2>

          {isLoading && page === 1 ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </ul>
          )}

          {movieList.length > 0 && !isLoading && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchMovies(debouncedSearchTerm, nextPage);
                }}
                className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
