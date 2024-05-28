import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UploadModels from "../components/UploadModels";
import {
  Grid,
  Typography,
  Button,
  Box,
  Modal,
  IconButton,
} from "@mui/material";
import ModelCard from "../components/ModelCard";
import { db } from "../db/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { RotatingLines } from "react-loader-spinner";
import ModelViewer from "../components/ModelViewer";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "8px",
  outline: "none",
};

export const DashboardPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modelsPerPage] = useState(6);
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "models"));
        const modelsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setModels(modelsData);
      } catch (error) {
        console.error("Error fetching models: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Filter models based on search term

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate models
  const indexOfLastModel = currentPage * modelsPerPage;
  const indexOfFirstModel = indexOfLastModel - modelsPerPage;
  const currentModels = filteredModels.slice(
    indexOfFirstModel,
    indexOfLastModel
  );

  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const maxPageNumbersToShow = 5;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle view model
  const handleView = (model) => {
    setSelectedModel(model);
  };

  const handleClose = () => {
    setSelectedModel(null);
  };
  // Render page numbers for pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const halfPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

    let startPage = Math.max(1, currentPage - halfPageNumbersToShow);
    let endPage = Math.min(totalPages, currentPage + halfPageNumbersToShow);

    if (currentPage <= halfPageNumbersToShow) {
      endPage = Math.min(totalPages, maxPageNumbersToShow);
    } else if (currentPage + halfPageNumbersToShow >= totalPages) {
      startPage = Math.max(1, totalPages - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => paginate(i)}
          variant={i === currentPage ? "contained" : "outlined"}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      <Navbar setSearchTerm={setSearchTerm} />
      <UploadModels />
      <Grid container spacing={3} style={{ padding: "20px" }}>
        {loading ? (
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <RotatingLines
              visible={true}
              height="96"
              width="96"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          </Grid>
        ) : currentModels.length === 0 ? (
          <Typography
            variant="h6"
            component="p"
            style={{ margin: "20px auto" }}
          >
            No models match your search.
          </Typography>
        ) : (
          currentModels.map((model) => (
            <Grid item xs={12} sm={6} md={4} key={model.id}>
              <ModelCard model={model} onView={handleView} />
            </Grid>
          ))
        )}
      </Grid>
      {!loading && filteredModels.length > modelsPerPage && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0",
          }}
        >
          <Button onClick={() => paginate(1)} disabled={currentPage === 1}>
            First
          </Button>
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {renderPageNumbers()}
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
          <Button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </Box>
      )}
      {selectedModel && (
        <Modal
          open={true}
          onClose={handleClose}
          aria-labelledby="model-viewer-modal"
          aria-describedby="model-viewer-modal-description"
        >
          <Box sx={modalStyle}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: "black",
                zIndex: 1,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ height: "calc(100% - 32px)", paddingTop: "32px" }}>
              <ModelViewer
                modelUrl={selectedModel.modelUrl}
                onClose={handleClose}
              />
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};
