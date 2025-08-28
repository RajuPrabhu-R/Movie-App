import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react"; // for rating star

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
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Hero Background */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Close button */}
        <button
          className="absolute top-4 left-4 text-white text-3xl hover:text-red-500"
          onClick={onClose}
        >
          &larr;
        </button>

        {/* Title Section */}
        <div className="absolute bottom-6 left-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {movie.title || movie.name}
          </h2>
          <div className="flex items-center gap-3 text-gray-300">
            <span className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400" />
              {movie.vote_average?.toFixed(1)}
            </span>
            <span>{(movie.release_date || movie.first_air_date || "").slice(0, 4)}</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 text-white space-y-4">
        {/* Genres */}
        <div className="flex flex-wrap gap-2">
          {getGenreNames(movie.genre_ids).map((genre) => (
            <span
              key={genre}
              className="bg-red-600 text-white px-3 py-1 rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Overview */}
        <p className="text-gray-300 leading-relaxed">
          {movie.overview || "No overview available."}
        </p>

        {/* Play Button */}
        <div className="flex justify-center">
          <button
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-200 transition"
            onClick={() => setIsPlaying(true)}
          >
            ▶ Play
          </button>
        </div>
      </div>

      {/* Cast */}
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

      {/* Player Modal */}
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
