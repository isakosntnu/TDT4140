import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import NavbarMenu from "../components/NavbarMenu";
import "../css/HomePage.css";
import Footer from "../components/Footer";
import MovieDetailModal from "../components/MovieDetailModal"; // Adjust the path as necessary
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import apiCall from "../api/apiUtils";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import {
  FavoriteActor,
  FavoriteDirector,
  FavoriteGenre,
  FavoriteMovie,
  Genre,
  Movie,
  Review,
} from "../types";
import { styled } from "@mui/system";
import MovieCarousel from "../components/MovieCarousel";
import { useAuth } from "../context/AuthContext";

const StyledPage = styled("div")({});

type MovieWithRatings = {
  movie: Movie;
  totalRating: number;
  count: number;
  averageRating?: number;
};

// ### ChatGPT
interface RatingsAccumulator {
  [key: number]: {
    movie: Movie;
    totalRating: number;
    count: number;
  };
}
// ###

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [randomMovies, setRandomMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | undefined>(
    undefined
  );
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [reviewedMovies, setReviewedMovies] = useState<Review[]>([]);

  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovie[]>([]);
  const [favoriteActors, setFavoriteActors] = useState<FavoriteActor[]>([]);
  const [favoriteDirectors, setFavoriteDirectors] = useState<
    FavoriteDirector[]
  >([]);
  const [favoriteGenres, setFavoriteGenres] = useState<FavoriteGenre[]>([]);

  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [badMovies, setBadMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await apiCall<Movie[]>(`movies`);
        setAllMovies(data);
      } catch (error) {
        console.error("Failed to fetch movie", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchMovieReviews = async () => {
      try {
        const response = await apiCall<Review[]>("reviews");
        setReviewedMovies(response);

        const validReviews = response.filter(
          (review) => review.rating !== null
        );

        const movieRatings = validReviews.reduce<RatingsAccumulator>(
          (acc, review) => {
            const id = review.movie.id;
            if (!acc[id]) {
              acc[id] = { movie: review.movie, totalRating: 0, count: 0 };
            }
            acc[id].totalRating += review.rating;
            acc[id].count += 1;
            return acc;
          },
          {}
        );

        // ### ChatGPT
        const moviesWithAverage = Object.values(movieRatings).map(
          (movieRating) => ({
            ...movieRating.movie,
            averageRating: movieRating.totalRating / movieRating.count,
            reviewCount: movieRating.count,
          })
        );
        // ###

        const lowRatedMoviesByAverage = moviesWithAverage
          .sort((a, b) => a.averageRating! - b.averageRating!)
          .slice(0, 10);

        setBadMovies(lowRatedMoviesByAverage);
      } catch (error) {
        console.error("Error fetching movie reviews:", error);
      }
    };

    fetchMovieReviews();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const dataMovie = await apiCall<FavoriteMovie[]>(`favorite-movies`);
        const dataDirector = await apiCall<FavoriteDirector[]>(
          `favorite-directors`
        );
        const dataGenre = await apiCall<FavoriteGenre[]>(`favorite-genres`);
        const dataActor = await apiCall<FavoriteActor[]>(`favorite-actors`);

        if (user) {
          const filteredMovies = dataMovie.filter(
            (favoriteMovie: FavoriteMovie) => favoriteMovie.user.id === user.id
          );
          const filteredActors = dataActor.filter(
            (favoriteActor: FavoriteActor) => favoriteActor.user.id === user.id
          );
          const filteredDirectors = dataDirector.filter(
            (favoriteDirector: FavoriteDirector) =>
              favoriteDirector.user.id === user.id
          );
          const filteredGenre = dataGenre.filter(
            (favoriteGenres: FavoriteGenre) =>
              favoriteGenres.user.id === user.id
          );

          setFavoriteActors(filteredActors);
          setFavoriteDirectors(filteredDirectors);
          setFavoriteMovies(filteredMovies);
          setFavoriteGenres(filteredGenre);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (favoriteGenres.length > 0 && allMovies.length > 0) {
      collectRecommended();
    }
  }, [favoriteGenres, allMovies]);

  const collectRecommended = async () => {
    const moviesWithTrueStatements = allMovies.map((movie) => ({
      movie: movie,
      trueStatements:
        (movie.genres
          .map((genre) => genre.name)
          .some((name) =>
            favoriteGenres.some(
              (favoriteGenre) => favoriteGenre.genre.name === name
            )
          )
          ? 1
          : 0) +
        (movie.actors
          .map((actor) => actor.name)
          .some((name) =>
            favoriteActors.some(
              (favoriteActor) => favoriteActor.actor.name === name
            )
          )
          ? 1
          : 0) +
        (favoriteDirectors.some(
          (favoriteDirector) =>
            favoriteDirector.director.name === movie.director.name
        )
          ? 1
          : 0),
      isReviewed: reviewedMovies.some(
        (review) => review.movie.title === movie.title
      ),
    }));

    const moviesToConsider = moviesWithTrueStatements.filter(
      (item) => !item.isReviewed
    );

    moviesToConsider.sort((a, b) => b.trueStatements - a.trueStatements);
    const topRecommendedMovies = moviesToConsider
      .slice(0, 10)
      .map((item) => item.movie);

    setRecommendedMovies(topRecommendedMovies);
  };

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/random-movies/10" // Can change this to use apiCall later
        );
        setRandomMovies(response.data);
      } catch (error) {
        console.error("Error fetching random movies:", error);
      }
    };

    fetchRandomMovies();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await apiCall<Genre[]>("genres");
        setAllGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 2000 && showAllGenres) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showAllGenres]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterMoviesByGenre = (genre: Genre) => {
    const filteredMovies: Movie[] = allMovies.filter((movie) =>
      movie.genres.map((genre) => genre.name).includes(genre.name)
    );
    return filteredMovies.slice(0, 10);
  };

  const handleMovieClick = (movieId: string) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  const handleFeelingLucky = () => {
    const movieId = Math.floor(Math.random() * allMovies.length) + 1;
    setSelectedMovieId(movieId.toString());
    setIsModalOpen(true);
  };

  const handleShowAllGenres = () => {
    setShowAllGenres(true);
  };
  const handleShowLessGenres = () => {
    setShowAllGenres(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(undefined);
  };

  return (
    <StyledPage
      sx={{ background: "linear-gradient(to right, #6A5ACD, #9A72AC)" }}
    >
      <div className="page">
        <NavbarMenu />
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Typography
            variant="h2"
            gutterBottom
            align="center"
            color="text.primary"
          >
            Welcome to <span style={{ fontSize: 100 }}>MovieTracker</span>
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{ mb: 3 }}
            color="text.primary"
          >
            Your personal guide to the world of cinema.
          </Typography>
        </Container>
        <Container style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
              component={Link}
              to="/movies"
            >
              Browse All Movies
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFeelingLucky}
            >
              I'm feeling lucky
            </Button>
          </div>
        </Container>
        {/* ChatGPT */}
        <Box
          sx={{
            height: "2px",
            width: "50%", // Line width as 2/3 of its container
            backgroundColor: "#fff", // Line color
            margin: "0 auto", // This centers the line
            mb: 3, // Margin bottom for spacing after the line
          }}
        />
        {/* */}

        <Box sx={{ marginBottom: "60px", background: "" }}>
          <MovieCarousel
            category={"Featured Movies"}
            onMovieClick={handleMovieClick}
            movies={randomMovies}
          />
        </Box>
        {recommendedMovies.length > 0 && (
          <Box sx={{ marginBottom: "60px", background: "" }}>
            <MovieCarousel
              category={"Recommended for you"}
              onMovieClick={handleMovieClick}
              movies={recommendedMovies}
            />
          </Box>
        )}

        <Box sx={{ marginBottom: "60px" }}>
          <MovieCarousel
            category={"Action Movies"}
            onMovieClick={handleMovieClick}
            movies={filterMoviesByGenre(
              allGenres.filter((genre) => genre.name === "Action")[0]
            )}
          />
        </Box>

        <Box sx={{ marginBottom: "60px" }}>
          <MovieCarousel
            category={"Drama Movies"}
            onMovieClick={handleMovieClick}
            movies={filterMoviesByGenre(
              allGenres.filter((genre) => genre.name === "Drama")[0]
            )}
          />
        </Box>
        {badMovies.length > 5 && (
          <Box sx={{ marginBottom: "60px" }}>
            <MovieCarousel
              category={"Lowest Rated Movies"}
              onMovieClick={handleMovieClick}
              movies={badMovies}
            />
          </Box>
        )}

        {isModalOpen && (
          <MovieDetailModal
            movieId={selectedMovieId}
            open={isModalOpen}
            handleClose={handleCloseModal}
          />
        )}

        {!showAllGenres && (
          <Button
            onClick={handleShowAllGenres}
            variant="contained"
            color="primary"
            style={{
              marginBottom: "20px",
              marginLeft: "20px",
              width: "140px",
              height: "50px",
            }}
          >
            View All Genres
          </Button>
        )}

        {/* ChatGPT */}
        {showBackToTop && (
          <ArrowCircleUpIcon
            onClick={handleBackToTop}
            sx={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "70px",
              height: "70px",
              cursor: "pointer",
              zIndex: 1000,
              color: "white",
            }}
          ></ArrowCircleUpIcon>
        )}
        {/* */}

        {showAllGenres &&
          allGenres
            .filter(
              (genre) => genre.name !== "Action" && genre.name !== "Drama"
            )
            .map((genre) => (
              <Box key={genre.id} sx={{ marginBottom: "100px" }}>
                <MovieCarousel
                  category={genre.name + " Movies"}
                  onMovieClick={handleMovieClick}
                  movies={filterMoviesByGenre(genre)}
                />
              </Box>
            ))}
        {showAllGenres && (
          <Button
            onClick={handleShowLessGenres}
            variant="contained"
            color="primary"
            style={{
              marginBottom: "20px",
              marginLeft: "20px",
              width: "140px",
              height: "50px",
            }}
          >
            View Less
          </Button>
        )}
        <Footer />
      </div>
    </StyledPage>
  );
};

export default HomePage;
