import React from "react";
import { Typography, Card, CardContent } from "@mui/material";

interface FavoriteDirectorCardProps {
  directorName: string;
}

const FavoriteDirectorCard: React.FC<FavoriteDirectorCardProps> = ({ directorName }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ textAlign: "center" }} color="text.primary">
          {directorName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FavoriteDirectorCard;