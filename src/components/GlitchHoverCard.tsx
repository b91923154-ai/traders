import { motion } from "framer-motion";

interface GlitchHoverCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
}

export function GlitchHoverCard({
  children,
  className = "",
  style = {},
  active = false,
}: GlitchHoverCardProps) {
  return (
    <motion.div
      animate={{
        backgroundColor: active ? "rgba(201,255,0,0.05)" : "rgba(10,17,10,0.9)",
        borderColor: active ? "rgba(201,255,0,0.5)" : "rgba(255,255,255,0.1)",
        boxShadow: active
          ? "0 0 40px rgba(201,255,0,.25)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{
        duration: 0.35,
      }}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary"
        animate={{
          scaleY: active ? 1 : 0,
        }}
        style={{
          transformOrigin: "top",
        }}
        transition={{
          duration: 0.3,
        }}
      />

      {children}
    </motion.div>
  );
}
