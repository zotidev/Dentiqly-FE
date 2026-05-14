import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const text = "Los equipos clínicos usan Dentiqly para elevar la calidad en cada interacción con el paciente, unificando la gestión médica y administrativa en una única plataforma que mejora continuamente la eficiencia de toda la clínica.";
const words = text.split(" ");

export const ScrollRevealSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%", // Scroll 1.5x the height of the section to complete the animation
          pin: true,
          scrub: 1,
        }
      });

      // Text Reveal Animation
      const wordSpans = textRef.current?.querySelectorAll('.reveal-word');
      if (wordSpans) {
        tl.to(wordSpans, {
          color: "#0A0F2D",
          stagger: 0.1,
          ease: "none",
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    // Added mb-32 to give breathing room before the next section
    <section ref={sectionRef} className="bg-[#FAFCFF] w-full mb-32 border-b border-transparent">
      <div ref={containerRef} className="h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Text Area */}
        <div className="max-w-[1100px] w-full px-6 mx-auto">
          <p 
            ref={textRef}
            className="text-3xl md:text-5xl lg:text-[56px] font-medium tracking-tight leading-[1.15] text-center flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em]"
          >
            {words.map((word, i) => (
              <span 
                key={i} 
                className="reveal-word inline-block transition-none"
                style={{ color: "#E5E7EB" }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

      </div>
    </section>
  );
};
