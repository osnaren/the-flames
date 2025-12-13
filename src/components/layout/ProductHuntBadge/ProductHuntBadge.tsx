import { motion } from 'framer-motion';
import Image from 'next/image';

export const ProductHuntBadge = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="inline-block"
    >
      <a
        href="https://www.producthunt.com/products/the-flames?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-the&#0045;flames"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="The FLAMES on Product Hunt"
      >
        <Image
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1049795&theme=light&t=1765634432956"
          alt="The FLAMES - The classic notebook game, now cinematic and web-perfect. | Product Hunt"
          width={200}
          height={50}
          style={{ width: '200px', height: '50px' }}
          className="h-[50] w-[200px]"
          unoptimized
        />
      </a>
    </motion.div>
  );
};

export default ProductHuntBadge;
