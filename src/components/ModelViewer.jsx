/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import PropTypes from "prop-types";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { Blocks } from "react-loader-spinner"; 

// Model component to load the 3D model
const Model = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    // Add shadow casting for meshes in the loaded GLTF scene
    gltf.scene.traverse((node) => {
      if (node.isMesh) node.castShadow = true;
    });
  }, [gltf]);

  // Render the loaded GLTF scene
  return <primitive object={gltf.scene} scale={1.5} />;
};

Model.propTypes = {
  url: PropTypes.string.isRequired,
};

// Scene component to set up lights, controls, and display the model
const Scene = ({ modelUrl }) => {
  const cameraPosition = useRef([0, 0, 5]);
  const controlsTarget = useRef([0, 0, 0]);

  const handleUpdate = (controls) => {
    // Update camera position and controls target on user interaction
    cameraPosition.current = [
      controls.object.position.x,
      controls.object.position.y,
      controls.object.position.z,
    ];
    controlsTarget.current = [
      controls.target.x,
      controls.target.y,
      controls.target.z,
    ];
  };

  return (
    <>
      {/* Set up lights and controls */}
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
      <pointLight position={[-10, -10, -10]} />
      <OrbitControls
        makeDefault
        target={controlsTarget.current}
        onEnd={(e) => handleUpdate(e.target)}
      />
      {/* Render the model within a Stage */}
      <Stage environment={null}>
        <Model url={modelUrl} />
        {/* Render a plane to receive shadows */}
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
        >
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.5} />
        </mesh>
      </Stage>
    </>
  );
};

// ModelViewer component to manage loading and displaying the model
const ModelViewer = ({ modelUrl, onLoad, onError }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the model asynchronously
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

  // Render loading spinner or the Canvas with the model scene
  return (
    <Box style={{ width: "100%", height: "100%", position: "relative" }}>
      {loading && (
        // Display loading spinner while the model is loading
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1,
          }}
        >
          <Blocks
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            visible={true}
          />
        </Box>
      )}
      {/* Render Canvas with the model scene */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "gray" }}
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
