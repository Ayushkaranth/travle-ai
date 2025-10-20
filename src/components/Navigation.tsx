import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { motion } from "framer-motion";

interface NavigationProps {
  activeTab: "builder" | "suggested";
  onTabChange: (tab: "builder" | "suggested") => void;
  onLogoClick: () => void;
}

export const Navigation = ({
  activeTab,
  onTabChange,
  onLogoClick,
}: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TravelAI
          </span>
        </button>

        <div className="flex items-center gap-4">
          <NavItem
            label="Plan Trip"
            isActive={activeTab === "builder"}
            onClick={() => onTabChange("builder")}
          />
          <NavItem
            label="Discover"
            isActive={activeTab === "suggested"}
            onClick={() => onTabChange("suggested")}
          />
        </div>
      </div>
    </nav>
  );
};

// A helper component to manage the active state and animated underline
const NavItem = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="relative text-base"
    >
      {label}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          layoutId="nav-underline" // This ID links the animations
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Button>
  );
};