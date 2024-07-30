// ### With help from ChatGPT

import React, { useEffect, useState } from "react";
import apiCall from "../api/apiUtils";
import {
  FavoriteActor,
  FavoriteDirector,
  FavoriteMovie,
  Movie,
  FavoriteGenre,
  Review,
} from "../types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Avatar,
  Box,
  useTheme,
  CircularProgress,
  Chip,
  Button,
  Modal,
  Rating,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "../context/AuthContext";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import StreamingProviderButton from "../components/StreamingButtons/StreamingProviderButton";

interface MovieDetailModalProps {
  movieId?: string;
  open: boolean;
  handleClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movieId,
  open,
  handleClose,
}) => {
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [review, setReview] = useState<Review | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [buttonState, setButtonState] = useState("Add");
  const [favoriteMovie, setFavoriteMovie] = useState<FavoriteMovie[]>([]);
  const [favoriteActors, setFavoriteActors] = useState<FavoriteActor[]>([]);
  const [favoriteDirectors, setFavoriteDirectors] = useState<
    FavoriteDirector[]
  >([]);
  const [favoriteGenres, setFavoriteGenres] = useState<FavoriteGenre[]>([]);
  const theme = useTheme();

  const fetchFavoriteMovies = async () => {
    try {
      const data = await apiCall<FavoriteMovie[]>(`favorite-movies/`);
      const filteredMovies = data.filter(
        (favoriteMovie: FavoriteMovie) => favoriteMovie.user.id === user?.id
      );
      setFavoriteMovie(filteredMovies);
    } catch (error) {
      console.log("Failed to fetch favorite actors", error);
    }
  };

  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  const fetchFavoriteActors = async () => {
    try {
      const data = await apiCall<FavoriteActor[]>(`favorite-actors/`);
      const filteredActors = data.filter(
        (favoriteActor: FavoriteActor) => favoriteActor.user.id === user?.id
      );
      setFavoriteActors(filteredActors);
    } catch (error) {
      console.error("Failed to fetch Favorite actors", error);
    }
  };

  useEffect(() => {
    fetchFavoriteActors();
  }, []);

  const fetchFavoriteDirectors = async () => {
    try {
      const data = await apiCall<FavoriteDirector[]>(`favorite-directors/`);
      const filteredDirectors = data.filter(
        (favoriteDirector: FavoriteDirector) =>
          favoriteDirector.user.id === user?.id
      );
      setFavoriteDirectors(filteredDirectors);
    } catch (error) {
      console.error("Failed to fetch favorite director", error);
    }
  };

  useEffect(() => {
    fetchFavoriteDirectors();
  }, []);

  const fetchFavoriteGenres = async () => {
    try {
      const data = await apiCall<FavoriteGenre[]>(`favorite-genres/`);
      const filteredGenres = data.filter(
        (favoriteGenre: FavoriteGenre) => favoriteGenre.user.id === user?.id
      );
      setFavoriteGenres(filteredGenres);
    } catch (error) {
      console.error("Failed to fetch favorite director", error);
    }
  };

  useEffect(() => {
    fetchFavoriteGenres();
  }, []);

  const navigate = useNavigate();

  const handleReviewToggle = () => {
    setReviewOpen(!reviewOpen);
  };

  const handleRemoveReview = async () => {
    if (!movie?.id || !user) {
      console.log("Movie or user data is missing.");
      return;
    }

    try {
      const allReviews = await apiCall<Review[]>(`reviews/`, "GET");
      const data = allReviews.filter((review) => {
        return review.movie.id === movie?.id && review.user.id === user.id;
      });
      if (data.length > 0) {
        const response = await apiCall(`reviews/${data[0].id}`, "DELETE");
        console.log("Data removed successfully", response);
        setButtonState("Add");
        navigate(0);
      }
    } catch (error) {
      console.error("Failed to remove data", error);
    }
  };

  const submitReview = async () => {
    console.log("Submitting review:", reviewText, "Rating:", rating);
    if (!movie?.id || !user) {
      console.log("Movie or user data is missing.");
      return;
    }

    try {
      const information = {
        user_id: user.id,
        movie_id: movie.id,
        rating: rating === 0 ? null : rating,
        comment: reviewText,
      };

      const response = await apiCall("reviews/", "POST", information);
      console.log("Data exported successfully", response);
      setButtonState("Remove");
    } catch (error) {
      console.error("Failed to export data", error);
    }
    setReviewOpen(false);
  };

  const backgroundStyle = {
    backgroundImage: `
    linear-gradient(to left, rgba(255, 255, 255, 0) 0%, ${theme.palette.background.paper} 65%),
    url(${movie?.image_url})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    color: theme.palette.text.secondary,
  };

  const getConsistentHash = (id: string) => {
    let hash = 0;
    if (id.length === 0) return hash;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const getStreamingOptions = (movieId: string) => {
    const hash = getConsistentHash(movieId);
    const streamingServices = ["netflix", "disney", "hbo"];
    const selectedOptions: string[] = [];
    const optionsToShow = (hash % 3) + 1;

    for (let i = 0; i < optionsToShow; i++) {
      const index = (hash + i) % streamingServices.length;
      if (!selectedOptions.includes(streamingServices[index])) {
        selectedOptions.push(streamingServices[index]);
      }
    }

    return selectedOptions;
  };

  const renderStreamingButtons = (movieId: string) => {
    const options = getStreamingOptions(movieId);
    return options.map((type) => (
      <StreamingProviderButton
        key={type}
        type={type as "netflix" | "disney" | "hbo"}
      />
    ));
  };

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;
      setLoading(true);
      try {
        const data = await apiCall<Movie>(`movies/${movieId}`);
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const allReviews = await apiCall<Review[]>(`reviews/`, "GET");
        const data = allReviews.filter((review) => {
          return review.movie.id === movie?.id && review.user.id === user?.id;
        });
        if (data.length > 0) {
          setReview(data[0]);
          setButtonState("Remove Movie");
        } else {
          setReview(null);
        }
      } catch (error) {
        console.error("Failed to fetch review", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [movie?.id, user?.id]);

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (!movie) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Movie not found</DialogTitle>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        color="text.secondary"
        sx={{ fontSize: "36px", fontWeight: "bold", position: "relative" }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          <IconButton
            aria-label="add-actor-to-favorites"
            onClick={() => {
              const addMovieToFavorites = async () => {
                try {
                  const FavoriteInList = favoriteMovie.find(
                    (favoriteMovie: FavoriteMovie) =>
                      favoriteMovie.movie.id === movie.id
                  );

                  if (!FavoriteInList) {
                    const response = await apiCall(`favorite-movies/`, "POST", {
                      user_id: user?.id,
                      movie_id: movie.id,
                    });
                  } else {
                    const response = await apiCall(
                      `favorite-movies/${FavoriteInList.id}`,
                      "DELETE"
                    );
                  }
                  fetchFavoriteMovies();
                } catch (error) {
                  console.error("Failed to add/remove from favorites", error);
                }
              };
              addMovieToFavorites();
            }}
            sx={{
              color: favoriteMovie.find(
                (favoriteMovie) => favoriteMovie.movie.id === movie.id
              )
                ? theme.palette.primary.main
                : theme.palette.grey[500],
            }}
          >
            <FavoriteIcon sx={{ width: "24px", height: "24px" }} />
          </IconButton>
          <Typography
            gutterBottom
            style={{ fontSize: "30px", marginLeft: "10px" }}
          >
            {movie?.title}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon sx={{ width: "40px", height: "40px" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ ...backgroundStyle, minHeight: "450px" }}>
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
            <Grid item md={2}>
              <Avatar
                src={movie?.image_url}
                alt={movie?.title}
                sx={{ width: theme.spacing(15), height: theme.spacing(23.5) }}
                variant="rounded"
              />
              <Typography variant="body2" color="text.secondary">
                <b>Genres:</b>
                <br />
                {movie?.genres.map((genre, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <IconButton
                      aria-label="add-genre-to-favorites"
                      onClick={() => {
                        const addGenreToFavorites = async () => {
                          try {
                            const FavoriteInList = favoriteGenres.find(
                              (favoriteGenre: FavoriteGenre) =>
                                favoriteGenre.genre.id === genre.id
                            );

                            if (!FavoriteInList) {
                              const response = await apiCall(
                                `favorite-genres/`,
                                "POST",
                                {
                                  user_id: user?.id,
                                  genre_id: genre.id,
                                }
                              );
                            } else {
                              const response = await apiCall(
                                `favorite-genres/${FavoriteInList.id}`,
                                "DELETE"
                              );
                            }
                            fetchFavoriteGenres();
                          } catch (error) {
                            console.error(
                              "Failed to add/remove from favorites",
                              error
                            );
                          }
                        };
                        addGenreToFavorites();
                      }}
                      sx={{
                        borderRadius: "16px 0px 0px 16px",
                        backgroundColor: "#dcdddc",
                        color: favoriteGenres.find(
                          (favoriteGenre) => favoriteGenre.genre.id === genre.id
                        )
                          ? theme.palette.primary.main
                          : theme.palette.grey[500],
                      }}
                    >
                      <FavoriteIcon sx={{ width: "24px", height: "16px" }} />
                    </IconButton>

                    <Chip
                      label={genre.name}
                      sx={{
                        borderRadius: "0px 16px 16px 0px",
                        color: "text.primary",
                        backgroundColor: "primary.main",
                        opacity: 0.7,
                      }}
                    />
                  </Box>
                ))}
              </Typography>
            </Grid>
            <Grid item md={10}>
              <Typography gutterBottom style={{ fontSize: "18px" }}>
                Directed by:
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <IconButton
                  aria-label="add-director-to-favorites"
                  onClick={() => {
                    const addDirectorToFavorites = async () => {
                      try {
                        const FavoriteInList = favoriteDirectors.find(
                          (favoriteDirector: FavoriteDirector) =>
                            favoriteDirector.director.id === movie?.director.id
                        );

                        if (!FavoriteInList) {
                          const response = await apiCall(
                            `favorite-directors/`,
                            "POST",
                            {
                              user_id: user?.id,
                              director_id: movie?.director.id,
                            }
                          );
                        } else {
                          const response = await apiCall(
                            `favorite-directors/${FavoriteInList.id}`,
                            "DELETE"
                          );
                        }
                        fetchFavoriteDirectors();
                      } catch (error) {
                        console.error(
                          "Failed to add/remove from favorites",
                          error
                        );
                      }
                    };
                    addDirectorToFavorites();
                  }}
                  sx={{
                    color: favoriteDirectors.find(
                      (favoriteDirector) =>
                        favoriteDirector.director.id === movie?.director.id
                    )
                      ? theme.palette.primary.main
                      : theme.palette.grey[500],
                  }}
                >
                  <FavoriteIcon sx={{ width: "24px", height: "24px" }} />
                </IconButton>
                <Typography gutterBottom style={{ fontSize: "16px" }}>
                  {movie?.director.name}
                </Typography>
              </Box>
              <Typography gutterBottom style={{ fontSize: "18px" }}>
                Actors:
              </Typography>
              {movie?.actors.map((actor, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <IconButton
                    aria-label="add-actor-to-favorites"
                    onClick={() => {
                      const addActorToFavorites = async () => {
                        try {
                          const FavoriteInList = favoriteActors.find(
                            (favoriteActor: FavoriteActor) =>
                              favoriteActor.actor.id === actor.id
                          );

                          if (!FavoriteInList) {
                            const response = await apiCall(
                              `favorite-actors/`,
                              "POST",
                              {
                                user_id: user?.id,
                                actor_id: actor.id,
                              }
                            );
                          } else {
                            const response = await apiCall(
                              `favorite-actors/${FavoriteInList.id}`,
                              "DELETE"
                            );
                          }
                          fetchFavoriteActors();
                        } catch (error) {
                          console.error(
                            "Failed to add/remove from favorites",
                            error
                          );
                        }
                      };

                      addActorToFavorites();
                    }}
                    sx={{
                      color: favoriteActors.find(
                        (favoriteActor) => favoriteActor.actor.id === actor.id
                      )
                        ? theme.palette.primary.main
                        : theme.palette.grey[500],
                    }}
                  >
                    <FavoriteIcon sx={{ width: "24px", height: "24px" }} />
                  </IconButton>
                  <Typography style={{ fontSize: "16px" }}>
                    {actor.name}
                  </Typography>
                </Box>
              ))}
              <Typography gutterBottom style={{ fontSize: "14px" }}>
                Length: {movie?.length} minutes
              </Typography>
              <Typography gutterBottom style={{ fontSize: "14px" }}>
                Release Year: {movie?.release_year}
              </Typography>
              {review && (
                <Typography
                  gutterBottom
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Your rating: {review.rating}/5{" "}
                  <StarIcon
                    color="warning"
                    sx={{ width: "20px", height: "20px" }}
                  />
                </Typography>
              )}

              {buttonState === "Add" ? (
                <Button variant="contained" onClick={handleReviewToggle}>
                  Create Review
                </Button>
              ) : (
                <Button variant="contained" onClick={handleRemoveReview}>
                  Remove Movie
                </Button>
              )}
              <Modal
                open={reviewOpen}
                onClose={handleReviewToggle}
                aria-labelledby="write-review-modal"
                aria-describedby="write-review-form"
              >
                <Box
                  sx={{
                    position: "absolute" as "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                    color: "text.secondary",
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    gutterBottom
                  >
                    Write your review
                  </Typography>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                  />
                  <TextField
                    id="review"
                    label="Review"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    inputProps={{ style: { color: "black" } }}
                  />
                  <Button
                    onClick={submitReview}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Submit Review
                  </Button>
                </Box>
              </Modal>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 1, mb: 2, gap: 2 }}>
          <Typography
            gutterBottom
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            <b>Streaming alternatives:</b>
          </Typography>
          {movieId && renderStreamingButtons(movieId)}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailModal;
