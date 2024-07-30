// ### ChatGPT

import React, { ReactElement, useState } from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MovieDetailModal from "./MovieDetailModal";

interface PrivateRouteProps extends Omit<RouteProps, "element"> {
  element: ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          {element}
          {modalOpen && (
            <MovieDetailModal
              open={modalOpen}
              handleClose={handleCloseModal}
            />
          )}
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default PrivateRoute;