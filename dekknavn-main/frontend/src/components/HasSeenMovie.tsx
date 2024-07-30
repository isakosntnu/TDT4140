import React from "react";

type SeenButtonProps = {
    movieId: number;
    onMarkedAsSeen?: () => void; 
  };

const SeenButton: React.FC<SeenButtonProps> = ({
  movieId,
  onMarkedAsSeen,
}) => {
  // ### ChatGPT
  const markMovieAsSeen = async () => {
    try {
      const response = await fetch(`/movies/${movieId}/mark-as-seen/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Important for session-based auth
      });

      if (response.ok) {
        console.log("Movie marked as seen successfully.");
        if (onMarkedAsSeen) onMarkedAsSeen(); 
      } else {
        console.error("Failed to mark movie as seen.");
      }
    } catch (error) {
      console.error("Error marking movie as seen:", error);
    }
  };
  // ###

  return <button onClick={markMovieAsSeen}>Mark as Seen</button>;
};

export default SeenButton;
