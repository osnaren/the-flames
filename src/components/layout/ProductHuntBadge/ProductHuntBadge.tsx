/* eslint-disable @next/next/no-img-element -- third-party SVG badge, rendered as-is */
const BADGE = 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1049795';
const ALT = 'The FLAMES - The classic notebook game, now cinematic and web-perfect. | Product Hunt';

/**
 * Official Product Hunt "Featured" badge. It sits in the footer, so both theme
 * variants lazy-load and the hidden one is never fetched.
 */
export const ProductHuntBadge = () => {
  return (
    <a
      href="https://www.producthunt.com/products/the-flames?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-the-flames"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="The FLAMES on Product Hunt"
      className="inline-block rounded-xl transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
    >
      <img
        src={`${BADGE}&theme=light`}
        alt={ALT}
        width={250}
        height={54}
        loading="lazy"
        decoding="async"
        className="h-[54px] w-[250px] dark:hidden"
      />
      <img
        src={`${BADGE}&theme=dark`}
        alt={ALT}
        width={250}
        height={54}
        loading="lazy"
        decoding="async"
        className="hidden h-[54px] w-[250px] dark:block"
      />
    </a>
  );
};

export default ProductHuntBadge;
