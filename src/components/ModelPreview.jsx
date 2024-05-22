import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, getBytes } from 'firebase/storage';
import { storage } from '../db/FirebaseConfig';

const Model = ({ gltf }) => {
  const { scene } = useGLTF(gltf, true);
  return <primitive object={scene} scale={0.4} />;
};

const ModelViewer = ({ modelFileName }) => {
  const [gltf, setGltf] = useState(null);

  useEffect(() => {
    const getModelData = async () => {
      try {
        const modelRef = ref(storage, modelFileName);
        const modelBytes = await getBytes(modelRef);
        setGltf(modelBytes);
      } catch (error) {
        console.error('Error fetching model data:', error);
      }
    };

    getModelData();
  }, [modelFileName]);

  return (
    <Canvas style={{ width: '400px', height: '400px' }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <OrbitControls />
      {gltf && <Model gltf={gltf} />}
    </Canvas>
  );
};

export default ModelViewer;
