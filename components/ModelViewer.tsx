import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html } from '@react-three/drei';
import Loader from './Loader';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ModelViewer Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const Model: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  // @ts-ignore
  return <primitive object={scene} />;
};

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  return (
    <div className="w-full h-full bg-glass-bg backdrop-blur-lg border border-glass-border rounded-xl overflow-hidden">
      <ErrorBoundary fallback={
          <div className="w-full h-full flex items-center justify-center text-text-secondary flex-col gap-2">
              <p>Unable to load 3D Model.</p>
              <button onClick={() => window.location.reload()} className="text-accent hover:underline text-sm">Reload</button>
          </div>
      }>
          <Canvas camera={{ fov: 45 }}>
            <Suspense fallback={
              <Html center>
                <div className="text-text-primary">
                  <Loader size="lg" />
                </div>
              </Html>
            }>
              <Stage environment="studio" intensity={0.6} {...({ contactShadow: { opacity: 0.5, blur: 2 } } as any)}>
                <Model url={modelUrl} />
              </Stage>
            </Suspense>
            <OrbitControls autoRotate enableZoom={true} enablePan={true} />
          </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default ModelViewer;