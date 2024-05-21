import { useState, useRef, useEffect } from 'react';
import { Button, TextField, Modal, Box, Typography, IconButton } from '@mui/material';
import { db } from '../db/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import useAlert from '../hooks/useAlert';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

const ModelPreview = ({ file }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && file.type === 'model/gltf-binary') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(400, 400);
      containerRef.current.appendChild(renderer.domElement);

      const loader = new GLTFLoader();
      loader.load(URL.createObjectURL(file), (gltf) => {
        scene.add(gltf.scene);
        renderer.render(scene, camera);
      });

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        containerRef.current.removeChild(renderer.domElement);
      };
    }
  }, [file]);

  return <div ref={containerRef} style={{ width: '400px', height: '400px' }} />;
};

const UploadModels = ({ open, handleClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modelFiles, setModelFiles] = useState([]);
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
    try {
      // Upload file metadata to Firestore
        Promise.all(modelFiles.map(file => addDoc(collection(db, 'models'), {
        name,
        description,
        modelUrl: file.name // Replace with actual URL after upload
      })));
      setName('');
      setDescription('');
      setModelFiles([]);
      showAlert('Model(s) uploaded successfully', 'success'); // Show success message
      handleClose(); // Close the modal after submitting
    } catch (error) {
      showAlert('Failed to upload model(s). Please try again later.', 'error'); // Show error message
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
              {modelFiles.length ? (
                <Typography>{modelFiles.map(file => file.name).join(', ')}</Typography>
              ) : (
                <Typography>Drag & drop .glb files here, or click to select</Typography>
              )}
            </div>
            {modelFiles.map((file, index) => (
              <div key={index} style={{ marginTop: '20px', textAlign: 'center' }}>
                <Typography>Preview {file.name}:</Typography>
                {file.type === 'model/gltf-binary' && (
                  <ModelPreview file={file} />
                )}
              </div>
            ))}
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
              Upload
            </Button>
          </form>
        </Box>
      </Modal>
      <AlertComponent />
    </>
  );
};

export default UploadModels;