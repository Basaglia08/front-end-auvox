import { useEffect, useRef, useState } from "react";
import "../styles/interactive-globe.css";
// Pontos derivados dos polígonos reais do Natural Earth 110m em src/data/world-countries.json.
import worldDots from "../data/world-dots.json";

const AUTO_ROTATION_SPEED = (Math.PI * 2) / 32000;

const HOTSPOTS = [
  { country: "Brasil", city: "São Paulo", lon: -51.2, lat: -23.5 },
  { country: "Estados Unidos", city: "Nova York", lon: -74, lat: 40.7 },
  { country: "Reino Unido", city: "Londres", lon: -0.1, lat: 51.5 },
  { country: "Alemanha", city: "Berlim", lon: 13.4, lat: 52.5 },
  { country: "Japão", city: "Tóquio", lon: 139.7, lat: 35.7 },
  { country: "Austrália", city: "Sydney", lon: 151.2, lat: -33.9 },
];

const normalizeLongitude = (longitude) => {
  let normalized = longitude;
  while (normalized > Math.PI) normalized -= Math.PI * 2;
  while (normalized < -Math.PI) normalized += Math.PI * 2;
  return normalized;
};

function InteractiveGlobe() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const rotationRef = useRef(-0.55);
  const tiltRef = useRef(0.08);
  const pointerRef = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    velocity: 0,
    lastInteraction: 0,
  });
  const projectionsRef = useRef([]);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let animationFrame;
    let lastFrame = performance.now();
    let width = 0;
    let height = 0;
    let radius = 0;
    let centerX = 0;
    let centerY = 0;

    const resizeCanvas = () => {
      const bounds = wrapper.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      radius = Math.min(width, height) * 0.42;
      centerX = width * 0.52;
      centerY = height * 0.5;
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const projectPoint = (longitude, latitude) => {
      const latitudeRadians = (latitude * Math.PI) / 180;
      const longitudeRadians = normalizeLongitude(
        (longitude * Math.PI) / 180 - rotationRef.current,
      );
      const cosLatitude = Math.cos(latitudeRadians);
      const frontX = cosLatitude * Math.sin(longitudeRadians);
      const frontY = Math.sin(latitudeRadians);
      const frontZ = cosLatitude * Math.cos(longitudeRadians);
      const tilt = tiltRef.current;
      const projectedY = frontY * Math.cos(tilt) - frontZ * Math.sin(tilt);
      const depth = frontY * Math.sin(tilt) + frontZ * Math.cos(tilt);

      return {
        x: centerX + frontX * radius,
        y: centerY - projectedY * radius,
        depth,
      };
    };

    const drawGuides = () => {
      context.save();
      context.strokeStyle = "rgba(242, 181, 68, 0.13)";
      context.lineWidth = 1;

      context.beginPath();
      context.ellipse(centerX, centerY, radius * 0.99, radius * 0.28, 0, 0, Math.PI * 2);
      context.stroke();

      context.beginPath();
      context.ellipse(centerX, centerY, radius * 0.38, radius * 0.99, 0, 0, Math.PI * 2);
      context.stroke();

      context.strokeStyle = "rgba(242, 181, 68, 0.08)";
      context.beginPath();
      context.ellipse(centerX, centerY, radius * 0.76, radius * 0.99, 0, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    };

    const draw = (timestamp) => {
      const elapsed = Math.min(timestamp - lastFrame, 80);
      lastFrame = timestamp;
      const pointer = pointerRef.current;

      if (!pointer.active) {
        pointer.velocity *= Math.pow(0.08, elapsed / 1000);
        if (Math.abs(pointer.velocity) > 0.00001) {
          rotationRef.current += pointer.velocity * elapsed;
        }

        const idleTime = timestamp - pointer.lastInteraction;
        if (!reducedMotion && idleTime > 900) {
          rotationRef.current += AUTO_ROTATION_SPEED * elapsed;
          tiltRef.current *= Math.pow(0.3, elapsed / 1000);
        }
      }

      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        centerX - radius * 0.2,
        centerY - radius * 0.3,
        radius * 0.12,
        centerX,
        centerY,
        radius * 1.14,
      );
      glow.addColorStop(0, "rgba(242, 181, 68, 0.08)");
      glow.addColorStop(0.68, "rgba(242, 181, 68, 0.025)");
      glow.addColorStop(1, "rgba(242, 181, 68, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      context.fill();

      const globeFill = context.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.42,
        radius * 0.08,
        centerX,
        centerY,
        radius * 1.03,
      );
      globeFill.addColorStop(0, "rgba(37, 39, 42, 0.52)");
      globeFill.addColorStop(0.72, "rgba(18, 21, 28, 0.35)");
      globeFill.addColorStop(1, "rgba(10, 13, 18, 0.08)");
      context.fillStyle = globeFill;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fill();

      drawGuides();

      worldDots.forEach(([longitude, latitude]) => {
        const point = projectPoint(longitude, latitude);
        if (point.depth < -0.04) return;

        const alpha = 0.12 + Math.max(point.depth, 0) * 0.66;
        const size = 0.65 + Math.max(point.depth, 0) * 0.9;
        context.fillStyle = "rgba(242, 181, 68, " + alpha + ")";
        context.beginPath();
        context.arc(point.x, point.y, size, 0, Math.PI * 2);
        context.fill();
      });

      const projections = [];
      HOTSPOTS.forEach((hotspot, index) => {
        const point = projectPoint(hotspot.lon, hotspot.lat);
        if (point.depth < 0.04) return;

        const pulse = reducedMotion ? 2.8 : 2.8 + Math.sin(timestamp / 520 + index) * 0.9;
        context.fillStyle = "rgba(255, 211, 112, 0.16)";
        context.beginPath();
        context.arc(point.x, point.y, pulse * 3, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#f2b544";
        context.beginPath();
        context.arc(point.x, point.y, pulse * 0.6, 0, Math.PI * 2);
        context.fill();
        projections.push({ ...hotspot, x: point.x, y: point.y });
      });

      context.strokeStyle = "rgba(242, 181, 68, 0.22)";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.stroke();
      projectionsRef.current = projections;

      animationFrame = requestAnimationFrame(draw);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(wrapper);
    animationFrame = requestAnimationFrame(draw);

    const handlePointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const pointer = pointerRef.current;

      if (pointer.active) {
        const deltaX = event.clientX - pointer.lastX;
        const deltaY = event.clientY - pointer.lastY;
        rotationRef.current -= deltaX * 0.008;
        tiltRef.current = Math.max(-0.42, Math.min(0.42, tiltRef.current + deltaY * 0.0025));
        pointer.velocity = Math.max(-0.004, Math.min(0.004, -deltaX * 0.0008));
        pointer.lastX = event.clientX;
        pointer.lastY = event.clientY;
        setHoveredHotspot(null);
        return;
      }

      const hovered = projectionsRef.current.find((point) => (
        Math.hypot(point.x - x, point.y - y) < 12
      ));
      setHoveredHotspot(hovered || null);
    };

    const handlePointerDown = (event) => {
      const pointer = pointerRef.current;
      pointer.active = true;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      pointer.velocity = 0;
      pointer.lastInteraction = performance.now();
      setIsDragging(true);
      canvas.setPointerCapture?.(event.pointerId);
    };

    const stopDragging = (event) => {
      const pointer = pointerRef.current;
      pointer.active = false;
      pointer.lastInteraction = performance.now();
      setIsDragging(false);
      if (event?.pointerId !== undefined) {
        canvas.releasePointerCapture?.(event.pointerId);
      }
    };

    const handlePointerLeave = () => {
      if (!pointerRef.current.active) setHoveredHotspot(null);
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", stopDragging);
    canvas.addEventListener("pointercancel", stopDragging);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", stopDragging);
      canvas.removeEventListener("pointercancel", stopDragging);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const tooltipStyle = hoveredHotspot
    ? { left: hoveredHotspot.x, top: hoveredHotspot.y }
    : undefined;

  return (
    <div
      ref={wrapperRef}
      className={"interactive-globe" + (isDragging ? " is-dragging" : "")}
      aria-label="Globo terrestre interativo"
    >
      <canvas
        ref={canvasRef}
        className="interactive-globe-canvas"
        role="img"
        aria-label="Globo terrestre com pontos de atuação da Auvox"
      />
      {hoveredHotspot && (
        <div className="globe-tooltip" style={tooltipStyle}>
          <span className="globe-tooltip-dot" />
          <span>
            <strong>{hoveredHotspot.country}</strong>
            <small>{hoveredHotspot.city}</small>
          </span>
        </div>
      )}
    </div>
  );
}

export default InteractiveGlobe;
