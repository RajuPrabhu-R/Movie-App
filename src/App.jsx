import React, { useEffect, useState } from "react";
import MovieDetails from "./components/MovieDetails";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchMovies = async (endpoint) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}&api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

const MovieCard = ({ movie, onClick }) => (
  <div
    className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition"
    onClick={() => onClick(movie)}
  >
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
      className="w-full h-64 object-cover"
    />
    <p className="text-sm mt-2 truncate">{movie.title || movie.name}</p>
  </div>
);

const MovieRow = ({ title, movies, onClick }) => (
  <section className="mt-6">
    <h2 className="text-xl font-bold mb-3">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} onClick={onClick} />
      ))}
    </div>
  </section>
);

const App = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [trending, setTrending] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [netflix, setNetflix] = useState([]);
  const [prime, setPrime] = useState([]);
  const [apple, setApple] = useState([]);
  const [disney, setDisney] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      {heroMovie && (
        <div
          className="relative h-[70vh] flex items-end bg-cover bg-center"
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
        </div>
      )}

      <div className="wrapper max-w-6xl mx-auto p-4">
        {/* Providers */}
        <section className="flex gap-6 justify-center my-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix"
            className="h-10"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg"
            alt="Disney+"
            className="h-10"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png"
            alt="Prime Video"
            className="h-10"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/19/HBO_Max_Logo.svg"
            alt="HBO Max"
            className="h-10"
          />
        </section>

        {/* Rows */}
        <MovieRow title="Trending Movies" movies={trending} onClick={setSelectedMovie} />
        <MovieRow title="Trending TV Shows" movies={tvShows} onClick={setSelectedMovie} />
        <MovieRow title="Netflix Originals" movies={netflix} onClick={setSelectedMovie} />
        <MovieRow title="Amazon Prime Shows" movies={prime} onClick={setSelectedMovie} />
        <MovieRow title="Apple TV+ Shows" movies={apple} onClick={setSelectedMovie} />
        <MovieRow title="Disney+ Shows" movies={disney} onClick={setSelectedMovie} />
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </main>
  );
};

export default App;
