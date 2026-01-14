import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: "teal" | "coral" | "default";
  onClick?: () => void;
  className?: string;
}

const colorVariants = {
  teal: "hover:border-primary/50 group-hover:text-primary",
  coral: "hover:border-accent/50 group-hover:text-accent",
  default: "hover:border-muted-foreground/30",
};

const iconBgVariants = {
  teal: "bg-primary/10 text-primary",
  coral: "bg-accent/10 text-accent",
  default: "bg-muted text-muted-foreground",
};

export function FeatureCard({
  icon,
  title,
  description,
  color = "default",
  onClick,
  className,
}: FeatureCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-2xl border-2 border-border bg-card p-6 text-left transition-all duration-300",
        "hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        colorVariants[color],
        className
      )}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300",
          iconBgVariants[color]
        )}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
      
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.button>
  );
}
