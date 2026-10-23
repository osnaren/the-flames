import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export const ProductHuntBadge = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="inline-block"
    >
      <a
        href="https://www.producthunt.com/products/the-flames"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="The FLAMES on Product Hunt"
        className="inline-flex h-[50px] w-[200px] items-center justify-center gap-3 rounded-xl border border-orange-200 bg-white text-orange-700 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
      >
        <span className="text-left leading-tight">
          <span className="block text-xs">Find us on</span>
          <span className="block text-base font-semibold">Product Hunt</span>
        </span>
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </motion.div>
  );
};

export default ProductHuntBadge;
