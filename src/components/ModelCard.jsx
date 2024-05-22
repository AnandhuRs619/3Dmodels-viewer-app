import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ModelViewer from './ModelViewer';

// eslint-disable-next-line react/prop-types
const ModelCard = ({ model }) => {
  return (
    <Card>
      <div style={{ height: '300px' }}>
        <ModelViewer modelUrl={model.modelUrl} />
      </div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {model.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {model.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ModelCard;
