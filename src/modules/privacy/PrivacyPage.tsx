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
            <span className="text-on-surface-variant text-sm font-medium">Your Privacy Matters (For Real!)</span>
          </div>

          <SparklesText
            as="h1"
            className="mb-4 text-5xl font-extrabold tracking-tighter md:text-7xl"
            colors={{ first: '#8B5CF6', second: '#EC4899' }}
          >
            Privacy & Terms
          </SparklesText>
          <h2 className="font-heading text-on-surface-variant text-xl font-light tracking-wide md:text-2xl">
            The &quot;Boring&quot; Stuff Made Fun 🔐
          </h2>
        </motion.div>

        <div className="z-10 mx-auto mt-6 max-w-2xl">
          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-on-surface-variant/90 text-base leading-relaxed md:text-lg"
          >
            We know, we know—legal pages are usually as exciting as watching paint dry. But we promise to keep it
            simple, honest, and maybe even slightly entertaining. Here&apos;s the real deal on how we handle your data.
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
            className="relative mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="from-primary to-tertiary bg-linear-to-r bg-clip-text text-transparent">
                Privacy Policy
              </span>{' '}
              🛡️
            </h2>
            <p className="text-on-surface-variant text-lg">Last updated: December 2025</p>
            <p className="text-on-surface-variant mx-auto mt-2 max-w-xl text-sm italic">
              TL;DR: Your crush&apos;s name stays on your device. We only see &quot;someone got Love&quot; – not who or
              with whom.
            </p>
          </motion.div>

          <div className="space-y-6">
            <PolicySection
              icon={<Eye className="h-6 w-6" />}
              title="What We Actually Collect"
              index={0}
              color={SECTION_COLORS.collect}
            >
              <p>
                <strong>Here&apos;s the honest list</strong> (no corporate mumbo-jumbo):
              </p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>🎯 FLAMES Results Only:</strong> When you play, we record the result (Friends, Love, etc.) –
                  but we have absolutely NO idea whose names you entered. It&apos;s like knowing someone ordered pizza
                  without knowing who they are or what toppings.
                </li>
                <li>
                  <strong>🌍 Country Code:</strong> We detect your country via IP to show fun stats like &quot;Love is
                  trending in Brazil!&quot; This is anonymous and we don&apos;t track your city or location.
                </li>
                <li>
                  <strong>📊 Anonymous Analytics:</strong> We use Vercel Analytics to see basic page views (how many
                  people visited, which pages are popular). No personal tracking, no profiles.
                </li>
                <li>
                  <strong>🐛 Error Tracking:</strong> We use Sentry to catch bugs and crashes. We have disabled IP
                  address collection, so your crash reports are anonymous.
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<Database className="h-6 w-6" />}
              title="What We DON'T Collect"
              index={1}
              color={SECTION_COLORS.dontCollect}
            >
              <p>Let&apos;s be crystal clear—these NEVER touch our servers:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  ❌ <strong>The names you enter</strong> – they stay in YOUR browser and vanish when you&apos;re done
                </li>
                <li>
                  ❌ <strong>Your email or phone</strong> – we don&apos;t ask because we don&apos;t need them
                </li>
                <li>
                  ❌ <strong>Personal identity info</strong> – we literally can&apos;t identify you
                </li>
                <li>
                  ❌ <strong>Precise location</strong> – we only know your country, not your street
                </li>
                <li>
                  ❌ <strong>Browsing history</strong> – what happens outside FLAMES stays outside FLAMES
                </li>
                <li>
                  ❌ <strong>Advertising profiles</strong> – we don&apos;t do ads, period
                </li>
              </ul>
              <p className="text-on-surface-variant mt-4 text-sm italic">
                Your secret crush-checking sessions are between you and your browser. Pinky promise. 🤫
              </p>
            </PolicySection>

            <PolicySection
              icon={<Zap className="h-6 w-6" />}
              title="Why We Collect This Stuff"
              index={2}
              color={SECTION_COLORS.usage}
            >
              <p>The (very little) data we collect is used for:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>📊 Fun Global Charts:</strong> &quot;Love is the #1 result today!&quot; or &quot;Marriage is
                  trending in your country&quot;
                </li>
                <li>
                  <strong>🔧 Fixing Bugs:</strong> When something breaks, Sentry helps us find and fix it quickly
                </li>
                <li>
                  <strong>📈 Making Things Better:</strong> Knowing which features people love helps us improve
                </li>
              </ul>
              <p className="mt-4 rounded-lg bg-green-100 p-3 text-green-900 dark:bg-green-500/10 dark:text-green-200">
                <strong>The Important Part:</strong> Even if someone hacked our database (they won&apos;t, but
                hypothetically), they&apos;d only find &quot;12,847 people got Love today.&quot; No names, no
                identities, no drama.
              </p>
            </PolicySection>

            <PolicySection
              icon={<Cookie className="h-6 w-6" />}
              title="Cookies & Local Storage"
              index={3}
              color={SECTION_COLORS.cookies}
            >
              <p>We store a few things in your browser (never sent to us):</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>🌙 Theme Preference:</strong> Light mode, dark mode, or &quot;follow my system&quot;
                </li>
                <li>
                  <strong>✨ Animation Settings:</strong> Full animations or reduced motion
                </li>
                <li>
                  <strong>🔊 Sound Settings:</strong> Whether you want those satisfying sound effects
                </li>
                <li>
                  <strong>📝 Recent Games:</strong> Your last few pairings (stored locally, never leaves your device)
                </li>
              </ul>
              <p className="mt-4 text-amber-800 italic dark:text-amber-200">
                These aren&apos;t creepy tracking cookies—they&apos;re just your preferences so we remember you like
                dark mode next time you visit! 🍪
              </p>
            </PolicySection>

            <PolicySection
              icon={<Lock className="h-6 w-6" />}
              title="How We Keep Things Secure"
              index={4}
              color={SECTION_COLORS.security}
            >
              <p>We take security seriously (yes, even for a silly game):</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>🔒 HTTPS Everywhere:</strong> All connections are encrypted
                </li>
                <li>
                  <strong>🛡️ Row-Level Security:</strong> Our database (Supabase) uses RLS policies
                </li>
                <li>
                  <strong>⚡ Rate Limiting:</strong> We prevent spam and abuse
                </li>
                <li>
                  <strong>🚫 Minimal Data:</strong> The best security is collecting less in the first place
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<Globe className="h-6 w-6" />}
              title="Third-Party Services"
              index={5}
              color={SECTION_COLORS.thirdParty}
            >
              <p>Here&apos;s who else is involved (transparency FTW):</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>Vercel:</strong> Hosts our app and provides anonymous analytics
                </li>
                <li>
                  <strong>Supabase:</strong> Our privacy-friendly, GDPR-compliant database
                </li>
                <li>
                  <strong>Sentry:</strong> Catches errors so we can fix bugs
                </li>
                <li>
                  <strong>Google Fonts:</strong> Makes our text look pretty
                </li>
              </ul>
              <p className="mt-4 text-teal-800 dark:text-teal-200">
                <strong>What we DON&apos;T use:</strong> No Google Analytics, no Facebook Pixel, no advertising
                networks, no data brokers. Your data is not for sale. Ever. 🙅‍♂️
              </p>
            </PolicySection>
          </div>
        </div>
      </section>

      {/* Terms of Service Section */}
      <section id="terms" className="bg-surface-container/30 scroll-mt-20 px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-transparent">
                Terms of Service
              </span>{' '}
              📜
            </h2>
            <p className="text-on-surface-variant text-lg">The &quot;Rules of the Game&quot; (Shorter than most)</p>
            <p className="text-on-surface-variant mx-auto mt-2 max-w-xl text-sm italic">
              TL;DR: Have fun, be nice, don&apos;t make life decisions based on FLAMES. Simple!
            </p>
          </motion.div>

          <div className="space-y-6">
            <PolicySection
              icon={<Sparkles className="h-6 w-6" />}
              title="What FLAMES Actually Is"
              index={0}
              color={SECTION_COLORS.whatIs}
            >
              <p>Let&apos;s set expectations (so no one sues us later 😅):</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>🎮 Pure Entertainment:</strong> FLAMES is a nostalgic game for fun—not an actual relationship
                  predictor, fortune teller, or marriage counselor
                </li>
                <li>
                  <strong>🎲 Zero Scientific Basis:</strong> Results come from counting letters, not cosmic forces, AI
                  algorithms, or ancient prophecies
                </li>
                <li>
                  <strong>😄 Just a Game:</strong> Please, PLEASE don&apos;t break up with someone because you got
                  &quot;Enemies.&quot; We&apos;re serious about this one.
                </li>
              </ul>
              <p className="text-on-surface-variant mt-4 text-sm italic">
                If FLAMES predicts &quot;Marriage&quot; and you actually get married, that&apos;s amazing! But also
                definitely a coincidence. Invite us to the wedding though? 💒
              </p>
            </PolicySection>

            <PolicySection
              icon={<UserCheck className="h-6 w-6" />}
              title="The Golden Rules"
              index={1}
              color={SECTION_COLORS.conduct}
            >
              <p>Be cool, be kind! Here&apos;s what we expect:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>✅ Use the app for fun, laughs, and nostalgia trips</li>
                <li>✅ Share results with friends (with consent, obviously)</li>
                <li>✅ Report bugs if you find them—we appreciate the help!</li>
                <li>❌ Don&apos;t try to break, hack, or exploit the app</li>
                <li>❌ Don&apos;t spam the service with bots or automated tools</li>
                <li>❌ Don&apos;t use results to bully or harass anyone (it&apos;s just letters!)</li>
              </ul>
              <p className="text-on-surface-variant mt-4 text-sm italic">
                Basically: Don&apos;t be the person who ruins nice things for everyone else. 🙏
              </p>
            </PolicySection>

            <PolicySection
              icon={<Scale className="h-6 w-6" />}
              title="Who Owns What"
              index={2}
              color={SECTION_COLORS.ip}
            >
              <p>Quick notes on intellectual property:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>The FLAMES game concept:</strong> Public domain! It&apos;s been passed down through
                  generations of school kids—no one owns the idea
                </li>
                <li>
                  <strong>Our website, design, and code:</strong> Yeah, we made those! They&apos;re ours
                </li>
                <li>
                  <strong>Your result cards:</strong> Totally yours to share, screenshot, or frame on your wall
                </li>
                <li>
                  <strong>One small ask:</strong> Credit us if you share screenshots? @theflames 💜
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<MessageCircle className="h-6 w-6" />}
              title="Sharing Your Results"
              index={3}
              color={SECTION_COLORS.sharing}
            >
              <p>When you share your FLAMES destiny:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  📱 <strong>Mobile sharing:</strong> Uses your device&apos;s native share menu
                </li>
                <li>
                  🔗 <strong>Shared links:</strong> May contain the names in the URL (visible to recipients)
                </li>
                <li>
                  🖼️ <strong>Downloaded cards:</strong> Include our watermark so people know where the magic happened
                </li>
                <li>
                  🤝 <strong>Pro tip:</strong> Maybe ask before sharing results with someone else&apos;s name in them?
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              icon={<Users className="h-6 w-6" />}
              title="For All Ages"
              index={4}
              color={SECTION_COLORS.age}
            >
              <p>FLAMES is family-friendly, just like it was in school:</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  👨‍👩‍👧‍👦 <strong>All ages welcome:</strong> From nostalgic adults to curious kids
                </li>
                <li>
                  📚 <strong>Original school vibes:</strong> Perfect for all generations who remember the game
                </li>
                <li>
                  🔐 <strong>No age-gated data:</strong> Since we don&apos;t collect personal info, no COPPA worries
                </li>
              </ul>
              <p className="text-on-surface-variant mt-4 text-sm italic">
                Play with your parents, play with your kids, play with your grandma. We don&apos;t judge! 👵❤️
              </p>
            </PolicySection>

            <PolicySection
              icon={<Heart className="h-6 w-6" />}
              title="The Legal Fine Print"
              index={5}
              color={SECTION_COLORS.disclaimer}
            >
              <p>The &quot;please don&apos;t sue us&quot; section (read with a smile):</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>
                  <strong>&quot;As Is&quot; Service:</strong> We try our best, but can&apos;t guarantee 100% uptime. The
                  internet is weird sometimes.
                </li>
                <li>
                  <strong>Results ≠ Reality:</strong> If your FLAMES prediction doesn&apos;t come true (or scarily
                  does), that&apos;s not on us
                </li>
                <li>
                  <strong>Plot Twists Happen:</strong> Getting &quot;Enemies&quot; with someone and becoming best
                  friends is actually quite common. We&apos;ve seen it!
                </li>
                <li>
                  <strong>Updates:</strong> We may update these terms occasionally—we&apos;ll keep them equally fun
                </li>
              </ul>
              <p className="text-on-surface-variant mt-4 text-sm italic">
                By using FLAMES, you agree that it&apos;s all in good fun. Now go check if you and your crush are
                compatible! (Or enemies. It&apos;s a 1-in-6 chance either way.)
              </p>
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
              <div className="bg-friendship/20 mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
                <Mail className="text-friendship h-5 w-5" />
                <span className="text-on-surface-variant text-sm font-medium">We&apos;re Human! (Mostly)</span>
              </div>

              <h2 className="font-heading text-on-surface mb-4 text-3xl font-bold md:text-4xl">
                Questions? Suggestions? Memes? 💌
              </h2>
              <p className="text-on-surface-variant mx-auto mb-8 max-w-xl text-lg">
                Found a bug? Have a privacy question? Want to tell us about an unlikely FLAMES prediction that came
                true? We&apos;d love to hear from you!
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="mailto:66naren@gmail.com">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 h-14 rounded-full px-8 text-lg shadow-lg transition-all"
                  >
                    <Mail className="mr-2 h-5 w-5" /> Say Hello
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="hover:bg-surface-container h-14 rounded-full border-2 px-8 text-lg transition-all"
                  >
                    Back to Playing! <ArrowRight className="ml-2 h-5 w-5" />
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
            <p className="font-handwriting text-on-surface-variant text-lg italic">
              &quot;We treat your privacy like we treat the FLAMES game—transparently, honestly, and with just enough
              silliness to keep things fun.&quot;
            </p>
            <p className="text-on-surface-variant/60 text-sm">— The FLAMES Team 💜</p>
            <p className="text-on-surface-variant/40 mt-6 text-xs">
              Last updated: January 2025 • Made with ❤️ and a healthy respect for your data
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
