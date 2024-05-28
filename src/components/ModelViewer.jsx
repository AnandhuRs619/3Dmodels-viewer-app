/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import PropTypes from 'prop-types';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState, useRef } from 'react';

const Model = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    gltf.scene.traverse((node) => {
      if (node.isMesh) node.castShadow = true;
    });
  }, [gltf]);

  return <primitive object={gltf.scene} scale={1.5} />;
};

Model.propTypes = {
  url: PropTypes.string.isRequired,
};

const Scene = ({ modelUrl }) => {
  const cameraPosition = useRef([0, 0, 5]);
  const controlsTarget = useRef([0, 0, 0]);

  const handleUpdate = (controls) => {
    cameraPosition.current = [controls.object.position.x, controls.object.position.y, controls.object.position.z];
    controlsTarget.current = [controls.target.x, controls.target.y, controls.target.z];
  };

  return (
    <>
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
      <pointLight position={[-10, -10, -10]} />
      <OrbitControls
        makeDefault
        target={controlsTarget.current}
        onEnd={(e) => handleUpdate(e.target)}
      />
      <Stage environment={null}>
        <Model url={modelUrl} />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.5} />
        </mesh>
      </Stage>
    </>
  );
};

const ModelViewer = ({ modelUrl, onLoad, onError }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      () => {
        setLoading(false);
        if (onLoad) onLoad();
      },
      undefined,
      (error) => {
        setLoading(false);
        if (onError) onError(error);
      }
    );
  }, [modelUrl, onLoad, onError]);

  return (
    <Box style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'gray' }}
      >
        {!loading && <Scene modelUrl={modelUrl} />}
      </Canvas>
    </Box>
  );
};

ModelViewer.propTypes = {
  modelUrl: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default ModelViewer;
