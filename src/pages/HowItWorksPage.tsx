import { motion, useInView } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Flame, Heart, Star, BellRing, Sword, Users, RefreshCcw, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const meaningCards = [
  { letter: 'F', meaning: 'Friendship', emoji: '🤝', icon: Users, color: 'text-blue-500' },
  { letter: 'L', meaning: 'Love', emoji: '❤️', icon: Heart, color: 'text-red-500' },
  { letter: 'A', meaning: 'Affection', emoji: '💕', icon: Star, color: 'text-yellow-500' },
  { letter: 'M', meaning: 'Marriage', emoji: '💍', icon: BellRing, color: 'text-purple-500' },
  { letter: 'E', meaning: 'Enemy', emoji: '⚔️', icon: Sword, color: 'text-orange-500' },
  { letter: 'S', meaning: 'Siblings', emoji: '👪', icon: Users, color: 'text-green-500' }
];

export default function HowItWorksPage() {
  const navigate = useNavigate();
  const [isCountingActive, setIsCountingActive] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);

  // Refs for scroll animations
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const meaningRef = useRef(null);

  // Check if sections are in view
  const step1InView = useInView(step1Ref, { once: true, margin: "-100px" });
  const step2InView = useInView(step2Ref, { once: true, margin: "-100px" });
  const step3InView = useInView(step3Ref, { once: true, margin: "-100px" });
  const step4InView = useInView(step4Ref, { once: true, margin: "-100px" });
  const meaningInView = useInView(meaningRef, { once: true, margin: "-100px" });

  const goBack = () => {
    navigate('/');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // FLAMES counting animation
  const startCounting = () => {
    setIsCountingActive(true);
    setCurrentCount(0);
    
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setCurrentCount(count);
      
      if (count >= 8) {
        clearInterval(interval);
        setTimeout(() => {
          setIsCountingActive(false);
          setCurrentCount(0);
        }, 1000);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-6">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={goBack}
            icon={ArrowLeft}
          >
            Back
          </Button>
        </div>

        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="flex justify-center mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              repeatType: "reverse"
            }}
          >
            <Flame className="w-12 h-12 text-orange-500 dark:text-orange-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            How does FLAMES work?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Let us take you behind the sparks...
          </p>
        </motion.div>

        {/* Step-by-Step Tutorial */}
        <motion.div
          className="space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Step 1: Take Two Names */}
          <motion.section 
            ref={step1Ref}
            variants={itemVariants} 
            className="relative"
            style={{
              transform: step1InView ? "none" : "translateY(20px)",
              opacity: step1InView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
            }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-500">
                  1
                </span>
                Take Two Names
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6 relative">
                <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg text-2xl font-medium text-gray-700 dark:text-gray-200">
                  Naren
                </div>
                
                {/* Animated beam connecting the names */}
                <div className="relative w-24 h-12 flex items-center justify-center">
                  {/* Base glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-500/40 to-orange-500/20 rounded-full blur-md"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  
                  {/* Animated particles */}
                  <motion.div
                    className="absolute inset-0 flex items-center"
                    initial={false}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-orange-500"
                      animate={{
                        x: ["0%", "100%"],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                  
                  {/* Main beam line */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 to-orange-600" />
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg text-2xl font-medium text-gray-700 dark:text-gray-200">
                  Priya
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                We start by taking both names and prepare to find their common letters
              </p>
            </Card>
          </motion.section>

          {/* Step 2: Remove Common Letters */}
          <motion.section 
            ref={step2Ref}
            variants={itemVariants} 
            className="relative"
            style={{
              transform: step2InView ? "none" : "translateY(20px)",
              opacity: step2InView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
            }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-500">
                  2
                </span>
                Remove Common Letters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Name 1: Naren</p>
                  <div className="flex flex-wrap gap-2">
                    {['N', 'a', 'r', 'e', 'n'].map((letter, i) => (
                      <motion.span
                        key={i}
                        className={`inline-block px-3 py-1 rounded ${
                          ['a', 'r'].includes(letter.toLowerCase())
                            ? 'bg-red-100 text-red-500 line-through dark:bg-red-900/50'
                            : 'bg-orange-100 dark:bg-orange-900/50'
                        }`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Name 2: Priya</p>
                  <div className="flex flex-wrap gap-2">
                    {['P', 'r', 'i', 'y', 'a'].map((letter, i) => (
                      <motion.span
                        key={i}
                        className={`inline-block px-3 py-1 rounded ${
                          ['a', 'r'].includes(letter.toLowerCase())
                            ? 'bg-red-100 text-red-500 line-through dark:bg-red-900/50'
                            : 'bg-orange-100 dark:bg-orange-900/50'
                        }`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                After removing the common letters (a, r), you are left with 8 letters
              </p>
            </Card>
          </motion.section>

          {/* Step 3: FLAMES Counting Demo */}
          <motion.section 
            ref={step3Ref}
            variants={itemVariants} 
            className="relative"
            style={{
              transform: step3InView ? "none" : "translateY(20px)",
              opacity: step3InView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
            }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-500">
                  3
                </span>
                Count Through FLAMES
              </h2>
              <div className="flex justify-center gap-4 mb-8">
                {['F', 'L', 'A', 'M', 'E', 'S'].map((letter, i) => {
                  const isCurrentLetter = (currentCount % 6) === i && isCountingActive;
                  const isResult = letter === 'A' && !isCountingActive;
                  
                  return (
                    <motion.div
                      key={letter}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg relative
                                ${isResult 
                                  ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-400 dark:bg-yellow-900/50 dark:text-yellow-300' 
                                  : 'bg-gray-100 dark:bg-gray-800'}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ 
                        opacity: 1, 
                        scale: isCurrentLetter ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ 
                        duration: isCurrentLetter ? 0.3 : 0.2,
                        delay: i * 0.2 
                      }}
                    >
                      <span className="text-xl font-bold">{letter}</span>
                      {isCurrentLetter && (
                        <motion.div
                          className="absolute -top-6 text-sm font-medium text-orange-500"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {currentCount + 1}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Count through FLAMES using your remaining letters (8)
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  The 8th letter is <strong>A</strong> (Affection)
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={startCounting}
                  icon={RefreshCcw}
                  disabled={isCountingActive}
                >
                  Replay this step
                </Button>
              </div>
            </Card>
          </motion.section>

          {/* Step 4: Repeat Elimination */}
          <motion.section 
            ref={step4Ref}
            variants={itemVariants} 
            className="relative"
            style={{
              transform: step4InView ? "none" : "translateY(20px)",
              opacity: step4InView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
            }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-500">
                  4
                </span>
                Repeat Elimination
              </h2>
              <div className="space-y-6">
                <div className="flex flex-wrap justify-center gap-4">
                  {['F', 'L', 'M', 'E', 'S'].map((letter, i) => (
                    <motion.div
                      key={letter}
                      className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <span className="text-xl font-bold">{letter}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-gray-600 dark:text-gray-300">
                  Remove <strong>A</strong> and continue counting until only one letter remains
                </p>
              </div>
            </Card>
          </motion.section>

          {/* What Each Letter Means */}
          <motion.section 
            ref={meaningRef}
            variants={itemVariants} 
            className="relative"
            style={{
              transform: meaningInView ? "none" : "translateY(20px)",
              opacity: meaningInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
            }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-8 text-center">
                What Each Letter Means
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meaningCards.map(({ letter, meaning, emoji, icon: Icon, color }) => (
                  <motion.div
                    key={letter}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800 dark:text-white">
                          {letter} - {meaning}
                        </div>
                        <div className="text-2xl">{emoji}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Fun fact */}
              <motion.p 
                className="text-center text-gray-600 dark:text-gray-300 italic mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                "This game ruled every classroom notebook in the 2000s! Try your teacher's name if you dare 😜"
              </motion.p>
            </Card>
          </motion.section>

          {/* Call to Action */}
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              🔥 Ready to discover your FLAMES?
            </h2>
            <Link to="/">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
              >
                Play Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}