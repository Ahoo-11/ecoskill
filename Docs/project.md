# EcoSkill App - Development Prompt for AI Coding Assistant

## Project Overview
Build a mobile-first web application called **EcoSkill** - a gamified sustainability education platform with Learn-2-Earn mechanics. **Design quality must match Duolingo's polish and user experience.**

---

## Design Requirements (CRITICAL)

### Visual Style Guide
- **Reference Apps**: Study Duolingo, Headspace, and Notion's UI/UX
- **Color Palette**: 
  - Primary: Vibrant eco-green (#10B981 or similar)
  - Secondary: Earth tones (warm browns, sky blues)
  - Accents: Energetic yellow/orange for rewards
  - Background: Clean whites with subtle gradients
- **Typography**: 
  - Modern sans-serif (Inter, Poppins, or DM Sans)
  - Clear hierarchy: Bold headings, readable body text (16px minimum)
- **Animations**: 
  - Smooth micro-interactions (button presses, card flips)
  - Celebrate wins with confetti/particle effects
  - Progress bars that animate
  - Page transitions (slide, fade)
- **Components Style**:
  - Rounded corners (8-16px border-radius)
  - Soft shadows (not harsh borders)
  - Card-based layouts
  - Bottom navigation with icons + labels
  - Floating action buttons for primary actions

---

## Tech Stack (Junior-Friendly)

```
Frontend: 
- React + Vite (fast, modern)
- TailwindCSS (for Duolingo-style design system)
- Framer Motion (smooth animations)
- React Router (navigation)
- Lucide React (beautiful icons)

Backend:
- Supabase (all-in-one: database, auth, storage, real-time)
- OpenAI API (AI tutor + image verification)
- Optional: Pinata/IPFS (NFT metadata storage)

Deployment:
- Vercel (frontend)
- Supabase (backend managed)
```

---

## Development Phases

### **PHASE 1: Foundation & Design System** (Start Here)

Create the core design components that match Duolingo's quality:

#### 1.1 Setup Project
```bash
# Initialize with these exact commands
npm create vite@latest ecoskill -- --template react
cd ecoskill
npm install tailwindcss framer-motion react-router-dom lucide-react
npm install @supabase/supabase-js
```

#### 1.2 Build Design System Components
Create these reusable components with **pixel-perfect styling**:

**Button Component** (`components/ui/Button.jsx`)
```jsx
// Requirements:
// - 3 variants: primary (green), secondary (white), success (yellow)
// - Hover states with scale animation
// - Loading state with spinner
// - Disabled state (grayed out)
// - Rounded corners, shadow on hover
// Example: Duolingo's green CTA buttons
```

**Card Component** (`components/ui/Card.jsx`)
```jsx
// Requirements:
// - White background with soft shadow
// - Hover effect (slight lift + shadow increase)
// - Optional: Icon/image at top
// - Padding: 20px
// - Border-radius: 12px
```

**ProgressBar Component** (`components/ui/ProgressBar.jsx`)
```jsx
// Requirements:
// - Animated fill (use Framer Motion)
// - Show percentage text
// - Color changes: 0-30% (red), 31-70% (yellow), 71-100% (green)
// - Background: light gray track
```

**Achievement Badge** (`components/ui/Badge.jsx`)
```jsx
// Requirements:
// - Circular or hexagonal shape
// - Glow effect when earned (new)
// - Grayscale when locked
// - Icon in center
// - Tooltip on hover showing name
```

---

### **PHASE 2: Core Screens** (Build These First)

#### Screen 1: Onboarding Flow
**Route**: `/welcome`

**Design Requirements**:
- 3-step swipeable carousel (like Tinder/Duolingo)
- Each slide: Full-screen illustration + headline + subtext
- Progress dots at bottom
- "Next" button (bottom right) and "Skip" (top right)
- Final slide has "Get Started" CTA

**Content**:
1. Slide 1: "Learn Sustainability" (illustration of person with plant)
2. Slide 2: "Earn Real Rewards" (coins/tokens visual)
3. Slide 3: "Make Real Impact" (Earth/community visual)

**Code Structure**:
```jsx
// components/Onboarding.jsx
// - Use Framer Motion for swipe animations
// - Save completion status to localStorage
// - Redirect to /signup after completion
```

---

#### Screen 2: Authentication
**Routes**: `/signup`, `/login`

**Design Requirements**:
- Clean, centered form (max-width: 400px)
- Social login buttons (Google, Apple style)
- OR divider line
- Email/password fields with icons (Lucide)
- Show password toggle (eye icon)
- Error messages in red below fields
- "Forgot password?" link

**Implementation**:
```jsx
// Use Supabase Auth
// components/Auth/SignUp.jsx
// components/Auth/Login.jsx
// - Validate email format
// - Password strength indicator
// - Success → redirect to /onboarding-quiz
```

---

#### Screen 3: Personalization Quiz
**Route**: `/onboarding-quiz`

**Design Requirements**:
- Progress bar at top (shows question 1/5, 2/5, etc.)
- One question per screen
- Large, tappable option cards (with icons)
- Back/Next buttons
- Smooth transitions between questions

**Questions**:
1. "Where do you live?" (City/Suburbs/Rural) → affects AI recommendations
2. "What's your main goal?" (Save money/Reduce waste/Lower carbon/Learn)
3. "Transportation?" (Car/Public/Bike/Walk)
4. "Diet?" (Omnivore/Vegetarian/Vegan/Flexitarian)
5. "Current skill level?" (Beginner/Intermediate/Advanced)

**Implementation**:
```jsx
// components/Quiz/QuizFlow.jsx
// - Store answers in Supabase user profile
// - Calculate initial carbon footprint estimate
// - Generate personalized learning path using OpenAI
// - Redirect to /dashboard on completion
```

---

#### Screen 4: Main Dashboard (Home)
**Route**: `/dashboard`

**Design Requirements** (THIS IS THE CORE SCREEN - MAKE IT PERFECT):

**Layout**:
```
┌─────────────────────────┐
│  Header (Avatar, Streak)│
│  "Hi Sarah! 🌱"         │
├─────────────────────────┤
│  [Today's Challenge]    │ ← Big card with image
│  Upload photo to earn!  │
├─────────────────────────┤
│  Your Learning Path     │
│  [Lesson 1] ✅          │
│  [Lesson 2] 🔓 ← Active │ ← Scrollable list
│  [Lesson 3] 🔒          │
├─────────────────────────┤
│  Stats Row              │
│  🪙 1,250  🔥 7  ⭐ 12  │ ← Tokens, Streak, XP
└─────────────────────────┘
│  Bottom Nav             │
```

**Components Needed**:
```jsx
// components/Dashboard/Header.jsx
// - User avatar (top right)
// - Greeting with emoji
// - Streak counter (fire icon + number)

// components/Dashboard/TodayChallenge.jsx
// - Random daily challenge
// - Background image (sustainable action)
// - "Complete Now" button
// - Shows reward amount

// components/Dashboard/LearningPath.jsx
// - Vertical list of lessons (like Duolingo's tree)
// - Each lesson: icon, title, status (locked/active/completed)
// - Progress bar showing overall completion
// - Tap lesson → opens modal with details

// components/Dashboard/StatsBar.jsx
// - 3 stat cards: Tokens, Streak, XP
// - Animated counters (number increments)
```

**Database Schema Needed**:
```sql
-- Create these tables in Supabase
users_profile (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  tokens INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  location TEXT,
  quiz_answers JSONB
)

learning_paths (
  id UUID,
  user_id UUID,
  lessons JSONB[], -- array of lesson objects
  current_lesson_id INTEGER
)

challenges (
  id UUID,
  title TEXT,
  description TEXT,
  reward_tokens INTEGER,
  verification_type TEXT, -- 'photo', 'receipt', 'quiz'
  difficulty TEXT
)
```

---

#### Screen 5: Lesson View
**Route**: `/lesson/:id`

**Design Requirements**:
- Top: Progress bar (e.g., "3/10 questions")
- Exit button (X) with confirmation modal
- Content area (changes based on lesson type):
  - Multiple choice questions (4 option cards)
  - True/False (2 big buttons)
  - Image identification
  - Short text input
- Bottom: Check/Continue button

**Lesson Flow**:
1. Introduction card (explains topic)
2. 5-10 interactive questions
3. Tips & explanations after each answer
4. Summary screen with XP earned
5. "Continue" → next lesson or back to dashboard

**Implementation**:
```jsx
// components/Lesson/LessonContainer.jsx
// components/Lesson/QuestionCard.jsx
// components/Lesson/ResultScreen.jsx

// Use OpenAI to generate lesson content:
// Prompt: "Create a 10-question sustainability lesson about [topic] 
// for [beginner/intermediate] level. Include explanations."
```

---

### **PHASE 3: Verification & Rewards**

#### Screen 6: Challenge Submission
**Route**: `/challenge/:id/submit`

**Design Requirements**:
- Camera interface (use device camera)
- OR upload from gallery
- Preview uploaded image
- Add optional text note
- "Submit for Verification" button
- Loading state while AI processes

**AI Verification Flow**:
```jsx
// components/Challenge/SubmitChallenge.jsx

async function verifyAction(imageFile, challengeType) {
  // 1. Upload image to Supabase Storage
  const imageUrl = await uploadImage(imageFile);
  
  // 2. Send to OpenAI Vision API
  const prompt = `
    Analyze this image. The user claims they: "${challengeType}".
    Valid examples: [provide examples].
    Respond with JSON:
    {
      "verified": true/false,
      "confidence": 0-100,
      "reason": "explanation"
    }
  `;
  
  const result = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: imageUrl }
      ]
    }]
  });
  
  // 3. If verified, award tokens
  if (result.verified) {
    await awardTokens(userId, challenge.reward_tokens);
  }
  
  return result;
}
```

**Result Screen**:
- ✅ Success: Confetti animation, "+250 tokens" pop-up
- ❌ Rejected: Friendly message, "Try again" button
- ⏳ Pending: "Under review" (if confidence < 70%)

---

#### Screen 7: Rewards & NFTs
**Route**: `/rewards`

**Design Requirements**:
- Top section: Total tokens (big number)
- "Redeem Rewards" button
- Grid of NFT badges:
  - Earned badges: Full color, shimmer effect
  - Locked badges: Grayscale, lock icon
  - Progress bars under each (e.g., "8/10 challenges")
- Tap badge → modal with:
  - Badge name & description
  - How to earn
  - Rarity indicator
  - "Share" button (social media)

**NFT Implementation** (Simplified):
```jsx
// For MVP, use visual badges stored in database
// Future: Mint actual NFTs on Polygon/Base

// Database table:
user_badges (
  user_id UUID,
  badge_id UUID,
  earned_at TIMESTAMP,
  tier TEXT -- 'bronze', 'silver', 'gold'
)

badges (
  id UUID,
  name TEXT,
  description TEXT,
  image_url TEXT,
  requirement JSONB -- e.g., {"challenges_completed": 10}
)
```

---

### **PHASE 4: Community Features**

#### Screen 8: Community Challenges
**Route**: `/community`

**Design Requirements**:
- Tabs: "Active" | "Upcoming" | "Completed"
- Challenge cards showing:
  - Team size (e.g., "47/100 participants")
  - Pool reward (e.g., "5,000 tokens")
  - Time remaining (countdown timer)
  - Progress bar (team's collective progress)
  - "Join Challenge" button
- Leaderboard section (top 10 contributors)

**Implementation**:
```jsx
// Real-time updates using Supabase Realtime
// components/Community/ChallengeCard.jsx
// components/Community/Leaderboard.jsx

// Database:
community_challenges (
  id UUID,
  title TEXT,
  total_pool INTEGER,
  participants_count INTEGER,
  end_date TIMESTAMP,
  goal JSONB -- e.g., {"total_trees_planted": 1000}
)

participation (
  user_id UUID,
  challenge_id UUID,
  contribution INTEGER, -- actions completed
  tokens_earned INTEGER
)
```

---

### **PHASE 5: AI Tutor (Advanced)**

#### Screen 9: AI Chat Assistant
**Route**: `/tutor`

**Design Requirements**:
- Chat interface (like ChatGPT)
- Messages: User (right, blue) vs AI (left, green)
- Quick action buttons:
  - "Calculate my carbon footprint"
  - "Suggest actions for today"
  - "Explain composting"
- Input field with send button (bottom)
- Typing indicator when AI is responding

**Implementation**:
```jsx
// components/Tutor/ChatInterface.jsx

async function askTutor(userMessage, userProfile) {
  const systemPrompt = `
    You are an expert sustainability tutor. 
    User profile: ${JSON.stringify(userProfile)}
    Provide personalized, actionable advice.
    Keep responses under 100 words.
    Be encouraging and positive.
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]
  });
  
  return response.choices[0].message.content;
}
```

---

## UI/UX Polish Checklist (MUST-HAVES)

### Animations (Use Framer Motion)
```jsx
// Example: Card entrance animation
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <Card />
</motion.div>

