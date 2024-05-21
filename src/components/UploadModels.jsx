import { useState, useCallback } from 'react';
import { Button, TextField, Modal, Box, Typography, IconButton } from '@mui/material';
import { db } from '../db/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import useAlert from '../hooks/useAlert';

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

// eslint-disable-next-line react/prop-types
const UploadModels = ({ open, handleClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modelFile, setModelFile] = useState(null);
  const [preview, setPreview] = useState('');
  const { showAlert } = useAlert();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'model/gltf-binary') {
      setModelFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
        showAlert('Please upload a valid .glb file', 'error');
    }
  }, [showAlert]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.glb',
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Upload the file to your server or storage service
    // Here, we are just uploading the file metadata to Firestore
    await addDoc(collection(db, 'models'), {
      name,
      description,
      modelUrl: modelFile.name, // Replace with actual URL after upload
    });
    setName('');
    setDescription('');
    setModelFile(null);
    setPreview('');
    handleClose(); // Close the modal after submitting
  };

  return (
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
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <div {...getRootProps()} style={{
            border: '2px dashed #ccc',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            marginTop: '20px'
          }}>
            <input {...getInputProps()} />
            {modelFile ? (
              <Typography>{modelFile.name}</Typography>
            ) : (
              <Typography>Drag & drop a .glb file here, or click to select one</Typography>
            )}
          </div>
          {preview && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Typography>Preview:</Typography>
              <iframe
                src={preview}
                title="Model Preview"
                width="400px"
                height="400px"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Upload
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UploadModels;
