import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ModelViewer from './ModelViewer';

const ModelCard = ({ model }) => {
  return (
    <Card>
      <div style={{ height: '200px', padding: '5px' }}>
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

ModelCard.propTypes = {
  model: PropTypes.shape({
    modelUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default ModelCard;
