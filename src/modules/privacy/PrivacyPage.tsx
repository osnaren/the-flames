'use client';

import { SparklesText } from '@/components/magicui/sparkles-text';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Button } from '@/components/shadcn/button';
import { RetroGrid } from '@/components/shadcn/retro-grid';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Cookie,
  Database,
  Eye,
  Globe,
  Heart,
  Lock,
  Mail,
  MessageCircle,
  Scale,
  Shield,
  Sparkles,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { FlamesLetterBadge } from './components/FlamesLetterBadge';
import { PolicySection } from './components/PolicySection';
import { FLAMES_DATA, SECTION_COLORS } from './constants';

/**
 * Privacy Page Component
 *
 * Displays the privacy policy and terms of service
 * with animated sections and playful presentation.
 */
export default function PrivacyPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[70vh] flex-col items-center justify-center space-y-6 overflow-hidden px-4 text-center"
      >
        <RetroGrid className="opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="z-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 backdrop-blur-sm">
            <Shield className="h-5 w-5 text-purple-500" />
            <span className="text-muted-foreground text-sm font-medium">Your Privacy Matters</span>
          </div>

          <SparklesText
            as="h1"
            className="mb-4 text-5xl font-extrabold tracking-tighter md:text-7xl"
            colors={{ first: '#8B5CF6', second: '#EC4899' }}
          >
            Privacy & Terms
          </SparklesText>
          <h2 className="font-heading text-muted-foreground text-xl font-light tracking-wide md:text-2xl">
            The Fun Stuff (Legally Speaking) 🔐
          </h2>
        </motion.div>

        <div className="z-10 mx-auto mt-6 max-w-2xl">
          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-muted-foreground/80 text-base leading-relaxed md:text-lg"
          >
            We believe in keeping things simple, transparent, and as playful as our FLAMES game itself. Here's
            everything you need to know about how we handle your data.
          </TextAnimate>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="z-10 mt-8 flex flex-wrap justify-center gap-2"
        >
          {FLAMES_DATA.map((item, i) => (
            <motion.div
              key={item.letter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
            >
              <FlamesLetterBadge {...item} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Privacy Policy Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="from-primary bg-linear-to-r to-purple-600 bg-clip-text text-transparent">
                Privacy Policy
              </span>{' '}
              🛡️
            </h2>
            <p className="text-muted-foreground text-lg">Last updated: December 2025</p>
          </motion.div>

          <div className="space-y-6">
            <PolicySection
              icon={<Eye className="h-6 w-6" />}
              title="What We Collect"
              index={0}
              color={SECTION_COLORS.collect}
            >
              <p>
                <strong>Spoiler alert:</strong> Almost nothing! Here's the full list:
              </p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>FLAMES Results:</strong> We anonymously record which result (Friends, Love, Affection,
                  Marriage, Enemy, Siblings) was calculated - no names attached!
                </li>
                <li>
                  <strong>Country (Optional):</strong> We detect your country code to show regional trends on our
                  charts. This is done via IP geolocation and is completely anonymous.
                </li>
                <li>
                  <strong>That's literally it!</strong> We don't store the names you enter. They stay in your browser
                  and vanish like yesterday's homework.
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<Database className="h-6 w-6" />}
              title="What We DON'T Collect"
              index={1}
              color={SECTION_COLORS.dontCollect}
            >
              <p>Let's be crystal clear about what never touches our servers:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>❌ The actual names you enter (these stay on your device)</li>
                <li>❌ Your email address (we don't need it)</li>
                <li>❌ Your phone number (we won't call you, promise)</li>
                <li>❌ Your personal identity information</li>
                <li>❌ Your location beyond country-level (we don't track streets)</li>
                <li>❌ Your browser history or other app data</li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<Zap className="h-6 w-6" />}
              title="How We Use Your Data"
              index={2}
              color={SECTION_COLORS.usage}
            >
              <p>The anonymous data we collect is used for:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>📊 Global Charts:</strong> Showing fun statistics like "Most common result today" or "Trending
                  in your country"
                </li>
                <li>
                  <strong>📈 App Improvement:</strong> Understanding which features people enjoy most
                </li>
                <li>
                  <strong>🌍 Regional Insights:</strong> Displaying anonymous trends by country
                </li>
              </ul>
              <p className="mt-4 rounded-lg bg-green-500/10 p-3 text-green-600 dark:text-green-400">
                <strong>Bottom line:</strong> Your crush's name + your name = stays on YOUR device. We only see "Love
                was the result" - nothing more!
              </p>
            </PolicySection>

            <PolicySection
              icon={<Cookie className="h-6 w-6" />}
              title="Cookies & Local Storage"
              index={3}
              color={SECTION_COLORS.cookies}
            >
              <p>We use browser storage for a delightful experience:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>Theme Preference:</strong> Light/dark mode setting
                </li>
                <li>
                  <strong>Animation Settings:</strong> Whether you prefer fancy animations or simple mode
                </li>
                <li>
                  <strong>Sound Settings:</strong> Your audio preference for effects
                </li>
                <li>
                  <strong>Recent Pairings:</strong> History of your recent games (stored locally, never sent to us)
                </li>
              </ul>
              <p className="mt-4 text-amber-600 italic dark:text-amber-400">
                These are NOT tracking cookies - they're just your personal settings that live in your browser! 🍪
              </p>
            </PolicySection>

            <PolicySection
              icon={<Lock className="h-6 w-6" />}
              title="Data Security"
              index={4}
              color={SECTION_COLORS.security}
            >
              <p>We take security seriously (even for a fun game!):</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>🔒 Row-Level Security:</strong> Our database (Supabase) uses RLS to protect data
                </li>
                <li>
                  <strong>⚡ Rate Limiting:</strong> We prevent abuse with smart limits
                </li>
                <li>
                  <strong>🛡️ HTTPS:</strong> All connections are encrypted
                </li>
                <li>
                  <strong>🚫 No Sensitive Data:</strong> Since we don't collect personal info, there's nothing sensitive
                  to hack!
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<Globe className="h-6 w-6" />}
              title="Third-Party Services"
              index={5}
              color={SECTION_COLORS.thirdParty}
            >
              <p>We use a few trusted services:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>Supabase:</strong> Our database provider (privacy-friendly, GDPR compliant)
                </li>
                <li>
                  <strong>Vercel:</strong> Our hosting platform (for fast, secure delivery)
                </li>
                <li>
                  <strong>Google Fonts:</strong> For beautiful typography
                </li>
              </ul>
              <p className="mt-4 text-teal-600 dark:text-teal-400">
                We don't use any advertising networks, analytics trackers, or sell data to third parties. Ever. 🙅‍♂️
              </p>
            </PolicySection>
          </div>
        </div>
      </section>

      {/* Terms of Service Section */}
      <section id="terms" className="bg-muted/10 scroll-mt-20 px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="from-primary bg-linear-to-r to-pink-600 bg-clip-text text-transparent">
                Terms of Service
              </span>{' '}
              📜
            </h2>
            <p className="text-muted-foreground text-lg">The "Rules of Engagement" (Don't worry, they're fun!)</p>
          </motion.div>

          <div className="space-y-6">
            <PolicySection
              icon={<Sparkles className="h-6 w-6" />}
              title="What FLAMES Is"
              index={0}
              color={SECTION_COLORS.whatIs}
            >
              <p>Let's set the right expectations:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>🎮 Entertainment Only:</strong> FLAMES is a nostalgic game for fun - not a relationship
                  predictor!
                </li>
                <li>
                  <strong>🎲 No Guarantees:</strong> Results are based on a classic letter-counting algorithm, not
                  actual destiny
                </li>
                <li>
                  <strong>😄 Have Fun:</strong> Please don't make major life decisions based on FLAMES results (we're
                  serious!)
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<UserCheck className="h-6 w-6" />}
              title="User Conduct"
              index={1}
              color={SECTION_COLORS.conduct}
            >
              <p>Be cool, be kind! Here's what we expect:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>✅ Use the app for fun and entertainment</li>
                <li>✅ Share results respectfully with friends</li>
                <li>✅ Report bugs if you find them (we appreciate it!)</li>
                <li>❌ Don't try to break or exploit the app</li>
                <li>❌ Don't use automated tools to spam the service</li>
                <li>❌ Don't harass others with results (it's just a game!)</li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<Scale className="h-6 w-6" />}
              title="Intellectual Property"
              index={2}
              color={SECTION_COLORS.ip}
            >
              <p>A few notes on ownership:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>The FLAMES game concept is a traditional game in the public domain</li>
                <li>Our specific design, animations, and code are our creation</li>
                <li>The result cards you generate are yours to share freely!</li>
                <li>Please credit us if you share screenshots (@theflames)</li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<MessageCircle className="h-6 w-6" />}
              title="Sharing & Social"
              index={3}
              color={SECTION_COLORS.sharing}
            >
              <p>When you share your results:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>📱 Mobile share uses your device's native sharing</li>
                <li>🔗 Shared links may contain encoded names in the URL (visible to recipients)</li>
                <li>🖼️ Downloaded result cards include our watermark</li>
                <li>🤝 By sharing, you confirm you have permission to share those names</li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<Users className="h-6 w-6" />}
              title="Age Requirements"
              index={4}
              color={SECTION_COLORS.age}
            >
              <p>FLAMES is family-friendly:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>👨‍👩‍👧‍👦 All ages welcome to play</li>
                <li>📚 Originally a school game, perfect for all generations</li>
                <li>🔐 Since we don't collect personal data, there are no age-related data concerns</li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<Heart className="h-6 w-6" />}
              title="Disclaimer"
              index={5}
              color={SECTION_COLORS.disclaimer}
            >
              <p>The important legal stuff (read with a smile):</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>FLAMES is provided "as is" - we can't guarantee 100% uptime (though we try our best!)</li>
                <li>We're not responsible if you and your "Enemy" result actually become best friends 😉</li>
                <li>
                  Results are for entertainment - please don't sue us if your FLAMES prediction doesn't come true!
                </li>
                <li>We may update these terms occasionally - we'll try to keep them just as fun</li>
              </ul>
            </PolicySection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface-container/50 border-outline/10 relative overflow-hidden rounded-3xl border p-8 text-center backdrop-blur-sm md:p-12"
          >
            <div className="from-primary/10 to-secondary/10 absolute inset-0 bg-linear-to-br" />

            <div className="relative z-10">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 px-4 py-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <span className="text-muted-foreground text-sm font-medium">Got Questions?</span>
              </div>

              <h2 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Contact Us</h2>
              <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-lg">
                If you have any questions about our privacy policy or terms, or just want to say hi, we'd love to hear
                from you!
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="mailto:hello@theflames.app">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 h-14 rounded-full px-8 text-lg shadow-lg transition-all"
                  >
                    <Mail className="mr-2 h-5 w-5" /> Send Email
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="hover:bg-muted/50 h-14 rounded-full border-2 px-8 text-lg transition-all"
                  >
                    Play FLAMES <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fun Footer Quote */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="font-handwriting text-muted-foreground text-lg italic">
              "We treat your data like we treat the FLAMES game - with respect, fun, and absolutely no drama."
            </p>
            <p className="text-muted-foreground/60 text-sm">— The FLAMES Team 💜</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
