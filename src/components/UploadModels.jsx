import { useState } from 'react';
import { Button, TextField, Modal, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { db, storage } from '../db/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import useAlert from '../hooks/useAlert';
import ModelPreview from './ModelPreview';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const UploadModels = ({ open, handleClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modelFiles, setModelFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, AlertComponent } = useAlert();

  const onDrop = (acceptedFiles) => {
    setModelFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'model/gltf-binary': ['.glb'] },
    multiple: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const uploadTasks = modelFiles.map(file => {
        const storageRef = ref(storage, `models/${file.name}`);
        return uploadBytes(storageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
      });

      const downloadURLs = await Promise.all(uploadTasks);

      await Promise.all(downloadURLs.map((url, index) => {
        return addDoc(collection(db, 'models'), {
          name,
          description,
          modelUrl: url
        });
      }));

      setName('');
      setDescription('');
      setModelFiles([]);
      showAlert('Model(s) uploaded successfully', 'success');
      handleClose();
    } catch (error) {
      showAlert('Failed to upload model(s). Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Upload 3D Model
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={isLoading}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={isLoading}
            />
            <div
              {...getRootProps()}
              style={{
                border: '2px dashed #ccc',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                marginTop: '20px',
                opacity: isLoading ? 0.5 : 1,
                pointerEvents: isLoading ? 'none' : 'auto',
              }}
            >
              <input {...getInputProps()} disabled={isLoading} />
              {isLoading ? (
                <CircularProgress />
              ) : modelFiles.length ? (
                <Typography>{modelFiles.map(file => file.name).join(', ')}</Typography>
              ) : (
                <Typography>Drag & drop .glb files here, or click to select</Typography>
              )}
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
          </form>
        </Box>
      </Modal>
      <AlertComponent />
    </>
  );
};

export default UploadModels;
