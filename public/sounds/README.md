# 🎵 Sound Assets for The Flames

This directory contains all audio assets for "The Flames" application.

## 📁 Required Files

### Background Music (BGM)

| File                | Description                | Duration | Style                   |
| ------------------- | -------------------------- | -------- | ----------------------- |
| `bgm-default.mp3`   | Main playful romantic loop | 60-120s  | Light, upbeat, romantic |
| `bgm-chill.mp3`     | Relaxing lo-fi beats       | 60-120s  | Lo-fi, ambient          |
| `bgm-valentine.mp3` | Romantic soft melody       | 60-120s  | Romantic ballad         |
| `bgm-halloween.mp3` | Spooky playful tune        | 60-120s  | Playful spooky          |
| `bgm-christmas.mp3` | Festive holiday jingle     | 60-120s  | Holiday, cheerful       |

### Sound Effects (SFX)

| File                | Description           | Duration | Style               |
| ------------------- | --------------------- | -------- | ------------------- |
| `click.mp3`         | Button click          | <0.3s    | Crisp, satisfying   |
| `hover.mp3`         | Subtle hover feedback | <0.2s    | Very soft           |
| `toggle.mp3`        | Toggle switch         | <0.3s    | Click with feedback |
| `success.mp3`       | Positive confirmation | 0.5-1s   | Uplifting chime     |
| `error.mp3`         | Error notification    | 0.3-0.5s | Low buzz or tone    |
| `calculating.mp3`   | Processing loop       | 1-2s     | Ticking/processing  |
| `reveal.mp3`        | Result reveal         | 0.5-1s   | Ta-da/magical       |
| `letter-strike.mp3` | Letter elimination    | <0.3s    | Scratch/swoosh      |
| `flames-count.mp3`  | Counting step         | <0.2s    | Tick/beep           |
| `badge-unlock.mp3`  | Achievement unlock    | 1-2s     | Fanfare             |
| `form-submit.mp3`   | Form submission       | 0.3-0.5s | Whoosh/confirm      |
| `heartbeat.mp3`     | Romantic heartbeat    | 1-2s     | Heartbeat sound     |
| `sparkle.mp3`       | Magical sparkle       | 0.3-0.5s | Sparkle/twinkle     |
| `whoosh.mp3`        | Transition swoosh     | 0.3-0.5s | Swoosh              |
| `pop.mp3`           | Bubble pop            | <0.2s    | Pop sound           |

---

## 🌐 Recommended Royalty-Free Sources

### Best Free Sources (No Attribution Required)

These sites offer sounds under CC0 or similar permissive licenses:

1. **[Pixabay Sound Effects](https://pixabay.com/sound-effects/)**
   - ✅ Free for commercial use
   - ✅ No attribution required
   - ✅ High quality
   - 🔍 Search: "click", "success", "romantic music", "game sound"

2. **[Mixkit](https://mixkit.co/free-sound-effects/)**
   - ✅ Free for commercial use
   - ✅ No attribution required
   - ✅ Well-organized categories
   - 🔍 Categories: UI, Notifications, Games

3. **[Uppbeat](https://uppbeat.io/sfx)**
   - ✅ Free tier available
   - ✅ High quality
   - ⚠️ Some require attribution

4. **[Zapsplat](https://www.zapsplat.com/)**
   - ✅ Large library
   - ✅ Free registration
   - ⚠️ Attribution required for free tier

### Attribution Required (High Quality)

1. **[Freesound](https://freesound.org/)**
   - ✅ Huge library
   - ⚠️ Check license per sound (CC-BY, CC0)
   - 🔍 Great for specific sounds

2. **[OpenGameArt](https://opengameart.org/)**
   - ✅ Game-focused sounds
   - ⚠️ Various licenses

### Premium (If Budget Allows)

- [Epidemic Sound](https://www.epidemicsound.com/) - Subscription
- [Artlist](https://artlist.io/) - Subscription
- [AudioJungle](https://audiojungle.net/) - Pay per sound

---

## 🎯 Recommended Specific Sounds

### From Pixabay (Direct Links)

**Click Sound:**

- <https://pixabay.com/sound-effects/click-button-140881/>
- <https://pixabay.com/sound-effects/click-151673/>

**Success/Positive:**

- <https://pixabay.com/sound-effects/success-1-6297/>
- <https://pixabay.com/sound-effects/correct-2-46134/>
- <https://pixabay.com/sound-effects/level-up-191997/>

**Error:**

- <https://pixabay.com/sound-effects/error-126627/>
- <https://pixabay.com/sound-effects/wrong-buzzer-6268/>

**Romantic BGM:**

- <https://pixabay.com/music/romantic-love-story-116598/>
- <https://pixabay.com/music/beats-lofi-chill-140858/>

**Magical/Sparkle:**

- <https://pixabay.com/sound-effects/magic-sparkle-6135/>
- <https://pixabay.com/sound-effects/fairy-magic-wand-sound-effect-177756/>

**Whoosh/Transition:**

- <https://pixabay.com/sound-effects/whoosh-6316/>
- <https://pixabay.com/sound-effects/swoosh-sound-effect-for-fight-scenes-or-transitions-2-188680/>

---

## 🎬 About Movie Songs / Commercial Music

### ⚠️ Important Legal Notice

**DO NOT** use copyrighted movie songs, even for "fun" projects:

1. **Copyright applies regardless of commercial intent**
   - Playing copyrighted music without license is infringement
   - "Non-commercial" is not a legal defense

2. **Streaming services use fingerprinting**
   - Shazam, YouTube Content ID will detect copyrighted audio

3. **Safer alternatives:**
   - Use royalty-free alternatives that sound similar
   - Many composers create "sound-alike" tracks legally
   - Use production music libraries

### ✅ Legal Ways to Include Popular-Style Music

1. **Cover Versions**: Some royalty-free sites offer covers
2. **Sound-Alikes**: Legal "inspired by" compositions
3. **User-Uploaded**: Let users play their own music via Spotify/Apple Music APIs (would require their account)

---

## 📋 Technical Requirements

### Audio Format

- **BGM**: MP3, 128-192kbps, Stereo
- **SFX**: MP3 or WAV, 192kbps, Mono or Stereo

### File Size Guidelines

- **BGM**: 1-3 MB per track (compressed)
- **SFX**: <100 KB each

### Optimization Tips

1. Use [Audacity](https://www.audacityteam.org/) for editing
2. Normalize audio to -3dB peak
3. Convert to MP3 using LAME encoder
4. Trim silence from start/end

---

## 🚀 Quick Start

1. Download sounds from the recommended sources above
2. Rename files to match the expected filenames
3. Place in this `public/sounds/` directory
4. Restart the dev server

```bash
# Verify files are in place
ls public/sounds/
```

Expected output:

```
bgm-default.mp3
bgm-chill.mp3
bgm-valentine.mp3
bgm-halloween.mp3
bgm-christmas.mp3
click.mp3
hover.mp3
toggle.mp3
success.mp3
error.mp3
calculating.mp3
reveal.mp3
letter-strike.mp3
flames-count.mp3
badge-unlock.mp3
form-submit.mp3
heartbeat.mp3
sparkle.mp3
whoosh.mp3
pop.mp3
README.md
```

---

## 📞 Questions?

If you need help finding specific sounds or have licensing questions, check the license page of each source before downloading.
