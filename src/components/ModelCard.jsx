import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ModelViewer from './ModelViewer';

const ModelCard = ({ model, onView }) => {
  return (
    <Card>
      <div style={{ height: '200px', padding: '5px' }}>
        <ModelViewer modelUrl={model.modelUrl} />
      </div>
      <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography gutterBottom variant="h5" component="div">
            {model.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {model.description}
          </Typography>
        </div>
        <Button variant="contained" color="primary" onClick={() => onView(model)}>
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