// Button press animation
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
>
  Continue
</motion.button>
```

### Loading States
- Skeleton screens (not spinners) for content loading
- Progress indicators for uploads
- Optimistic UI updates (show token rewards immediately)

### Error Handling
- Toast notifications (top or bottom)
- Inline validation messages (under form fields)
- Empty states with illustrations ("No challenges yet")

### Accessibility
- All buttons: min height 44px (touch-friendly)
- Color contrast: WCAG AA compliance
- Focus states (keyboard navigation)
- Alt text for all images

---

## Step-by-Step Build Instructions

### Week 1: Design System + Authentication
```
Day 1-2: Setup project, create UI components (Button, Card, etc.)
Day 3-4: Build Onboarding + Auth screens
Day 5-7: Supabase setup, test auth flow end-to-end
```

### Week 2: Core App Experience
```
Day 8-10: Dashboard layout + Learning Path
Day 11-14: Lesson flow + question types
```

### Week 3: Gamification
```
Day 15-17: Token system, rewards screen
Day 18-21: Challenge submission + AI verification
```

### Week 4: Community + Polish
```
Day 22-24: Community challenges
Day 25-28: Bug fixes, animations, performance optimization
```

---

## Code Quality Guidelines

### File Structure
```
src/
├── components/
│   ├── ui/              # Reusable design components
│   ├── Dashboard/
│   ├── Lesson/
│   ├── Challenge/
│   └── Community/
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── lib/
│   ├── supabase.js     # Database client
│   └── openai.js       # AI client
├── utils/               # Helper functions
└── styles/
    └── globals.css      # Tailwind + custom CSS
