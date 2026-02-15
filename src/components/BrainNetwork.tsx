import React, { useRef, useEffect, useMemo } from 'react';

interface Node {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  label: string;
  type: 'capability' | 'knowledge' | 'task';
}

const COLORS = {
  capability: 'rgba(59, 130, 246, 0.8)',
  knowledge: 'rgba(168, 85, 247, 0.8)',
  task: 'rgba(255, 255, 255, 0.6)',
};

const LABELS = [
  { text: 'NLP Engine', type: 'capability' },
  { text: 'Knowledge Base', type: 'knowledge' },
  { text: 'Neural Index', type: 'knowledge' },
  { text: 'Code Synthesis', type: 'capability' },
  { text: 'Visual Logic', type: 'capability' },
  { text: 'System Core', type: 'task' },
  { text: 'Agent Sync', type: 'task' },
  { text: 'Data Pipeline', type: 'knowledge' },
];

const BrainNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const rotationRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(300);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => {
    const n: Node[] = [];
    for (let i = 0; i < 70; i++) {
      const phi = Math.random() * Math.PI * 2;
      const costheta = Math.random() * 2 - 1;
      const u = Math.random();
      const theta = Math.acos(costheta);
      const r = 120 * Math.pow(u, 1 / 3);

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi) * 1.2;
      const z = r * Math.cos(theta);

      const labelObj = LABELS[i % LABELS.length];
      n.push({
        x, y, z,
        size: Math.random() * 4 + 3,
        color: COLORS[labelObj.type as keyof typeof COLORS],
        label: i < LABELS.length ? labelObj.text : '',
        type: labelObj.type as Node['type'],
      });
    }
    return n;
  }, []);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isDragging.current) {
      rotationRef.current.y += 0.003;
      rotationRef.current.x += 0.001;
    }

    const cosY = Math.cos(rotationRef.current.y);
    const sinY = Math.sin(rotationRef.current.y);
    const cosX = Math.cos(rotationRef.current.x);
    const sinX = Math.sin(rotationRef.current.x);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const focalLength = 500;

    const projectedNodes = nodes.map((node) => {
      let x = node.x * cosY - node.z * sinY;
      let z = node.z * cosY + node.x * sinY;
      let y = node.y * cosX - z * sinX;
      z = z * cosX + node.y * sinX;

      const depth = z + zoomRef.current;
      const scale = depth > 10 ? focalLength / depth : 0;

      return { px: centerX + x * scale, py: centerY + y * scale, pz: z, scale, ...node };
    });

    ctx.lineWidth = 0.5;
    for (let i = 0; i < projectedNodes.length; i++) {
      for (let j = i + 1; j < projectedNodes.length; j++) {
        const a = projectedNodes[i];
        const b = projectedNodes[j];
        if (a.scale === 0 || b.scale === 0) continue;

        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
        if (dist < 90) {
          const alpha = (1 - dist / 90) * 0.2 * (a.scale / 4);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.2, alpha)})`;
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          ctx.stroke();
        }
      }
    }

    projectedNodes.sort((a, b) => b.pz - a.pz).forEach((node) => {
      if (node.scale === 0) return;
      const opacity = Math.min(1, Math.max(0, node.scale / 2));
      const renderedSize = node.size * (node.scale / 3);

      ctx.beginPath();
      ctx.arc(node.px, node.py, Math.max(1, renderedSize), 0, Math.PI * 2);
      ctx.fillStyle = node.color.replace('0.8', opacity.toString());
      ctx.fill();

      if (node.type === 'capability') {
        ctx.shadowBlur = 20 * (node.scale / 3);
        ctx.shadowColor = node.color;
      } else {
        ctx.shadowBlur = 0;
      }

      if (node.label && node.pz < 0 && node.scale > 1.2) {
        ctx.font = `bold ${Math.round(10 * (node.scale / 4))}px Inter`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
        ctx.fillText(node.label, node.px + renderedSize + 4, node.py + 4);
      }
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      rotationRef.current.y += deltaX * 0.005;
      rotationRef.current.x += deltaY * 0.005;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const move = e.deltaY * 0.6;
      zoomRef.current = Math.min(Math.max(50, zoomRef.current + move), 1000);
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    handleResize();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(requestRef.current);
    };
  }, [nodes]);

  return (
    <div className="w-full h-full relative group">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />
      <div className="absolute top-4 left-4 pointer-events-none select-none">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] animate-pulse">Neural Handshake Active</span>
          <span className="text-[9px] text-zinc-600 uppercase font-medium tracking-tight">Drag: Rotate | Wheel: Deep Zoom</span>
        </div>
      </div>
    </div>
  );
};

export default BrainNetwork;
