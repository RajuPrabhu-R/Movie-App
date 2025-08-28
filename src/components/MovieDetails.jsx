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
      .filter(Boolean)
      .join(", ");

  const embedUrl = `https://player.vidplus.to/embed/movie/${movie.id}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-start z-50 overflow-y-auto p-6">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl relative shadow-lg">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-white text-3xl hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold text-center mt-4">
          {movie.title || movie.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg object-cover w-full"
          />

          {/* Info */}
          <div className="text-white space-y-3">
            <p>
              <span className="text-yellow-400 font-semibold">Language:</span>{" "}
              {movie.original_language?.toUpperCase()}
            </p>
            <p>
              <span className="text-yellow-400 font-semibold">Popularity:</span>{" "}
              {movie.popularity?.toFixed(1)}
            </p>
            <p>
              <span className="text-yellow-400 font-semibold">Release:</span>{" "}
              {movie.release_date || movie.first_air_date}
            </p>
            <p>
              <span className="text-yellow-400 font-semibold">Rating:</span>{" "}
              {movie.vote_average?.toFixed(1)} / 10
            </p>
            <p>
              <span className="text-yellow-400 font-semibold">Genres:</span>{" "}
              {getGenreNames(movie.genre_ids) || "N/A"}
            </p>
            <p>
              <span className="text-yellow-400 font-semibold">Overview:</span>{" "}
              {movie.overview || "No overview available."}
            </p>

            <button
              className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition"
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
    </div>
  );
};

export default MovieDetails;
