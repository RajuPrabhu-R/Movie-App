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
      if (movie) {
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
        } catch (error) {
          setError("Failed to fetch data. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCastAndGenres();
  }, [movie, API_KEY]);

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  if (!movie) return null;

  const embedUrl = `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`;


  return (
    <div className="movie-card mt-20 bg-grey bg-opacity-70 flex z-50 justify-center items-center" id="movie-details-find">
      <div className="bg-dark-100 rounded-lg w-full max-w-4xl relative">
        <button
          className="absolute top-3 -right-10 text-white text-3xl w-10 h-10 bg-gray-500 rounded-full hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-white mb-4 text-center">{movie.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative cursor-pointer mt-10">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg object-cover w-full"
            />
          </div>
          <div className="text-white mt-10">
            <p className="mt-4 mb-4"><strong className="text-yellow-200">Language :</strong> {movie.original_language.toUpperCase()}</p>
            <p className="mt-4 mb-4"><strong className="text-yellow-200">Popularity :</strong> {movie.popularity.toFixed(1)}</p>
            <p className="mt-4 mb-4"><strong className="text-yellow-200">Release Date :</strong> {movie.release_date}</p>
            <p className="mt-4 mb-4"><strong className="text-yellow-200">Rating :</strong> {movie.vote_average.toFixed(1)} / 10</p>
            <p className="mt-4 mb-4"><strong className="text-yellow-200">Genres :</strong> {getGenreNames(movie.genre_ids) || "No genres available."}</p>
            <p className="mt-4 mb-4"><strong className="text-yellow-200">Overview :</strong> {movie.overview || "No overview available."}</p>
          </div>
          <button className="bg-light-100/9 font-bold hover:bg-light-100/5 cursor-pointer hover:scale-105 transition-all py-5 px-15 rounded-xl mb-5"
            onClick={()=> setIsPlaying(true)}
          >
            Play Movie
          </button>
        </div>

        {/* Movie Player Modal - only if paid */}
        {isPlaying && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 h-screen rounded-xl">
            <div className="relative w-full max-w-2xl bg-black">
              <button
                className="absolute -top-20 right-5 text-white text-4xl w-10 h-10 bg-gray-500 rounded-full hover:text-red-500"
                onClick={() => setIsPlaying(false)}
              >
                &times;
              </button>
              {loading ? (
                <div className="text-white text-center">Loading movie...</div>
              ) : error ? (
                <div className="text-white text-center">{error}</div>
              ) : (
                <iframe
                  className="flex justify-center items-center"
                  width="100%"
                  height="400"
                  src={embedUrl}
                  title="Movie Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        )}

        {/* Cast Section */}
        <div className="mt-6">
          <h3 className="text-white text-center text-2xl mb-5">Cast</h3>
          <div className="w-full flex gap-14 overflow-x-auto hide-scrollbar">
            {cast.map((actor) => (
              <div key={actor.id} className="md:w-1/4 flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                  alt={actor.name}
                  className="w-25 h-25 rounded-full object-cover mx-auto"
                />
                <p className="text-white text-center">{actor.name}</p>
                <p className="text-white-500 my-3 text-center text-sm bg-gray-500 rounded-2xl">
                  <div>{actor.character}</div>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* UPI Payment Section */}
      </div>
    </div>
  );
};

export default MovieDetails;
