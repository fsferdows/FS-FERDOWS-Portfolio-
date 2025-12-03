import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AuroraBackgroundProps {
    color: string;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ color }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const materialRef = useRef<THREE.PointsMaterial | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        // Setup Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 20;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio for performance
        containerRef.current.appendChild(renderer.domElement);

        // Particles
        const count = 1500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const originalPositions = new Float32Array(count * 3);

        for(let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.12,
            color: new THREE.Color(color),
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        
        materialRef.current = material;

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Animation Loop
        const clock = new THREE.Clock();
        let frameId: number;

        const animate = () => {
            const t = clock.getElapsedTime();
            
            const positions = geometry.attributes.position.array as Float32Array;
            for(let i = 0; i < count; i++) {
                const i3 = i * 3;
                const x = originalPositions[i3];
                const z = originalPositions[i3 + 2];
                
                // Dynamic Wave Calculation
                // Combines sine waves on X and Z axes for organic movement
                const y = Math.sin(x * 0.2 + t * 0.3) * 2.5 + Math.cos(z * 0.1 + t * 0.2) * 1.5;
                
                positions[i3 + 1] = originalPositions[i3 + 1] + y;
            }
            geometry.attributes.position.needsUpdate = true;
            
            // Subtle rotation of the entire system
            points.rotation.y = t * 0.05;

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };

        animate();

        // Handle Resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            
            // Safe cleanup of Three.js resources
            if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []); 

    // Efficiently update color without re-initializing the scene
    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.color.set(color);
        }
    }, [color]);

    return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

export default AuroraBackground;