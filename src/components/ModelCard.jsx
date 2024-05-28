import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ModelViewer from "./ModelViewer";
import { Blocks } from "react-loader-spinner";

const ModelCard = ({ model, onView }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Start loading when the component mounts or the model changes
  }, [model.modelUrl]);

  const handleModelLoad = () => {
    setIsLoading(false); // Model loaded successfully
  };

  const handleModelError = () => {
    setIsLoading(false); // Handle error case
  };

  return (
    <Card>
      <div
        style={{
          height: "200px",
          padding: "5px",
          position: "relative",
          backgroundColor: "gray",
        }}
      >
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Blocks
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              visible={true}
            />
          </div>
        )}
        <div
          style={{
            visibility: isLoading ? "hidden" : "visible",
            height: "100%",
          }}
        >
          <ModelViewer
            modelUrl={model.modelUrl}
            onLoad={handleModelLoad}
            onError={handleModelError}
          />
        </div>
      </div>
      <CardContent
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Typography gutterBottom variant="h5" component="div">
            {model.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {model.description}
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onView(model)}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
};

ModelCard.propTypes = {
  model: PropTypes.shape({
    modelUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onView: PropTypes.func.isRequired,
};

export default ModelCard;
