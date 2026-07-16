# T4 Traders Website Documentation

## 1. Overview
T4 Traders is a modern, responsive React-based web application serving as an educational platform for trading. The platform offers courses, live sessions, and a comprehensive admin dashboard to manage student registrations and revenue. It is built with a sleek, dark-mode aesthetic featuring advanced animations.

## 2. Technology Stack
- **Frontend Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS, custom CSS (`index.css`), and animations via GSAP & Framer Motion
- **Routing:** React Router v7
- **Backend / Database / Auth:** Supabase
- **Analytics:** Vercel Analytics
- **Icons:** Lucide React

## 3. Core Features & Pages

### 3.1 Public Pages
- **Home Page (`/`)**: 
  - **Hero Section:** Animated Strobe Text ("TRADE ON YOUR OWN TERMS") and actionable buttons ("Start Learning" and "Free Trial").
  - **Ticker Tape:** A continuous scrolling marquee displaying live/simulated stock market data (NIFTY 50, SENSEX, RELIANCE, etc.).
  - **Stats Section:** Highlights the institute's credibility (12,400+ students, 4.8/5 rating, 6 yrs track record).
  - **The T4 Method Section:** An interactive, scroll-pinned section built with GSAP detailing their four-pillar framework:
    - **T1 - Timing:** Candlestick structure and volume confirmation.
    - **T2 - Trend:** Multi-timeframe trend mapping.
    - **T3 - Trigger:** Rules-based entry and exit.
    - **T4 - Target:** Position sizing and portfolio targets.
  - **Inside T4 (Gallery):** A visual grid showing live chart walkthroughs, dashboard setups, momentum drills, and paired trade reviews.
  - **Student Reviews:** An auto-scrolling testimonial carousel displaying feedback from past students.
  - **Mentors (Team):** A split-screen interactive UI introducing the platform's experts (Rahul Sharma and Ananya Desai).
  - **FAQ Section:** An accordion displaying frequently asked questions.

- **Consultation (`/consultation`)**: 
  - A dedicated page where users can book a free counseling session to get personalized course recommendations.

- **Free Trial (`/free-trial`)**: 
  - A signup page offering users temporary free access to experience the platform's features.

- **Authentication (`/login`, `/register`, `/reset-password`)**:
  - Full authentication flow powered by Supabase Auth, allowing users to sign up, log in securely, and reset forgotten passwords.

### 3.2 Protected Pages (Requires Authentication)
- **Courses Page (`/course`)**:
  - Displays the comprehensive list of available trading programs.
  - Details options for both Offline Classroom Training and Online Live Classes.
  - **Available Courses (`₹9,999` each):**
    - **SMC (Smart Money Concepts):** Institutional trading, liquidity mapping, and order blocks.
    - **Price Action:** Pure chart reading, candlestick mastery, and market structure.
    - **Psychology of Market:** Emotional discipline, trader mindset, and decision making.
    - **Risk Management:** Capital protection, position sizing, and risk-to-reward.
    - **Advanced Concept (MSNR):** Multi-confirmation setups and precision execution.

- **Checkout Page (`/checkout/:courseId`)**:
  - A dynamic, secure checkout page where users can finalize the purchase of their selected course. Integrates with the backend database to log transactions.

- **Admin Dashboard (`/dashboard`)**:
  - Protected route accessible only to authorized administrators.
  - **Real-time Metrics:** Displays Total Revenue, Active Students, New Registrations (last 7 days), and Courses Sold.
  - **Live Transactions Table:** A real-time data table (powered by Supabase Realtime subscriptions) showing recent student purchases, including User Email, Course Name, Date, Amount, and Payment Status.
  - **System Status Indicator:** Monitors the operational status of the Payment Gateway, Student Portal, and Live Streaming API.

## 4. UI/UX Design & Custom Components
- **Animations:** Extensive use of `framer-motion` for page transitions and element reveals, and `gsap` for complex scroll-linked animations (e.g., the T4 Method card stacking effect).
- **Glassmorphism & Effects:** The UI heavily utilizes `GlassCard` components for a premium, translucent, frosted-glass effect over dark backgrounds.
- **Dynamic Elements:** Features strobe texts, glitch hover cards, magnetic icons, and animated borders for an immersive, tech-forward trading environment.
- **Responsive Layout:** Fully optimized for mobile, tablet, and desktop devices utilizing Tailwind CSS utilities and a custom MobileMenu component.

## 5. Backend & Data Flow
- **Supabase Integration:** 
  - Manages User Sessions and Authentication via a global `AuthContext`.
  - Stores and retrieves courses and transaction histories.
  - Utilizes PostgreSQL real-time subscriptions to instantly update the Admin Dashboard when new transactions occur, ensuring admins see live data without refreshing the page.
