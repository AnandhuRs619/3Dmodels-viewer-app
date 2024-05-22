import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UploadModels from "../components/UploadModels";
import { Grid, Typography } from "@mui/material";
import ModelCard from "../components/ModelCard";
import { db } from "../db/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { RotatingLines } from "react-loader-spinner";

export const DashboardPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'models'));
        const modelsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(modelsData);
        setModels(modelsData);
      } catch (error) {
        console.error("Error fetching models: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return (
    <>
      <Navbar />
      <UploadModels />
      <Grid container spacing={3} style={{ padding: '20px' }}>
        {loading ? (
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
        ) : models.length === 0 ? (
          <Typography variant="h6" component="p" style={{ margin: '20px auto' }}>
            No models have been added yet.
          </Typography>
        ) : (
          models.map((model) => (
            <Grid item xs={12} sm={6} md={4} key={model.id}>
              <ModelCard model={model} />
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};
