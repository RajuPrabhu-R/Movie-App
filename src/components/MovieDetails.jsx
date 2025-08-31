import { useEffect, useState } from "react";
import axios from "axios";

const MovieDetails = ({ movie, onClose }) => {
  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const [error, setError] = useState("");
  const [cast, setCast] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCastAndGenres = async () => {
      if (!movie) return;
      setLoading(true);
      setError("");
      try {
        const castResponse = await axios.get(
          `${API_BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`
        );
        setCast(castResponse.data.cast);

        const genresResponse = await axios.get(
          `${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        setGenres(genresResponse.data.genres);
      } catch (err) {
        setError("Failed to fetch details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCastAndGenres();
  }, [movie, API_KEY]);

  if (!movie) return null;

  const getGenreNames = (ids) =>
    ids
      .map((id) => {
        const g = genres.find((x) => x.id === id);
        return g ? g.name : null;
      })
      .filter(Boolean);

  const embedUrl = `https://player.vidplus.to/embed/movie/${movie.id}`;

  return (
    <div className="relative w-full max-w-5xl mx-auto my-8 bg-black rounded-xl overflow-hidden shadow-lg">
      {/* Close button */}
      <button
        className="absolute top-5 right-5 text-white text-3xl hover:text-red-500 z-10"
        onClick={onClose}
      >
        &times;
      </button>

      {/* Hero Banner */}
      <div
        className="w-full h-[60vh] md:h-[400px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

        {/* Title & Info */}
        <div className="absolute bottom-6 left-6 md:left-12 text-white max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">
            {movie.title || movie.name}
          </h2>
          <p className="text-yellow-400 font-semibold text-lg">
            ⭐ {movie.vote_average?.toFixed(1)} / 10
          </p>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mt-3">
            {getGenreNames(movie.genre_ids).map((genre) => (
              <span
                key={genre}
                className="bg-red-600 px-3 py-1 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="mt-4 text-gray-200 text-sm md:text-base">
            {movie.overview || "No overview available."}
          </p>

          {/* Play button */}
          <button
            className="mt-5 bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            onClick={() => setIsPlaying(true)}
          >
            ▶ Play
          </button>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="p-6">
          <h3 className="text-white text-xl font-bold mb-4">Cast</h3>
          <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
            {cast.slice(0, 10).map((actor) => (
              <div key={actor.id} className="flex-shrink-0 w-24 text-center">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={actor.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
                />
                <p className="text-sm">{actor.name}</p>
                <p className="text-xs text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Player Modal (still overlayed) */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className="relative w-full max-w-3xl">
            <button
              className="absolute -top-12 right-0 text-white text-3xl hover:text-red-500"
              onClick={() => setIsPlaying(false)}
            >
              &times;
            </button>
            {loading ? (
              <div className="text-white text-center">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <iframe
                width="100%"
                height="500"
                src={embedUrl}
                title="Movie Player"
                className="rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;