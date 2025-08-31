import React, { useEffect, useState } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = ({ movie, onClose }) => {
  const [cast, setCast] = useState([]);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!movie) return;

    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/${movie.media_type || "movie"}/${movie.id}?api_key=${API_KEY}&append_to_response=credits`
        );
        const data = await res.json();

        if (data.success === false) {
          setError("Failed to load details");
          return;
        }

        setGenres(data.genres || []);
        setCast(data.credits?.cast?.slice(0, 8) || []);
      } catch (err) {
        setError("Something went wrong.");
      }
    };

    fetchDetails();
  }, [movie]);

  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose} // close when clicking backdrop
    >
      <div
        className="relative bg-gray-900 text-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close on inner click
      >
        {/* Back Button */}
        <button
          className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          onClick={onClose}
        >
          ← Back
        </button>

        {/* Poster */}
        <div className="w-full h-64 md:h-96 rounded-t-2xl overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold">{movie.title || movie.name}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {movie.release_date || movie.first_air_date} •{" "}
            {genres.map((g) => g.name).join(", ")}
          </p>

          {/* Overview */}
          <p className="mt-4 text-gray-300">{movie.overview}</p>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Top Cast</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="w-28 flex-shrink-0 text-center"
                  >
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={actor.name}
                      className="w-28 h-36 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm font-medium truncate">{actor.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;