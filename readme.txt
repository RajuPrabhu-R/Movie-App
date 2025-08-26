      original_language AND soures


// import { useEffect, useState } from "react";
// import axios from "axios";

// const MovieDetails = ({ movie, onClose }) => {
//   const API_BASE_URL = "https://api.themoviedb.org/3";
//   const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
//   const [trailerUrl, setTrailerUrl] = useState("");
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [cast, setCast] = useState([]);
//   const [genres, setGenres] = useState([]);

//   useEffect(() => {
//     const fetchTrailerAndCastAndGenres = async () => {
//       if (movie) {
//         setLoading(true);
//         setError("");
//         try {
//           // Fetch trailer
//           const trailerResponse = await axios.get(
//             `${API_BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
//           );
//           const trailers = trailerResponse.data.results;
//           const trailer = trailers.find(
//             (trailer) => trailer.type === "Trailer"
//           );
//           if (trailer) {
//             setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
//           } else {
//             setError("No trailer available for this movie.");
//           }

//           // Fetch cast
//           const castResponse = await axios.get(
//             `${API_BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`
//           );
//           setCast(castResponse.data.cast);

//           const genresResponce = await axios.get(
//             `${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
//           );
//           setGenres(genresResponce.data.genres);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           setError("Failed to fetch data. Please try again later.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchTrailerAndCastAndGenres();
//   }, [movie, API_KEY]);

//   const getGenreNames = (genreIds) => {
//     return genreIds
//       .map((id) => {
//         const genre = genres.find((g) => g.id === id);
//         return genre ? genre.name : null;
//       })
//       .filter(Boolean)
//       .join(" , ");
//   };

//   if (!movie) return null;

//   return (
//     <div className="movie-card mt-20 bg-grey bg-opacity-70 flex z-50 mt-20 justify-center items-center" id="movie-details-find">
//       <div className="bg-dark-100 rounded-lg w-full max-w-4xl relative">
//         <button
//           className="absolute top-3 right-2 text-white text-3xl w-10 h-10 bg-gray-500 rounded-full hover:text-red-500 transition-colors duration-300"
//           onClick={onClose}>
//           &times;
//         </button>
//         <h2 className="text-white mb-4 text-center">{movie.title}</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="relative cursor-pointer mt-10">
//             <a href="#trailer-iframe">
//               <img
//               src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
//               alt={movie.title}
//               className="rounded-lg object-cover w-full"
//               onClick={() => setIsPlaying(true)}
//             />
//             </a>
//           </div>
//           <div className="text-white mt-10">
//             <p className="mt-4 mb-4">
//               <strong>Language :</strong>{" "}
//               {movie.original_language.toUpperCase()}
//             </p>
//             <p className="mt-4 mb-4">
//               <strong>Popularity :</strong> {movie.popularity.toFixed(1)}
//             </p>
//             <p className="mt-4 mb-4">
//               <strong>Release Date :</strong> {movie.release_date}
//             </p>
//             <p className="mt-4 mb-4">
//               <strong>Rating :</strong> {movie.vote_average.toFixed(1)} / 10
//             </p>
//               <strong>Genres :</strong> 
//             <p className="inline-block bg-gray-700 rounded-full px-3 py-1 mb-3 text-sm font-semibold text-gray-300 mr-2">
//               {getGenreNames(movie.genre_ids) || "No genres available."}
//             </p>
//             <p className="mt-4 mb-4">
//               <strong>Overview :</strong>{" "}
//               {movie.overview || "No overview available."}
//             </p>
//             <div>
//               <a href={trailerUrl}>
//                 <button className="bg-light-100/9 font-bold hover:bg-light-100/5 cursor-pointer hover:scale-105 transition-all py-5 px-15 rounded-xl mb-5">
//                   Play Trailer
//                 </button>
//               </a>
//             </div>
//           </div>
//         </div>
//         <div className="movie-card md:h-auto" id="trailer-iframe">
//           {isPlaying && (
//             <div className=" inset-0 bg-opacity-80 flex justify-center items-center z-50 h-177 rounded-xl">
//               <div className="relative w-full max-w-2xl bg-black">
//                 <button
//                   className="absolute -top-20 right-5 text-white text-4xl w-10 h-10 bg-gray-500 rounded-full hover:text-red-500 transition-colors duration-300"
//                   onClick={() => setIsPlaying(false)}
//                 >
//                   &times;
//                 </button>
//                 {loading ? (
//                   <div className="text-white text-center">
//                     Loading trailer...
//                   </div>
//                 ) : error ? (
//                   <div className="text-white text-center">{error}</div>
//                 ) : (
//                   <iframe
//                     className="flex justify-center items-center"
//                     width="100%"
//                     height="400"
//                     src={trailerUrl}
//                     title="Trailer"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                   ></iframe>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Cast Section */}
//         <div className="mt-6">
//           <h3 className="text-white text-center text-2xl mb-5">Cast</h3>
//           <div className="w-full flex gap-14 overflow-x-auto hide-scrollbar">
//             {cast.map((actor) => (
//               <div key={actor.key} className="md:w-1/4 flex-shrink-0">
//                 <img
//                   src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
//                   alt={actor.name}
//                   className="w-25 h-25 rounded-full object-cover mx-auto" 
//                 />
//                 <p className="text-white text-center">{actor.name}</p>
//                 <p className="text-white-500 my-3 text-center text-sm bg-gray-500 rounded-2xl">
//                   <div className="">{actor.character}</div>
//                 </p>
//               </div>
//             ))}
//           </div>
//           <div className="movie-card md:h-auto mt-10 flex justify-center items-center">
//             <iframe 
//               className="w-full h-[400px] mt-10 rounded-lg"
//               title="Movie Embed"
//               allowFullScreen
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               src={`https://multiembed.mov/?video_id=${movie.id}&tmdb=1`} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieDetails;










