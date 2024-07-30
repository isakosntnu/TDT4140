// ### With some help from ChatGPT

import React, { useCallback, useEffect, useState } from "react";
import NavbarMenu from "../components/NavbarMenu";
import Footer from "../components/Footer";
import apiCall from "../api/apiUtils";
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  Grid,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  CardMedia,
  InputAdornment,
} from "@mui/material";
import { Movie, Genre } from "../types";
import { Search as SearchIcon } from "@mui/icons-material";
import MovieDetailModal from "../components/MovieDetailModal";
const MoviesPage: React.FC = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const moviesPerPage = 20;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | undefined>(
    undefined
  );
  const [genreMovieCounts, setGenreMovieCounts] = useState<
    Record<number, number>
  >({});

  const fetchGenres = useCallback(async () => {
    try {
      const data = await apiCall<Genre[]>("genres");
      setAllGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleMovieClick = (movieId: string) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(undefined);
  };

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    try {
      let endpoint =
        searchTerm !== "" ? `search-movies/?query=${searchTerm}` : "movies";
      const data = await apiCall<Movie[]>(endpoint);
      setAllMovies(data);
      setDisplayedMovies(data.slice(0, moviesPerPage));
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, moviesPerPage]);

  useEffect(() => {
    fetchMovies();
  }, [searchTerm, sortBy, fetchMovies]);

  useEffect(() => {
    const filteredMovies = allMovies.filter(
      (movie) =>
        selectedGenre.length === 0 ||
        selectedGenre.every((genreId) =>
          movie.genres.map((genre) => genre.id).includes(genreId)
        )
    );

    setDisplayedMovies(filteredMovies.slice(0, moviesPerPage));
  }, [allMovies, selectedGenre, searchTerm, moviesPerPage]);

  const handleGenreChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    setSelectedGenre(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 5 &&
      !isLoading
    ) {
      setDisplayedMovies((prevDisplayedMovies) => {
        const nextIndex = prevDisplayedMovies.length;
        const filteredMovies = allMovies.filter(
          (movie) =>
            selectedGenre.length === 0 ||
            selectedGenre.every((genreId) =>
              movie.genres.map((genre) => genre.id).includes(genreId)
            )
        );
        const moreMovies = filteredMovies.slice(
          nextIndex,
          nextIndex + moviesPerPage
        );
        return [...prevDisplayedMovies, ...moreMovies];
      });
    }
  }, [isLoading, allMovies, selectedGenre, searchTerm, moviesPerPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const updateGenreMovieCounts = () => {
    const newCounts: Record<number, number> = {};

    allGenres.forEach((genre) => {
      let genreSpecificMovies = allMovies;
      if (selectedGenre.length > 0) {
        genreSpecificMovies = allMovies.filter((movie) =>
          selectedGenre.every((selectedId) =>
            movie.genres.some((g) => g.id === selectedId)
          )
        );
      }
      const count = genreSpecificMovies.filter((movie) =>
        movie.genres.some((g) => g.id === genre.id)
      ).length;

      newCounts[genre.id] = count;
    });

    setGenreMovieCounts(newCounts);
  };

  useEffect(() => {
    updateGenreMovieCounts();
  }, [allMovies, selectedGenre]);

  return (
    <Box
      className="page"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "space-between",
      }}
    >
      <NavbarMenu />
      <Typography
        variant="h5"
        gutterBottom
        align="left"
        sx={{
          ml: 9,
          mt: 5,
          //mb: 1,
          fontWeight: "bold",
          textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
        }}
        color="text.primary"
      >
        Browse all movies
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 0,
          mb: 6,
        }}
      >
        <FormControl
          sx={{
            mr: 2,
            minWidth: 120,
            // ### Github Copilot
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "white",
                borderWidth: "1px",
              },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "text.primary",
              borderColor: "white",
              borderWidth: "1px",
              mt: 1,
              transform: "translate(14px, -6px) scale(0.75)",
            },
            // ###
          }}
        >
          <InputLabel sx={{ color: "white" }} id="genre-select-label">
            Genres
          </InputLabel>
          <Select
            labelId="genre-select-label"
            id="genre-select"
            multiple
            value={selectedGenre}
            onChange={handleGenreChange}
            // ### ChatGPT
            sx={{
              color: "white",
              ".MuiSelect-select": {
                color: "white",
                borderColor: "white",
              },
              "&:before": {
                borderColor: "primary.main",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderColor: "primary.light",
              },
            }}
            // ###
            renderValue={(selected) =>
              allGenres
                .filter((genre) => selected.includes(genre.id))
                .map((genre) => genre.name)
                .join(", ")
            }
          >
            {allGenres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                <Checkbox
                  checked={selectedGenre.indexOf(genre.id) > -1}
                  sx={{
                    color: "primary.main",
                    "&.Mui-checked": {
                      color: "primary.dark",
                    },
                  }}
                />
                <ListItemText
                  primary={`${genre.name} (${genreMovieCounts[genre.id] || 0})`}
                  sx={{
                    ".MuiTypography-root": {
                      color: "primary.main",
                    },
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Search for title, actors, directors..."
          variant="filled"
          value={inputValue}
          onChange={handleSearchChange}
          // ### ChatGPT
          sx={{
            width: "50%",
            maxWidth: "500px",
            borderColor: "white",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
                color: "white",
                backgroundColor: "white",
              },
              "&.Mui-focused": {
                color: "black",
              },
            },
          }}
          // ###
          InputLabelProps={{
            style: {
              color: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "white" }} />
              </InputAdornment>
            ),
            style: { color: "white" },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      ></Box>

      {isModalOpen && (
        <MovieDetailModal
          movieId={selectedMovieId}
          open={isModalOpen}
          handleClose={handleCloseModal}
        />
      )}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      />

      <Grid container spacing={4} px={9} justifyContent="center">
        {displayedMovies &&
          displayedMovies.map((movie, index) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              {/* ### ChatGPT*/}
              <Card
                sx={{
                  maxWidth: 315,
                  height: "100%",
                  position: "relative",
                  boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.5)",
                  ":hover": {
                    cursor: "pointer",
                    transform: "scale(1.05)",
                    transition: "all 0.35s ease",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="350"
                  image={movie.image_url}
                  alt={movie.title}
                  onClick={() => handleMovieClick(movie.id.toString())}
                />
                {movie.id <= 8 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%", // This ensures the ribbon stretches across the top of the card
                      backgroundColor: "rgba(0, 100, 255, 0.9)", // Example: a semi-transparent red
                      color: "#fff",
                      textAlign: "center", // Centers the text within the ribbon
                      padding: "6px 0", // Adjust padding to control the height of the ribbon
                      fontWeight: "bold",
                    }}
                  >
                    Sponsored
                  </Box>
                )}
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    color="text.secondary"
                  >
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>Genres:</b>
                    <br />
                    {movie.genres.map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre.name}
                        sx={{
                          color: "text.primary",
                          mr: 0.5,
                          mt: 1,
                          backgroundColor: "primary.main",
                          opacity: 0.7,
                        }}
                      />
                    ))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" my={2}>
                    <b>Director:</b> {movie.director.name}
                  </Typography>
                </CardContent>
              </Card>
              {/* ### */}
            </Grid>
          ))}
      </Grid>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Footer />
    </Box>
  );
};

export default MoviesPage;
