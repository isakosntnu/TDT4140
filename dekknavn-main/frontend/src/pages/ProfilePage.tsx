import React, { useState, useEffect } from "react";
import apiCall from "../api/apiUtils";
import NavbarMenu from "../components/NavbarMenu";
import Footer from "../components/Footer";
import "../css/ProfilePage.css";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import MovieDetailModal from "../components/MovieDetailModal";

import {
  Avatar,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  CardContent,
  Card,
  CardMedia,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import {
  FavoriteMovie,
  FavoriteActor,
  FavoriteDirector,
  FavoriteGenre,
  Review,
} from "../types";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const sampleAvatarUrl = `https://avatar.iran.liara.run/public/${user?.id}`;

  const [movieReviews, setMovieReviews] = useState<Review[]>([]);
  const [filteredMovieReviews, setFilteredMovieReviews] = useState<Review[]>(
    []
  );
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovie[]>([]);
  const [favoriteActors, setFavoriteActors] = useState<FavoriteActor[]>([]);
  const [favoriteDirectors, setFavoriteDirectors] = useState<
    FavoriteDirector[]
  >([]);
  const [favoriteGenres, setFavoriteGenres] = useState<FavoriteGenre[]>([]);

  const [sorter, setSorter] = useState<string>("LastSeen");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | undefined>(
    undefined
  );

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
          (favoriteGenres: FavoriteGenre) => favoriteGenres.user.id === user.id
        );

        setFavoriteActors(filteredActors);
        setFavoriteDirectors(filteredDirectors);
        setFavoriteMovies(filteredMovies);
        setFavoriteGenres(filteredGenre);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchMovieReviews = async () => {
      try {
        const data = await apiCall<Review[]>("reviews");
        if (user) {
          const filteredMovies = data
            .filter((review: Review) => review.user.id === user.id)
            .reverse();
          setMovieReviews(filteredMovies);
        }
      } catch (error) {
        console.error("Error fetching movie reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieReviews();
  }, [user]);

  const sortReviews = (reviews: Review[], filter: string) => {
    let sortedReviews = [...reviews];
    switch (filter) {
      case "Rating":
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      case "Title":
        return sortedReviews.sort((a, b) =>
          a.movie.title.localeCompare(b.movie.title)
        );
      case "LastSeen":
        return reviews;
      default:
        return reviews;
    }
  };

  const handleSortChange = (selectedSorter: string) => {
    setSorter(selectedSorter);
    let filteredReviews: Review[] = sortReviews(movieReviews, selectedSorter);
    setFilteredMovieReviews(filteredReviews);
  };

  useEffect(() => {
    handleSortChange("LastSeen");
  }, [movieReviews]);

  const handleMovieClick = (movieId: string) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(undefined);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <>
        <NavbarMenu />
        <Container>
          <Typography variant="h5">User profile not found</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      {isModalOpen && (
        <MovieDetailModal
          movieId={selectedMovieId}
          open={isModalOpen}
          handleClose={handleCloseModal}
        />
      )}
      <NavbarMenu />
      <Box className="profile-page">
        <Box>
          <Container maxWidth="sm" sx={{ mt: 4, mb: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                opacity: 0.9,
              }}
              color="background.paper"
            >
              <Avatar
                alt="User Avatar"
                src={sampleAvatarUrl}
                sx={{ width: 90, height: 90, mb: 2 }}
              />
              <Typography variant="h4" gutterBottom color="text.secondary">
                User Profile
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
                <strong>Username:</strong> {user.username}
              </Typography>
            </Paper>
          </Container>
        </Box>
        <Grid container sx={{ py: 5 }}>
          <Grid
            item
            md={2.5}
            sx={{
              position: "sticky",
              top: 0,
              height: "auto",
              alignSelf: "flex-start",
            }}
          >
            {/*  */}
            <Box>
              <Box
                sx={{
                  height: "36px",
                  margin: "20px 0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ textAlign: "center" }}
                  color="text.primary"
                >
                  Favorites
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ px: 3 }}>
                <Grid item md={12}>
                  <Paper
                    elevation={3}
                    sx={{ maxHeight: 270, minHeight: 270, overflow: "auto" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        color: "text.secondary",
                      }}
                    >
                      Favorite Actors
                    </Typography>
                    <List>
                      {favoriteActors.map((favoriteActor, index) => (
                        <ListItem key={index}>
                          <ListItemText secondary={favoriteActor.actor.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item md={12}>
                  <Paper
                    elevation={3}
                    sx={{ maxHeight: 270, minHeight: 270, overflow: "auto" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        color: "text.secondary",
                      }}
                    >
                      Favorite Genres
                    </Typography>
                    <List>
                      {favoriteGenres.map((favoriteGenre, index) => (
                        <ListItem key={index}>
                          <ListItemText secondary={favoriteGenre.genre.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item md={12}>
                  <Paper
                    elevation={3}
                    sx={{ maxHeight: 270, minHeight: 270, overflow: "auto" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        color: "text.secondary",
                      }}
                    >
                      Favorite Directors
                    </Typography>
                    <List>
                      {favoriteDirectors.map((favoriteDirector, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            secondary={favoriteDirector.director.name}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item md={9}>
            <Box style={{ textAlign: "center", margin: "20px 0" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  handleSortChange("Rating");
                }}
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  margin: "0 10px",
                }}
              >
                Sort by Rating
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  handleSortChange("Title");
                }}
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  margin: "0 10px",
                }}
              >
                Sort by Title
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  handleSortChange("LastSeen");
                }}
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  margin: "0 10px",
                }}
              >
                Sort by Last Seen
              </Button>
            </Box>
            {/* Movie Reviews Section */}
            {filteredMovieReviews.length > 0 ? (
              <Grid container spacing={3} sx={{ px: 5 }}>
                {filteredMovieReviews.map((review, index) => (
                  <Grid item md={3} key={index}>
                    <Card
                      onClick={() =>
                        handleMovieClick(review.movie.id.toString())
                      }
                      sx={{
                        cursor: "pointer",
                        minHeight: "550px",
                        boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.5)",
                        ":hover": {
                          cursor: "pointer",
                          transform: "scale(1.05)",
                          transition: "all 0.35s ease",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 0,
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="350"
                          image={review.movie.image_url}
                          alt={review.movie.title}
                          onClick={() =>
                            handleMovieClick(review.movie.id.toString())
                          }
                        />
                        <Box sx={{ p: 2 }}>
                          <Typography
                            variant="h5"
                            component="div"
                            sx={{ color: "text.secondary" }}
                          >
                            {review.movie.title}
                          </Typography>
                          {review.rating && (
                            <Rating
                              name={`movie-rating-${review.id}`}
                              value={review.rating}
                              precision={0.5}
                              icon={<StarIcon fontSize="inherit" />}
                              emptyIcon={<StarBorderIcon fontSize="inherit" />}
                              readOnly
                            />
                          )}
                          {review.comment && (
                            <Typography
                              variant="body2"
                              color={"text.secondary"}
                            >
                              Comment: {review.comment}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                variant="h6"
                sx={{ textAlign: "center", marginTop: "20px" }}
              >
                No movie reviews found.
              </Typography>
            )}
          </Grid>
        </Grid>

        <Footer />
      </Box>
    </>
  );
};

export default ProfilePage;