```

### Best Practices
- **Component Size**: Keep under 200 lines
- **Naming**: Use descriptive names (UserProfileCard not UPC)
- **Comments**: Explain "why", not "what"
- **Prop Types**: Use PropTypes or TypeScript
- **Error Boundaries**: Wrap major sections

---

## Testing Checklist

### Before Launching
- [ ] Test on mobile (Chrome DevTools mobile view)
- [ ] Test all auth flows (signup, login, password reset)
- [ ] Complete a full lesson
- [ ] Submit a challenge photo
- [ ] Join a community challenge
- [ ] Check animations on low-end devices
- [ ] Verify token calculations
- [ ] Test offline behavior (show offline banner)

---

## AI Coding Assistant Instructions

When building this app:

1. **Always prioritize design quality**. If a component looks basic, refine it.
2. **Ask clarifying questions** before implementing complex features.
3. **Provide complete, working code** - not pseudocode.
4. **Include Tailwind classes** for styling (match Duolingo's visual polish).
5. **Add comments** explaining Supabase queries and OpenAI prompts.
6. **Suggest improvements** if you see a better approach.
7. **Handle errors gracefully** - always include try/catch blocks.
8. **Make it responsive** - mobile-first, then desktop.

### Example Prompt for AI Assistant:
*"Build the Dashboard Header component. It should have a greeting with the user's name (from Supabase auth), their avatar (Lucide User icon if no image), and a streak counter with a fire emoji. Style it like Duolingo's header - clean, colorful, with smooth hover effects. Use Tailwind and Framer Motion."*

---

## Success Metrics

Your app is ready to launch when:
- ✅ A new user can sign up and complete onboarding in under 2 minutes
- ✅ Lessons feel engaging (not like a boring quiz)
- ✅ Rewards feel satisfying (animations + feedback)
- ✅ Design looks professional on phone screens
- ✅ AI verification works accurately >80% of the time
- ✅ No critical bugs in main flows

---

**Remember**: Ship a polished MVP first. Don't build everything at once. Start with Phases 1-3, get feedback, then add community features and advanced AI.

Good luck! 🚀🌱