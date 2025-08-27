import React, { useEffect, useState } from "react";
import MovieDetails from "./components/MovieDetails";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// ✅ Reusable fetcher
const fetchMovies = async (endpoint) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}&api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

// ✅ Search component
const Search = ({ searchTerm, setSearchTerm }) => (
  <div className="flex justify-center my-6">
    <input
      type="text"
      placeholder="Search movies..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// ✅ Movie card
const MovieCard = ({ movie, onClick }) => (
  <div
    className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition relative w-40 flex-shrink-0"
    onClick={() => onClick(movie)}
  >
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
      className="w-full h-56 object-cover"
    />
    {/* Badge */}
    <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
      HD ⭐ {movie.vote_average?.toFixed(1)}
    </span>
    <p className="text-xs mt-1 truncate">{movie.title || movie.name}</p>
  </div>
);

// ✅ Movie row (grid version)
const MovieRowGrid = ({ title, movies, onClick }) => (
  <section className="mt-6">
    <h2 className="text-xl font-bold mb-3">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} onClick={onClick} />
      ))}
    </div>
  </section>
);

// ✅ Movie row (horizontal scroll version)
const MovieRowScroll = ({ title, movies, onClick }) => (
  <section className="mt-6">
    <h2 className="text-xl font-bold mb-3">{title}</h2>
    <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} onClick={onClick} />
      ))}
    </div>
  </section>
);

// ✅ Main App
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [trending, setTrending] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [netflix, setNetflix] = useState([]);
  const [prime, setPrime] = useState([]);
  const [apple, setApple] = useState([]);
  const [disney, setDisney] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // ✅ Load categories
  useEffect(() => {
    const loadData = async () => {
      const trendingData = await fetchMovies("/trending/movie/week?");
      const tvData = await fetchMovies("/tv/popular?");
      const netflixData = await fetchMovies("/discover/tv?with_networks=213");
      const primeData = await fetchMovies("/discover/tv?with_networks=1024");
      const appleData = await fetchMovies("/discover/tv?with_networks=2552");
      const disneyData = await fetchMovies("/discover/tv?with_networks=2739");

      setHeroMovie(trendingData[0]);
      setTrending(trendingData);
      setTvShows(tvData);
      setNetflix(netflixData);
      setPrime(primeData);
      setApple(appleData);
      setDisney(disneyData);
    };
    loadData();
  }, []);

  // ✅ Search effect
  useEffect(() => {
    const searchMovies = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await fetchMovies(
        `/search/movie?query=${encodeURIComponent(searchTerm)}`
      );
      setSearchResults(results);
    };
    searchMovies();
  }, [searchTerm]);

  return (
    <main className="min-h-screen bg-gray-900 text-white relative">
      {/* Hero Section */}
      {heroMovie && (
        <div
          className="relative h-[70vh] flex items-end bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="relative p-6 z-10">
            <h1 className="text-4xl font-bold">{heroMovie.title}</h1>
            <p className="mt-2 max-w-xl text-sm text-gray-300 line-clamp-3">
              {heroMovie.overview}
            </p>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setSelectedMovie(heroMovie)}
            >
              ▶ Play
            </button>
          </div>
        </div>
      )}

      <div className="wrapper max-w-6xl mx-auto p-4 relative z-10">
        {/* Search */}
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Providers */}
        

        {/* ✅ If searching, show horizontal scroll results */}
        {searchResults.length > 0 ? (
          <MovieRowScroll
            title={`Search Results for "${searchTerm}"`}
            movies={searchResults}
            onClick={setSelectedMovie}
          />
        ) : (
          <>
            <MovieRowGrid
              title="Trending Movies"
              movies={trending}
              onClick={setSelectedMovie}
            />
            <MovieRowGrid
              title="Trending TV Shows"
              movies={tvShows}
              onClick={setSelectedMovie}
            />
            <MovieRowGrid
              title="Netflix Originals"
              movies={netflix}
              onClick={setSelectedMovie}
            />
            <MovieRowGrid
              title="Amazon Prime Shows"
              movies={prime}
              onClick={setSelectedMovie}
            />
            <MovieRowGrid
              title="Apple TV+ Shows"
              movies={apple}
              onClick={setSelectedMovie}
            />
            <MovieRowGrid
              title="Disney+ Shows"
              movies={disney}
              onClick={setSelectedMovie}
            />
          </>
        )}
      </div>

      {/* Movie Details Modal (always on top) */}
      {selectedMovie && (
        <div className="z-[9999] fixed inset-0">
          <MovieDetails
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        </div>
      )}
    </main>
  );
};

export default App;
