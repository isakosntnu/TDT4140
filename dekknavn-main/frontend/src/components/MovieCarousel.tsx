// With help from ChatGPT

import React from "react";
import { Box, Typography } from "@mui/material";
import { Movie } from "../types";
import Slider from "react-slick";
import StarIcon from '@mui/icons-material/Star';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface MovieWithAverageRating extends Movie {
  averageRating?: number;
  isBadMovie?: boolean;
  reviewCount?: number;
}

interface MovieCarouselProps {
  movies: MovieWithAverageRating[];
  onMovieClick: (movieId: string) => void;
  category: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  movies,
  onMovieClick,
  category,
}) => {
  const getDynamicSettings = () => {
    let settings = {
      dots: movies.length > 3,
      infinite: movies.length > 3,
      speed: 200,
      slidesToShow: Math.min(6, movies.length),
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 3000,
    };
    return settings;
  };

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        align="left"
        sx={{
          mb: 3,
          ml: 3,
          fontWeight: "bold",
          fontFamily: "'Poppins', Raleway",
          fontSize: "1.5rem",
        }}
        color="text.primary"
      >
        {category}
      </Typography>
      <Box
        sx={{
          padding: "0.5rem",
          marginRight: "30px",
          marginLeft: "30px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)",
          backgroundColor: "rgba(0, 0, 0, 0.25)",
        }}
      >
        <Slider {...getDynamicSettings()}>
          {movies.map((movie) => (
            <Box
              key={movie.id}
              className="poster-wrapper"
              onClick={() => onMovieClick(movie.id.toString())}
              sx={{
                ":hover": {
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                  zIndex: "1",
                  cursor: "pointer",
                },
                width: "16.66%",
                flexShrink: 0,
              }}
            >
              <img
                src={movie.image_url}
                alt={movie.title}
                className="movie-poster"
                style={{
                  transition: "all 0.35s ease",
                  zIndex: "2",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              />
              {movie.averageRating && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 54,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    borderRadius: "5px",
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 8px',
                  }}
                >
                  <StarIcon sx={{ color: "#f3ce13", marginRight: 1 }} />
                  <Typography
                    variant="subtitle2"
                    component="div"
                    sx={{
                      color: "white",
                      marginRight: 0.2,
                      fontWeight: 'bold',
                    }}
                  >
                    {movie.averageRating.toFixed(1)}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    component="div"
                    sx={{
                      color: "white",
                      fontWeight: 'bold',
                    }}
                  >
                  /5
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      color: "white",
                      marginLeft: 1,
                      opacity: 0.7,
                    }}
                  >
                    {movie.reviewCount} {movie.reviewCount === 1 ? 'review' : 'reviews'}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Slider>
      </Box>
    </>
  );
};

export default MovieCarousel;
