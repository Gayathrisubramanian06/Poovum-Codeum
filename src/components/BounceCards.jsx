import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './BounceCards.css';

export default function BounceCards({
  className = '',
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)'
  ],
  enableHover = true
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.card',
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const getNoRotationTransform = transformStr => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    } else if (transformStr === 'none') {
      return 'rotate(0deg)';
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const handleMouseEnter = index => {
    if (!enableHover || !containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.card');
    cards.forEach((card, i) => {
      if (i === index) {
        gsap.to(card, {
          transform: `${getNoRotationTransform(transformStyles[i] || '')} scale(1.1)`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        gsap.to(card, {
          transform: transformStyles[i] || 'none',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  };

  const handleMouseLeave = () => {
    if (!enableHover || !containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.card');
    cards.forEach((card, i) => {
      gsap.to(card, {
        transform: transformStyles[i] || 'none',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  };

  return (
    <div
      ref={containerRef}
      className={`bounceCardsContainer ${className}`}
      style={{
        position: 'relative',
        width: containerWidth,
        height: containerHeight
      }}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className="card"
          style={{
            transform: transformStyles[idx] || 'none'
          }}
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={handleMouseLeave}
        >
          <img className="card-image" src={src} alt={`card-${idx}`} />
        </div>
      ))}
    </div>
  );
}
