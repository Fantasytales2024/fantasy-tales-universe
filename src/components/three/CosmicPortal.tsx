import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Color } from 'three';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';

interface CosmicPortalProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}

const CosmicPortal = ({ mousePosition, scrollProgress }: CosmicPortalProps) => {
  const portalRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generar partículas para el portal
  const portalParticles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const spiral = new Vector3();
    const color = new Color();

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 20;
      const radius = t * 4;

      spiral.set(
        Math.cos(angle) * radius,
        (t - 0.5) * 2,
        Math.sin(angle) * radius
      );

      spiral.toArray(positions, i * 3);

      // Color dorado con variaciones
      color.setHSL(0.1, 0.8, 0.3 + Math.random() * 0.2);
      color.toArray(colors, i * 3);
    }

    return { positions, colors };
  }, []);

  // Generar partículas flotantes
  const floatingParticles = useMemo(() => {
    return random.inSphere(new Float32Array(2000 * 3), { radius: 5 });
  }, []);

  useFrame((state, delta) => {
    if (portalRef.current && particlesRef.current) {
      // Rotación del portal
      portalRef.current.rotation.z += delta * 0.1;

      // Efecto de mouse
      const mouseX = (mousePosition.x - 0.5) * 2;
      const mouseY = (mousePosition.y - 0.5) * 2;
      portalRef.current.rotation.y = mouseX * 0.2;
      portalRef.current.rotation.x = -mouseY * 0.2;

      // Efecto de scroll
      const scale = 1 + scrollProgress * 0.2;
      portalRef.current.scale.set(scale, scale, scale);

      // Animación de partículas flotantes
      particlesRef.current.rotation.x += delta * 0.05;
      particlesRef.current.rotation.y += delta * 0.075;
    }
  });

  return (
    <>
      {/* Portal espiral */}
      <Points ref={portalRef}>
        <PointMaterial
          transparent
          vertexColors
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
        />
        <primitive object={portalParticles.positions} attach="geometry-attributes-position" />
        <primitive object={portalParticles.colors} attach="geometry-attributes-color" />
      </Points>

      {/* Partículas flotantes */}
      <Points ref={particlesRef}>
        <PointMaterial
          transparent
          color="#ffd700"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
        />
        <primitive object={floatingParticles} attach="geometry-attributes-position" />
      </Points>
    </>
  );
};

export default CosmicPortal; 