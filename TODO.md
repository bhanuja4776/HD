## AI Financial Sakhi – Project TODO

High-level implementation checklist based on the Design Doc, PRD, and Tech Stack, using **React.js + Tailwind CSS + Supabase + OpenAI** (no ShadCN).

---

## 1. Project Setup & Architecture

- **Project initialization**
  - [ ] Initialize React + TypeScript app (e.g. Vite + React + TS).
  - [ ] Install and configure Tailwind CSS.
  - [ ] Install dependencies: `react-router-dom`, `@supabase/supabase-js`, `recharts`, `framer-motion`, `axios` (or fetch wrapper).
  - [ ] Set up basic folder structure: `components/`, `pages/`, `hooks/`, `services/`, `types/`, `layouts/`.

- **Theme, colors, and typography**
  - [ ] Configure Tailwind theme with primary gradient colors:
        - Purple `#6C3BFF`
        - Pink `#D946EF`
        - Warm Gold `#F6C453`
  - [ ] Add secondary colors:
        - Trust Blue `#0F172A`
        - Positive Finance Green `#22C55E`
        - Alert Red `#EF4444`
        - Neutral Background `#F8FAFC`
  - [ ] Configure fonts: Inter (body) and Poppins (headlines) via CSS/Google Fonts.
  - [ ] Define typography scale in Tailwind (hero 48px, section titles 28px, body 16px, financial numbers 20px).

- **Routing & layout**
  - [ ] Add React Router with routes: `/`, `/dashboard`, `/budget`, `/simulator`, `/learning`, `/schemes` (optional), `/login`, `/signup`.
  - [ ] Create main layout with navbar, footer, and chat widget placeholder.
  - [ ] Implement responsive container and spacing system using Tailwind.

- **Supabase backend**
  - [ ] Create Supabase project and configure environment variables in the React app.
  - [ ] Define tables:
        - `users` (id, name, email, income, goal/financial_goals).
        - `expenses` (id, user_id, category, amount, date).
        - `simulations` (id, user_id, investment_type, amount, duration, projected_returns).
        - `lessons` (id, title, content, difficulty_level).
        - `schemes` (id, name, eligibility, benefits).
  - [ ] Initialize Supabase client and helper functions for CRUD operations.

---

## 2. User Authentication

- **UI**
  - [ ] Create `/signup` page with name, email, password, and optional income/goals fields.
  - [ ] Create `/login` page with email + password.
  - [ ] Add form validation and error/success messages.
  - [ ] Add “Start Your Financial Journey” CTA on landing that routes to signup/login.

- **Backend / Data**
  - [ ] Configure Supabase Auth (email/password, optional OAuth provider).
  - [ ] On successful signup, insert user profile into `users` table with basic financial info.
  - [ ] Implement session handling (Supabase auth listener, stored session).

- **Logic / UX**
  - [ ] Protect authenticated routes (`/dashboard`, `/budget`, `/simulator`, etc.).
  - [ ] Implement logout functionality (clear session + redirect).
  - [ ] Add simple onboarding step after first login to collect income and financial goals if missing.

---

## 3. Financial Learning Module

- **UI**
  - [ ] Create `Learning` page showing a list of lessons with title, difficulty, and status (Not started / In progress / Completed).
  - [ ] Implement lesson detail view with content and “Mark as completed” button.

- **Backend / Data**
  - [ ] Seed `lessons` table with core topics:
        - Saving money
        - Budgeting basics
        - Understanding investments
        - Risk and returns
  - [ ] Add per-user lesson progress (either via join table or JSON field).
  - [ ] Implement functions to fetch lessons and update completion status.

- **Logic / UX**
  - [ ] Show progress bar or count of completed lessons.
  - [ ] Surface relevant lesson links inside chatbot answers (e.g. “Learn more in Lesson X”).

---

## 4. Budget Planner & Expense Tracker

- **UI**
  - [ ] Create `Budget` page with:
        - Input for monthly income.
        - Form to add expenses (amount, category, date, note).
        - List/table of recent expenses.
  - [ ] Add Recharts visuals:
        - Pie / donut chart for expense distribution by category.
        - Line or bar chart for expenses over time.

- **Backend / Data**
  - [ ] Implement Supabase operations:
        - Insert new expense.
        - Fetch expenses by user, filtered by month/date.
        - Update/delete expense (optional for MVP).
  - [ ] Store user income and optionally budget targets in `users` table or a separate `budgets` table.

