/**
 * Long-form SEO content shared by visible page copy and JSON-LD, so the
 * structured data always matches what readers see (a Google requirement).
 */

/** Bump when the guide content changes; surfaces as dateModified. */
export const CONTENT_UPDATED = '2026-11-21';
export const CONTENT_PUBLISHED = '2025-06-18';

export interface FaqEntry {
  question: string;
  answer: string;
}

/** Homepage FAQ: phrased the way people actually search (from Search Console). */
export const HOME_FAQ: FaqEntry[] = [
  {
    question: 'What is the FLAMES game?',
    answer:
      'FLAMES is a classic paper-and-pencil name game. You write two names, cross out the letters they share, count what is left, and use that number to strike letters from the word FLAMES until one remains: Friends, Love, Affection, Marriage, Enemies or Siblings.',
  },
  {
    question: 'How do you calculate FLAMES with two names?',
    answer:
      'Cancel matching letters one pair at a time, add up the uncancelled letters in both names, then count around F-L-A-M-E-S by that number. Remove the letter you land on, restart the count from the next letter, and repeat until a single letter is left. This calculator does every step for you and shows the work.',
  },
  {
    question: 'What does FLAMES stand for?',
    answer:
      'FLAMES stands for Friends, Love (or Lovers), Affection, Marriage, Enemies and Siblings. In the Philippines many people play it as Friends, Lovers, Anger, Marriage, Engagement and Soulmates.',
  },
  {
    question: 'What does A stand for in FLAMES?',
    answer:
      'In the most common version, A stands for Affection: a warm, caring bond that is more than friendship. Some groups read it as Adore or Affectionate, and the Filipino version uses Anger.',
  },
  {
    question: 'Is the FLAMES calculator accurate?',
    answer:
      'It is accurate to the rules of the game: the same two spellings always give the same result. FLAMES is a fun counting game, not a scientific compatibility test, so enjoy the result without using it to make real relationship decisions.',
  },
  {
    question: 'Should I use first names or full names in FLAMES?',
    answer:
      'Either works. First names are traditional; full names or nicknames change the letters and can change the result. Spaces, capital letters and punctuation are ignored.',
  },
  {
    question: 'What happens if the names have no letters left?',
    answer:
      'If every letter cancels out (anagrams such as Mary and Army), the count is zero. This calculator still completes the count and always lands on Affection, so you get an answer every time.',
  },
  {
    question: 'Is the FLAMES game free to play online?',
    answer:
      'Yes. The FLAMES calculator is free, needs no sign-up, and works on phones, tablets and computers. You can share your result as a link or download a result card.',
  },
  {
    question: 'Are the names I enter saved?',
    answer:
      'Your recent pairings stay in your own browser so you can replay them. Global charts only count anonymous results (the result letter and a country code), never names. If you share a result, the link contains both names so the other person can see it.',
  },
];

/** How to play FLAMES on paper, for HowTo markup and the guide page. */
export const HOW_TO_STEPS = [
  {
    name: 'Write both names',
    text: 'Write the two names one above the other. Ignore spaces, capitals and punctuation.',
  },
  {
    name: 'Cross out common letters',
    text: 'Cross out letters that appear in both names, one pair at a time. A repeated letter only cancels while the other name still has a match.',
  },
  {
    name: 'Count the remaining letters',
    text: 'Add up every letter that is left in both names. That number is your count.',
  },
  {
    name: 'Count around FLAMES',
    text: 'Write F-L-A-M-E-S and count from F up to your number, wrapping around to F again if needed. Strike out the letter you land on.',
  },
  {
    name: 'Repeat until one letter remains',
    text: 'Start counting again from the letter after the one you struck out. Keep going until only one letter is left: that is your FLAMES result.',
  },
];

/** Worked examples, computed with the same algorithm the calculator uses. */
export const WORKED_EXAMPLES = [
  {
    names: ['Rahul', 'Priya'],
    common: 'R and A',
    left: 'hul + piy',
    count: 6,
    struck: 'S, F, A, L, E',
    result: 'Marriage',
  },
  {
    names: ['Romeo', 'Juliet'],
    common: 'E',
    left: 'romo + julit',
    count: 9,
    struck: 'A, F, L, S, M',
    result: 'Enemies',
  },
  {
    names: ['Jack', 'Rose'],
    common: 'none',
    left: 'jack + rose',
    count: 8,
    struck: 'L, E, M, F, S',
    result: 'Affection',
  },
];

export const RESULT_MEANINGS = [
  {
    letter: 'F',
    name: 'Friends',
    text: 'A friendship result: easy-going, loyal and fun. Plenty of great love stories start here.',
  },
  {
    letter: 'L',
    name: 'Love',
    text: 'Also called Lovers. The result everyone secretly hopes for: a romantic match.',
  },
  {
    letter: 'A',
    name: 'Affection',
    text: 'Fondness and care. Some versions say Adore or Affectionate; the Filipino version uses Anger.',
  },
  {
    letter: 'M',
    name: 'Marriage',
    text: 'The wedding result. Start practising your speech, at least for the next five minutes.',
  },
  {
    letter: 'E',
    name: 'Enemies',
    text: 'A pretend rivalry. Some Filipino versions read E as Engagement instead.',
  },
  {
    letter: 'S',
    name: 'Siblings',
    text: 'A brother-and-sister style bond. In some versions S means Sweethearts or Soulmates.',
  },
];

export function faqPageSchema(entries: FaqEntry[], url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

export function howToSchema(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#how-to-play`,
    name: 'How to play FLAMES with two names',
    description:
      'Calculate a FLAMES result by hand: cancel common letters, count what is left, and count around F-L-A-M-E-S.',
    totalTime: 'PT2M',
    tool: [{ '@type': 'HowToTool', name: 'Pen and paper (or the free FLAMES calculator)' }],
    step: HOW_TO_STEPS.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${url}#step-${index + 1}`,
    })),
  };
}
