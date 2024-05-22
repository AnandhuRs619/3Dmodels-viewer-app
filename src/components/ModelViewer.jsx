/* eslint-disable react/no-unknown-property */
import PropTypes from 'prop-types';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { CircularProgress, Box } from '@mui/material';


const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  scene.traverse((node) => {
    if (node.isMesh)node.castShadow = true;
  });
//   eslint-disable-next-line react/no-unknown-property
  return <primitive object={scene} scale={0.4} />;
};

Model.propTypes = {
  url: PropTypes.string.isRequired,
};

const ModelViewer = ({ modelUrl }) => {
  return (
    <Box style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'gray' }}
      >
        <ambientLight intensity={1.5}/>
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} />
        <OrbitControls />
        <Suspense fallback={<CircularProgress />}>
          <Model url={modelUrl} />
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.4} />
          </mesh>
        </Suspense>
      </Canvas>
    </Box>
  );
};

ModelViewer.propTypes = {
  modelUrl: PropTypes.string.isRequired,
};

export default ModelViewer;
