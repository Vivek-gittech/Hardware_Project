import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { COMPANY, IMAGES } from './constants';

export default function Hero() {
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError ? IMAGES.heroKitchenFallback : IMAGES.heroKitchen;

  return (
    <section className="relative w-full pt-[120px] pb-12 px-6 md:px-10 lg:px-20">
      <div
        className="relative mx-auto overflow-hidden rounded-[2rem] md:rounded-[2.5rem]"
        style={{ maxWidth: '1320px', height: '550px' }}
      >
        {/* Background image */}
        <img
          src={imgSrc}
          alt="Luxury modular kitchen with walnut cabinets and premium cabinet handles"
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(48,40,32,0.72) 0%, rgba(48,40,32,0.35) 50%, rgba(48,40,32,0.55) 100%)',
          }}
        />

        {/* Subtle zoom animation on image */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        >
          <img
            src={imgSrc}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-0"
          />
        </motion.div>

        {/* Content overlay */}
        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-12 lg:px-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 inline-block w-fit rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-md"
            style={{ background: 'rgba(182,155,112,0.3)', border: '1px solid rgba(182,155,112,0.4)' }}
          >
            Premium Furniture Hardware
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ maxWidth: '620px' }}
          >
            Premium Hardware for{' '}
            <span style={{ color: '#B69B70' }}>Beautiful Spaces</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-5 text-base leading-relaxed text-gray-200 sm:text-lg"
            style={{ maxWidth: '480px' }}
          >
            Discover beautifully engineered furniture fittings for modern living — crafted with precision, designed to last.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              style={{ background: '#B69B70' }}
            >
              Explore Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              <Phone className="h-4 w-4" />
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
