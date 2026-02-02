import { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMediaQuery";

export const HeroGallery = ({
  animationDelay = 0.5,
}: {
  animationDelay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // First make the container visible with a fade-in
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    // Then start the photo animations after a short delay
    const animationTimer = setTimeout(
      () => {
        setIsLoaded(true);
      },
      (animationDelay + 0.4) * 1000
    ); // Add 0.4s for the opacity transition

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1, // Reduced from 0.3 to 0.1 since we already have the fade-in delay
      },
    },
  };

  // Animation variants for each photo
  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      // Keep the same z-index throughout animation
    }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0, // No rotation
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15, // Explicit delay based on order
      },
    }),
  };

  // Photo size based on screen size
  const photoSize = isMobile ? 140 : 220;

  // Photo positions
  // Desktop: horizontal layout with random y offsets
  // Mobile: 2 rows (top 3, bottom 2)
  const photos = [
    {
      id: 1,
      order: 0,
      x: isMobile ? "-85px" : "-320px",
      y: isMobile ? "0px" : "15px",
      zIndex: 50,
      direction: "left" as Direction,
      rotation: -4,
      src: "https://nuri-injun-wedding-card.s3.ap-northeast-2.amazonaws.com/2CC3E1B3-88CA-47F3-97BC-9A4D2B96D888.webp",
    },
    {
      id: 2,
      order: 1,
      x: isMobile ? "0px" : "-160px",
      y: isMobile ? "10px" : "32px",
      zIndex: 40,
      direction: "right" as Direction,
      rotation: 2,
      src: "https://nuri-injun-wedding-card.s3.ap-northeast-2.amazonaws.com/8DA8EF17-0163-436B-B2B1-F280C62A7B07.webp",
    },
    {
      id: 3,
      order: 2,
      x: isMobile ? "85px" : "0px",
      y: isMobile ? "5px" : "8px",
      zIndex: 30,
      direction: "left" as Direction,
      rotation: -3,
      src: "https://nuri-injun-wedding-card.s3.ap-northeast-2.amazonaws.com/96D6A27E-3B75-4FA5-BEC9-A8FECE8263F6.webp",
    },
    {
      id: 4,
      order: 3,
      x: isMobile ? "-42px" : "160px",
      y: isMobile ? "90px" : "22px",
      zIndex: 20,
      direction: "right" as Direction,
      rotation: 5,
      src: "https://nuri-injun-wedding-card.s3.ap-northeast-2.amazonaws.com/B06D73C4-800C-4788-B07B-00BCEB7F002C.webp",
    },
    {
      id: 5,
      order: 4,
      x: isMobile ? "42px" : "320px",
      y: isMobile ? "95px" : "44px",
      zIndex: 10,
      direction: "left" as Direction,
      rotation: -2,
      src: "https://nuri-injun-wedding-card.s3.ap-northeast-2.amazonaws.com/55653FFC-F260-40F5-B96D-372CD6E2FE2C.webp",
    },
  ];

  return (
    <div className="mt-20 md:mt-40 relative">
       <div className="absolute inset-0 max-md:hidden top-[200px] -z-10 h-[300px] w-full bg-transparent bg-[linear-gradient(to_right,#c4a052_1px,transparent_1px),linear-gradient(to_bottom,#c4a052_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      <p className="text-[10px] font-bold tracking-[0.5em] text-gold uppercase mb-4 text-center">
        Our Moments
      </p>
      <h3 className="text-3xl md:text-6xl font-light serif-en italic tracking-tight-serif text-[#2a2a2a] text-center">
        A Journey Together
      </h3>
      <div className="relative mt-14 md:mt-12 mb-8 h-[280px] md:h-[350px] w-full items-center justify-center lg:flex">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative" style={{ height: photoSize, width: photoSize }}>
              {/* Render photos in reverse order so that higher z-index photos are rendered later in the DOM */}
              {[...photos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }} // Apply z-index directly in style
                  variants={photoVariants}
                  custom={{
                    x: photo.x,
                    y: photo.y,
                    order: photo.order,
                  }}
                >
                  <HeroPhoto
                    width={photoSize}
                    height={photoSize}
                    src={photo.src}
                    alt="Family photo"
                    direction={photo.direction}
                    rotation={photo.rotation}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
    </div>
  );
};

type Direction = "left" | "right";

export const HeroPhoto = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  rotation = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  rotation?: number;
}) => {
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  function handleMouse(event: {
    currentTarget: { getBoundingClientRect: () => DOMRect };
    clientX: number;
    clientY: number;
  }) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{
        scale: 1.1,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        transform: `rotate(0deg) rotateX(0deg) rotateY(0deg)`,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing"
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm bg-stone-100">
        <motion.img
          className={cn("rounded-3xl object-cover w-full h-full")}
          src={src}
          alt={alt}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
    </motion.div>
  );
};