- **Logic / UX**
  - [ ] Compute:
        - Total income, total expenses, remaining savings.
        - Breakdown per category.
  - [ ] Add basic insights:
        - “You are overspending on X category.”
        - “You could save ₹Y if you limit Z by 10%.”
  - [ ] Highlight positive states using Positive Green and risks with Alert Red.

---

## 5. Investment Simulator

- **UI**
  - [ ] Create `Investment Simulator` page:
        - Form to allocate virtual funds to instruments (FD, mutual funds, gold, savings account).
        - Card-based view of current simulated portfolio.
        - Chart showing projected returns over time.
  - [ ] Add summary cards like “+12.8% simulated growth”.

- **Backend / Data**
  - [ ] Use `simulations` table to store each user’s scenario (type, amount, duration, projected_returns).
  - [ ] Optionally add simple static rate assumptions or configurable constants.

- **Logic / UX**
  - [ ] Implement simple return formulas for:
        - Fixed deposits
        - Mutual funds
        - Gold
        - Savings accounts
  - [ ] Show profit/loss and risk notes in beginner-friendly language.
  - [ ] Provide a “Reset simulation” and “Try another scenario” flow.

---

## 6. Government Scheme Finder (Optional for MVP)

- **UI**
  - [ ] Create `Schemes` page with:
        - Simple form for age, income, occupation, and key attributes.
        - List of matching schemes displayed as cards.

- **Backend / Data**
  - [ ] Seed `schemes` table with a few representative government schemes (name, eligibility, benefits).
  - [ ] Implement filtering logic using basic rules on age/income/occupation.

- **Logic / UX**
  - [ ] Display “You might be eligible for:” cards with summary and external link.
  - [ ] Indicate that data is sample/demo for hackathon.

---

## 7. AI Financial Assistant (Chatbot)

- **UI**
  - [ ] Implement floating chat widget visible on main pages (bottom-right on desktop, pinned bottom on mobile).
  - [ ] Add chat history display, input box, send button.
  - [ ] Add suggestion chips:
        - “How can I start investing?”
        - “How much should I save monthly?”
        - “Explain mutual funds”
  - [ ] Show typing indicator while waiting for AI response.

- **Backend / Data**
  - [ ] Create API route (e.g. `/api/chat`) using a lightweight Node/Express or serverless function that:
        - Accepts user question + minimal context.
        - Calls OpenAI API with a prompt tuned for beginner women users.
        - Returns concise, safe, and friendly answers.
  - [ ] Optionally log anonymized questions/answers for future analytics.

- **Logic / UX**
  - [ ] Design system prompt focusing on:
        - Simple language
        - Indian financial context (₹, common instruments)
        - Encouraging, non-judgmental tone
  - [ ] Handle errors gracefully (fallback “I’m having trouble, please try again”).
  - [ ] Add quick links in responses to relevant modules (Budget, Simulator, Learning).

---

## 8. Dashboard & Impact Metrics

- **UI**
  - [ ] Create `Dashboard` page as the central hub showing:
        - Total income, total expenses, savings progress.
        - Snapshot of latest simulation result.
        - Learning progress summary.
        - AI insight bubbles (e.g. grocery spend up 12%).
  - [ ] Add “Impact metrics” per design doc:
        - “72% women feel more confident…” (static demo metric).
        - “15K+ financial decisions simulated safely” (demo).
        - “₹3M+ virtual investments practiced” (demo).
  - [ ] Design cards with large financial numbers (20px+ bold) to create authority.

- **Backend / Data**
  - [ ] Aggregate:
        - Expenses for current period.
        - Simulations (last or most relevant).
        - Lesson completion stats.
  - [ ] Provide a dashboard data loader/util hook to fetch all in one place.

- **Logic / UX**
  - [ ] Compute simple KPIs:
        - Savings rate % = savings / income.
        - Expense top category.
  - [ ] Display KPIs using clear labels and colors (green for good, red for alert).

---

## 9. Landing Page & Story Flow

