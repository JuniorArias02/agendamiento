import { motion } from "framer-motion";

export default function Skeleton({ className }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
  );
}
