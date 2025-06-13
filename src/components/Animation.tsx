import { motion } from 'framer-motion';

function Animation() {
  return (
    <motion.img
      src="logo.png"
      alt="CSS"
      className="h-12 w-12"
      animate={{
        x: [0, -1, 1, -1, 0],
        y: [0, 1, -1, 1, 0],
      }}
      transition={{ duration: 0.4, repeat: Infinity }}
    />
  );
}

export default Animation;