### App.jsx Update for infinte scroll
import { Suspense, useEffect, useState, useRef } from "react";
import React from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loader = useRef(null);

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
    setPage(1);
    setMovieList([]);
    setHasMore(true);
  }, 500, [searchTerm]);

  // Helper to filter out duplicate movies by id
  const mergeUniqueMovies = (prevMovies, newMovies) => {
    const movieMap = new Map();
    [...prevMovies, ...newMovies].forEach((movie) => {
      if (movie && movie.id) {
        movieMap.set(movie.id, movie);
      }
    });
    return Array.from(movieMap.values());
  };

  const fetchMovies = async (query = "", pageNum = 1) => {
    if (!hasMore) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&page=${pageNum}&api_key=${API_KEY}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNum}&api_key=${API_KEY}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        setHasMore(false);
        return;
      }
      // Merge and filter out duplicates
      setMovieList((prev) => mergeUniqueMovies(prev, data.results || []));
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
    // eslint-disable-next-line
  }, [debouncedSearchTerm]);

  // Infinite scroll: fetch more movies when loader is visible
 /*  useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMovies(debouncedSearchTerm, page + 1);
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
    // eslint-disable-next-line
  }, [loader, hasMore, isLoading, page, debouncedSearchTerm]);
 */
  return (
    <main>
      <div className="wrapper">
        <header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <Suspense
            fallback={
              <div>
                <p className="text-white">Loading Movies</p>
              </div>
            }
          >
            {selectedMovie && (
              <MovieDetails
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
              />
            )}
          </Suspense>
          <h2 className="mt-20">All Movies</h2>
          <ul>
            {movieList.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </ul>
          {isLoading && <Spinner />}
          <div ref={loader} />
          {!hasMore && (
            <p className="text-gray-400 text-center mt-4">
              No more movies to show.
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;



// To Play Movie with embed link
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
          // Fetch cast
          const castResponse = await axios.get(
            `${API_BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`
          );
          setCast(castResponse.data.cast);

          // Fetch genres
          const genresResponse = await axios.get(
            `${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
          );
          setGenres(genresResponse.data.genres);
        } catch (error) {
          console.error("Error fetching data:", error);
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
      .join(" , ");
  };

  if (!movie) return null;

  const embedUrl = `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`;

  return (
    <div className="movie-card mt-20 bg-grey bg-opacity-70 flex z-50 mt-20 justify-center items-center" id="movie-details-find">
      <div className="bg-dark-100 rounded-lg w-full max-w-4xl relative">
        <button
          className="absolute top-3 -right-10 text-white text-3xl w-10 h-10 bg-gray-500 rounded-full hover:text-red-500 transition-colors duration-300"
          onClick={onClose}>
          &times;
        </button>
        <h2 className="text-white mb-4 text-center">{movie.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative cursor-pointer mt-10">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg object-cover w-full"
              onClick={() => setIsPlaying(true)}
            />
          </div>
          <div className="text-white mt-10">
            <p className="mt-4 mb-4">
              <strong className="text-yellow-200">Language :</strong>{" "}
              {movie.original_language.toUpperCase()}
            </p>
            <p className="mt-4 mb-4">
              <strong className="text-yellow-200">Popularity :</strong> {movie.popularity.toFixed(1)}
            </p>
            <p className="mt-4 mb-4">
              <strong className="text-yellow-200">Release Date :</strong> {movie.release_date}
            </p>
            <p className="mt-4 mb-4">
              <strong className="text-yellow-200">Rating :</strong> {movie.vote_average.toFixed(1)} / 10
            </p>
            <p className="mt-4 mb-4">
              <strong className="text-yellow-200">Genres :</strong>{" "}
              {getGenreNames(movie.genre_ids) || "No genres available."}
            </p>
            <p className="mt-4 mb-4">
              <strong className="text-yellow-200">Overview :</strong>{" "}
              {movie.overview || "No overview available."}
            </p>
            <div>
              <button
                className="bg-light-100/9 font-bold hover:bg-light-100/5 cursor-pointer hover:scale-105 transition-all py-5 px-15 rounded-xl mb-5"
                onClick={() => setIsPlaying(true)}
              >
                Play Movie
              </button>
            </div>
          </div>
        </div>
        {/* Movie Player Modal */}
        {isPlaying && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 h-screen rounded-xl">
            <div className="relative w-full max-w-2xl bg-black">
              <button
                className="absolute -top-20 right-5 text-white text-4xl w-10 h-10 bg-gray-500 rounded-full hover:text-red-500 transition-colors duration-300"
                onClick={() => setIsPlaying(false)}
              >
                &times;
              </button>
              {loading ? (
                <div className="text-white text-center">
                  Loading movie...
                </div>
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
                  <div className="">{actor.character}</div>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
