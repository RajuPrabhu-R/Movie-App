// App.jsx
import React, { useEffect, useState, Suspense } from "react";
import { useDebounce } from "react-use";

// Lazy load MovieDetails component
const MovieDetails = React.lazy(() => import("./components/MovieDetails.jsx"));

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
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useDebounce(() => {
    setCurrentPage(1);
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const endpoint = debouncedSearchTerm
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
              debouncedSearchTerm
            )}&page=${currentPage}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${currentPage}`;

        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();
        if (data.results?.length === 0) {
          setErrorMessage("No movies found.");
          setMovieList([]);
          return;
        }

        setMovieList(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Failed to fetch movies.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedSearchTerm, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <main className="p-6 max-w-screen-xl mx-auto">
      <header className="mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
        />
      </header>

      <Suspense fallback={<p className="text-white">Loading movie details...</p>}>
        {selectedMovie && (
          <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}
      </Suspense>

      <section>
        <h2 className="text-2xl font-bold mb-4">All Movies</h2>

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {movieList.map((movie) => (
                <li key={movie.id}>
                  <MovieCard
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)}
                  />
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="pagination mt-10 flex flex-wrap justify-center items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages > 5 ? 5 : totalPages }).map((_, index) => {
                let page = index + 1;

                if (currentPage > 3 && totalPages > 5) {
                  if (currentPage + 2 <= totalPages) {
                    page = currentPage - 2 + index;
                  } else {
                    page = totalPages - 4 + index;
                  }
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage + 2 < totalPages && (
                <>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default App;
