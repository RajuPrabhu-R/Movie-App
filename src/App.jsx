import { useEffect, useState, Suspense, useRef } from "react";
import { useDebounce } from "react-use";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "./components/Spinner.jsx";
import Search from "./components/Search.jsx";
import MovieDetails from "./components/MovieDetails.jsx";

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

  // Home page rows
  const [trending, setTrending] = useState([]);
  const [netflix, setNetflix] = useState([]);
  const [prime, setPrime] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);

  // Debounce search
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Fetch movies (search)
  const fetchMovies = async (query = "", page = 1) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&page=${page}&api_key=${API_KEY}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}&api_key=${API_KEY}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch movies");

      const data = await res.json();
      setMovieList((prev) =>
        page === 1 ? data.results : [...prev, ...data.results]
      );
    } catch (err) {
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch homepage rows
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [trendingRes, netflixRes, primeRes, actionRes] =
          await Promise.all([
            fetch(`${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`),
            fetch(
              `${API_BASE_URL}/discover/movie?with_networks=213&api_key=${API_KEY}`
            ), // Netflix
            fetch(
              `${API_BASE_URL}/discover/movie?with_networks=1024&api_key=${API_KEY}`
            ), // Prime
            fetch(
              `${API_BASE_URL}/discover/movie?with_genres=28&api_key=${API_KEY}`
            ), // Action
          ]);

        const trendingData = await trendingRes.json();
        const netflixData = await netflixRes.json();
        const primeData = await primeRes.json();
        const actionData = await actionRes.json();

        setTrending(trendingData.results || []);
        setNetflix(netflixData.results || []);
        setPrime(primeData.results || []);
        setActionMovies(actionData.results || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHomeData();
  }, []);

  // Fetch on search
  useEffect(() => {
    setPage(1);
    fetchMovies(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm]);

  // ✅ Hero Row (Top Section Horizontal Scroll)
  const HeroRow = ({ movies }) => {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: dir === "left" ? -600 : 600,
          behavior: "smooth",
        });
      }
    };

    if (!movies.length) return null;

    return (
      <section className="relative mb-12">
        {/* Left/Right buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-3 rounded-full hover:bg-black"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-3 rounded-full hover:bg-black"
        >
          <ChevronRight size={28} />
        </button>

        {/* Horizontal Hero Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="min-w-[80%] md:min-w-[60%] relative cursor-pointer"
              onClick={() => setSelectedMovie(movie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="rounded-2xl object-cover w-full h-[400px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl flex items-end p-6">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold">{movie.title}</h2>
                  <p className="text-sm line-clamp-2 max-w-lg">{movie.overview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // ✅ Reusable Horizontal Scroll Row
  const MovieRow = ({ title, movies, isTrending = false }) => {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: dir === "left" ? -500 : 500,
          behavior: "smooth",
        });
      }
    };

    return (
      <section className="mb-10 relative">
        <div className="flex items-center justify-between mb-2">
          {isTrending ? (
            <motion.div
              className="text-2xl font-bold text-yellow-400 whitespace-nowrap overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {title}
            </motion.div>
          ) : (
            <h2 className="text-2xl font-bold">{title}</h2>
          )}
        </div>

        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black"
        >
          <ChevronRight size={24} />
        </button>

        {/* Movie Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-2"
        >
          {movies.map((movie) => (
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
              <p className="text-xs mt-1 truncate">{movie.title}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white relative z-0">
      <div className="wrapper max-w-6xl mx-auto p-4">
        {/* Search */}
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
        {debouncedSearchTerm ? (
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
                {/* ✅ Horizontal scroll for search results */}
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

                {/* Load More */}
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
        ) : (
          <>
            {/* ✅ Hero Top Scroll Section */}
            <HeroRow movies={trending} />

            {/* ✅ Homepage Rows */}
            <MovieRow title="Trending Movies" movies={trending} isTrending />
            <MovieRow title="Netflix Movies" movies={netflix} />
            <MovieRow title="Prime Movies" movies={prime} />
            <MovieRow title="Action Movies" movies={actionMovies} />
          </>
        )}
      </div>
    </main>
  );
};

export default App;
