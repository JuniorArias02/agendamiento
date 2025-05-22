import { motion } from "framer-motion";

// src/components/ui/Skeleton.jsx
export default function Skeleton({ className }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
  );
}
