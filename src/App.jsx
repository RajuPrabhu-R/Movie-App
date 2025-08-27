import { useEffect, useState, Suspense } from "react";
import { useDebounce } from "react-use";
import Spinner from "./components/Spinner.jsx";
import Search from "./components/Search.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import MovieRowScroll from "./components/MovieRowScroll.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);

  // Debounce
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Fetch movies
  const fetchMovies = async (query = "", page = 1) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&page=${page}&api_key=${API_KEY}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}&api_key=${API_KEY}`;

      const response = await fetch(endpoint);

      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();

      setMovieList((prev) =>
        page === 1 ? data.results : [...prev, ...data.results]
      );
    } catch (err) {
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on search term
  useEffect(() => {
    setPage(1);
    fetchMovies(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm]);

  return (
    <main className="min-h-screen bg-gray-900 text-white relative z-0">
      <div className="wrapper max-w-6xl mx-auto p-4">
        {/* Search Box */}
        <header className="relative z-50">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Movie Details Modal */}
        <Suspense fallback={<p className="text-white">Loading Movie Details...</p>}>
          {selectedMovie && (
            <MovieDetails
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
            />
          )}
        </Suspense>

        {/* Search Results */}
        {debouncedSearchTerm && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-2">
              Search Results for "{debouncedSearchTerm}"
            </h2>

            {isLoading && page === 1 ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : movieList.length > 0 ? (
              <>
                {/* ✅ Horizontal scroll row instead of grid */}
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                  {movieList.map((movie) => (
                    <div
                      key={movie.id}
                      className="w-40 flex-shrink-0 cursor-pointer"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="rounded-lg object-cover w-full h-56"
                      />
                      <p className="text-xs mt-1">{movie.title}</p>
                    </div>
                  ))}
                </div>

                {/* ✅ Load More button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      fetchMovies(debouncedSearchTerm, nextPage);
                    }}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              </>
            ) : (
              <p>No results found.</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default App;