- **Hero section**
  - [ ] Implement hero with headline “Where Financial Confidence Begins” and subheading from design doc.
  - [ ] Add primary CTA “Start Your Financial Journey” and secondary “Explore the Platform”.
  - [ ] Style buttons with purple → pink gradient and hover micro-interactions (glow + scale).
  - [ ] Add floating insight cards:
        - Savings Insight: “You could save ₹2500 this month.”
        - Portfolio Progress: “+12.8% simulated growth.”
        - Investment Tip: “Diversification reduces risk.”

- **Story sections (scroll order)**
  - [ ] Implement sections in this order:
        - Impact Metrics
        - How the Platform Works (simple 3–4 step flow)
        - Features (Budget, Simulator, Learning, Scheme Finder, AI Assistant)
        - Investment Intelligence (charts + simulator preview)
        - Learning Hub (lessons preview)
        - FAQ
        - Community & Trust (testimonials/NGO/mission)
        - Footer

- **Footer**
  - [ ] Add footer with columns:
        - Platform: About, Features, Community
        - Learning: Financial Basics, Investment Guides, Resources
        - Support: Help Center, Privacy, Terms
        - Newsletter: “Weekly financial insights for ambitious women” + email input.

---

## 10. Illustrations & Visuals

- [ ] Choose or create flat modern illustrations matching:
      - Women collaborating
      - Financial growth charts
      - Learning & mentorship
      - AI guidance
- [ ] Ensure illustration palette matches primary gradient and secondary colors.
- [ ] Place illustrations in hero, features, and community sections to support storytelling.

---

## 11. Animations & Micro-Interactions (Framer Motion + CSS)

- **Hero gradient**
  - [ ] Implement slow animated gradient background in hero using CSS or Framer Motion.

- **Floating cards**
  - [ ] Add subtle up/down motion and hover elevation for floating insight cards.

- **Charts**
  - [ ] Animate charts on entry (values grow from 0 to final).

- **Buttons & links**
  - [ ] Add hover effects: slight scale, glow, and color intensity changes.

- **FAQ**
  - [ ] Implement accordion with smooth expand/collapse transition.

---

## 12. AI Insights & Innovation Layer

- [ ] Implement a small service that:
      - Fetches recent expenses grouped by category for a user.
      - Sends a concise summary to OpenAI to generate 1–2 insight sentences.
      - Parses and returns insights for display.
- [ ] Show AI insight bubble on dashboard or budget page (e.g., “Your grocery expenses increased 12% this month.”).
- [ ] Add “See related tip” linking to a relevant lesson or chatbot suggestion.

---

## 13. Accessibility, Responsiveness & Performance

- **Accessibility**
  - [ ] Ensure high contrast between text and background, especially on gradients.
  - [ ] Maintain minimum font size of 16px for body text.
  - [ ] Provide clear focus styles for buttons, links, and inputs.
  - [ ] Use semantic HTML for sections, headings, and landmarks.

- **Responsiveness**
  - [ ] Test layouts on mobile, tablet, and desktop.
  - [ ] Stack cards and sections vertically on small screens.
  - [ ] Pin chat assistant at bottom-right on mobile.

- **Performance**
  - [ ] Optimize images (sizes, formats).
  - [ ] Lazy-load heavy components (charts, simulator) where appropriate.
  - [ ] Cache or debounce expensive API calls if needed.

---

## 14. Deployment & Hackathon Demo Prep

- **Deployment**
  - [ ] Initialize Git repository and connect to GitHub.
  - [ ] Configure deployment on Vercel or Netlify for the React SPA.
  - [ ] Set environment variables for Supabase and OpenAI in the hosting platform.

- **Demo data**
  - [ ] Seed demo user with realistic income, expenses, simulations, and learning progress.
  - [ ] Pre-populate sample government schemes and lessons.

- **Demo script**
  - [ ] Plan and rehearse live demo flow:
        1. User login/signup.
        2. Add or show existing expenses.
        3. View dashboard insights and charts.
        4. Run an investment simulation and show results.
        5. Ask AI chatbot a financial question and show answer.
        6. Highlight AI insight bubble and learning module.
  - [ ] Prepare backup screenshots or screen recording in case of connectivity issues.

---

## 15. Future Enhancements (Post-Hackathon Ideas)

- [ ] Voice-based financial assistant.
- [ ] Multilingual support (e.g., Hindi/regional languages).
- [ ] Native mobile app or responsive PWA improvements.
- [ ] Community discussion forums or group challenges.
- [ ] Deeper integration with real financial services (banks/brokers) once regulated.

