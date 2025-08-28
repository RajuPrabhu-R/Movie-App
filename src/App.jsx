import React, { useEffect, useState } from "react";
import MovieDetails from "./components/MovieDetails";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Fetch data helper
const fetchMovies = async (endpoint) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}&api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

// Movie card component
const MovieCard = ({ movie, onClick }) => (
  <div
    className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition"
    onClick={() => onClick(movie)}
  >
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title || movie.name}
      className="w-full h-64 object-cover"
    />
    <p className="text-sm mt-2 truncate">{movie.title || movie.name}</p>
  </div>
);

// Horizontal scroll row
const MovieRow = ({ title, movies, onClick }) => (
  <section className="mt-8">
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {movies.map((movie) => (
        <div className="min-w-[160px] flex-shrink-0" key={movie.id}>
          <MovieCard movie={movie} onClick={onClick} />
        </div>
      ))}
    </div>
  </section>
);

// Main App Component
const App = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trending, setTrending] = useState([]);
  const [tv, setTv] = useState([]);
  const [netflix, setNetflix] = useState([]);
  const [prime, setPrime] = useState([]);
  const [apple, setApple] = useState([]);
  const [disney, setDisney] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const trendingData = await fetchMovies("/trending/movie/week?");
      const tvData = await fetchMovies("/tv/popular?");
      const netflixData = await fetchMovies("/discover/tv?with_networks=213");
      const primeData = await fetchMovies("/discover/tv?with_networks=1024");
      const appleData = await fetchMovies("/discover/tv?with_networks=2552");
      const disneyData = await fetchMovies("/discover/tv?with_networks=2739");

      setTrending(trendingData);
      setTv(tvData);
      setNetflix(netflixData);
      setPrime(primeData);
      setApple(appleData);
      setDisney(disneyData);
    };

    loadData();
  }, []);

  // Auto-rotate hero banner
  useEffect(() => {
    if (!trending.length) return;

    setHeroMovie(trending[heroIndex]);

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % trending.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [trending, heroIndex]);

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const res = await fetch(
      `${API_BASE_URL}/search/multi?query=${encodeURIComponent(
        searchTerm
      )}&page=1&api_key=${API_KEY}`
    );
    const data = await res.json();
    setSearchResults(data.results || []);
    setSearchPage(1);
    setTotalPages(data.total_pages || 1);
  };

  // Load more search results
  const loadMoreSearchResults = async () => {
    const nextPage = searchPage + 1;
    const res = await fetch(
      `${API_BASE_URL}/search/multi?query=${encodeURIComponent(
        searchTerm
      )}&page=${nextPage}&api_key=${API_KEY}`
    );
    const data = await res.json();
    setSearchResults((prev) => [...prev, ...(data.results || [])]);
    setSearchPage(nextPage);
  };

  // If a movie is selected → show MovieDetails page
  if (selectedMovie) {
    return (
      <MovieDetails
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    );
  }

  // Otherwise → show home view
  return (
    <main className="min-h-screen bg-dark text-white">
      {/* Hero Banner */}
      {heroMovie && (
        <div
          className="relative h-[70vh] flex items-end bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="relative p-6">
            <h1 className="text-4xl font-bold">{heroMovie.title}</h1>
            <p className="mt-2 max-w-xl text-sm text-gray-300 line-clamp-3">
              {heroMovie.overview}
            </p>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setSelectedMovie(heroMovie)}
            >
              Play
            </button>
          </div>
          {/* Manual Controls */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4">
            <button
              onClick={() =>
                setHeroIndex(
                  (heroIndex - 1 + trending.length) % trending.length
                )
              }
              className="bg-black/50 px-3 py-2 rounded-full"
            >
              ◀
            </button>
            <button
              onClick={() => setHeroIndex((heroIndex + 1) % trending.length)}
              className="bg-black/50 px-3 py-2 rounded-full"
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="max-w-3xl mx-auto my-6 flex gap-2 px-4"
      >
        <input
          type="text"
          placeholder="Search movies or TV shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Search
        </button>
      </form>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {searchResults.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-2xl font-bold mb-4">
              Search Results for "{searchTerm}"
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={setSelectedMovie}
                />
              ))}
            </div>
            {searchPage < totalPages && (
              <div className="flex justify-center my-6">
                <button
                  onClick={loadMoreSearchResults}
                  className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            <MovieRow
              title="Trending Movies"
              movies={trending}
              onClick={setSelectedMovie}
            />
            <MovieRow
              title="TV Shows"
              movies={tv}
              onClick={setSelectedMovie}
            />
            <MovieRow
              title="Netflix Originals"
              movies={netflix}
              onClick={setSelectedMovie}
            />
            <MovieRow
              title="Amazon Prime"
              movies={prime}
              onClick={setSelectedMovie}
            />
            <MovieRow
              title="Apple TV+"
              movies={apple}
              onClick={setSelectedMovie}
            />
            <MovieRow
              title="Disney+"
              movies={disney}
              onClick={setSelectedMovie}
            />
          </>
        )}
      </div>
    </main>
  );
};

export default App;
