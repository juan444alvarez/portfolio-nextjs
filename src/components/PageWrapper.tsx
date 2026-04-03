"use client";

import { HTMLMotionProps, motion } from "framer-motion";

const PageWrapper = (props: HTMLMotionProps<"div">) => {
  return (
    <div className="bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.15}}
        {...props}
      />
    </div>
  );
};

export default PageWrapper;