import React, { useEffect, useRef } from 'react';
import styles from '../styles/components/ParticleBackground.module.css';

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let waves = [];

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Wave configuration
        class Wave {
            constructor(yOffset, speed, amplitude, frequency, opacity, color) {
                this.yOffset = yOffset;
                this.speed = speed;
                this.amplitude = amplitude;
                this.frequency = frequency;
                this.opacity = opacity;
                this.color = color;
                this.increment = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);

                for (let x = 0; x < canvas.width; x++) {
                    const y = this.yOffset +
                        Math.sin((x * this.frequency) + this.increment) * this.amplitude;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();

                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;

                this.increment += this.speed;
            }
        }

        // Create waves with different colors and properties
        waves = [
            new Wave(canvas.height * 0.7, 0.01, 50, 0.01, 0.05, '#667eea'),
            new Wave(canvas.height * 0.75, 0.015, 40, 0.012, 0.08, '#4facfe'),
            new Wave(canvas.height * 0.8, 0.02, 35, 0.015, 0.1, '#764ba2'),
            new Wave(canvas.height * 0.85, 0.008, 30, 0.018, 0.06, '#8b5cf6')
        ];

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            waves.forEach(wave => {
                wave.draw();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default ParticleBackground;
