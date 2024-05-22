import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { CircularProgress, Box, Typography } from '@mui/material';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.4} />;
};

const ModelViewer = ({ modelUrl }) => {
  return (
    <Canvas style={{ width: '400px', height: '400px' }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <OrbitControls />
      <Suspense fallback={<CircularProgress />}>
        <Model url={modelUrl} />
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
