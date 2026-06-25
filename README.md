# ⚡ ApexForge — Fitness & Gym Management Platform

> A high-performance gym management platform engineered for athletes, trainers, and administrators. Built with Next.js 14, Tailwind CSS, and Framer Motion.

---

## 🌐 Live URL

🔗 **[https://apexforge-nextjs.vercel.app](https://apexforge-nextjs.vercel.app)**

---

## 📌 Project Purpose

ApexForge is a full-stack fitness platform where users can discover and book gym classes, trainers can manage their programs, and administrators oversee the entire ecosystem. The platform features role-based dashboards, Stripe payments, Google OAuth, and a community forum — all wrapped in a glassmorphism dark UI with smooth Framer Motion animations.

---

## 🔑 Admin Credentials

| Field | Value |
|-------|-------|
| **Email** | `admin@apexforge.com` |
| **Password** | `Admin@123` |

---

## ✨ Key Features

### 🏋️ Public Features
- Energetic **Hero Banner** with animated stats
- **Featured Classes** section based on booking count with staggered animations
- **Latest Forum Posts** from trainers and admins
- **Why Choose Us** and **Testimonials** sections with glassmorphism cards
- **Browse All Classes** with search by name and filter by category
- **Community Forum** with paginated posts

### 🔐 Authentication
- Email/Password registration with validation rules
- **Google OAuth** via Better Auth
- **JWT stored in HTTPOnly cookies** for security
- Protected routes with role-based redirects

### 👤 User Dashboard
- Overview with stats (Booked Classes, Favorites)
- **Booked Classes** table with class details
- **Favorite Classes** management
- **Apply as Trainer** form with status tracking
- Application feedback from admin visible on overview

### 🏅 Trainer Dashboard
- Overview with classes created and students enrolled
- **Add Class** form (Name, Image, Category, Level, Schedule, Price)
- **My Classes** table with update, delete, and view students
- **Add/Manage Forum Posts**

### 🛡️ Admin Dashboard
- Platform-wide statistics (Users, Classes, Bookings)
- **Manage Users** — Block/Unblock, Promote to Admin
- **Applied Trainers** — Approve/Reject with feedback modal
- **Manage Trainers** — Demote trainer to user
- **Manage Classes** — Approve, Reject, Delete
- **Transactions** — Full Stripe payment history
- **Forum Moderation** — Delete any inappropriate post
- **Add Forum Post** as admin

### 💳 Payments
- **Stripe Checkout** integration on class booking
- Payment history stored and displayed in admin dashboard
- Success page on payment completion

### 💬 Community Forum
- Like/Dislike system (one vote per user)
- Nested comments with edit/delete own comments
- Private post details (login required)

### 🎨 UI/UX
- **Glassmorphism** dark theme with neon `#c8f500` accent
- **Framer Motion** animations — stagger reveals, hover lifts, AnimatePresence transitions
- Fully **responsive** — Mobile, Tablet, Desktop
- Animated **Dashboard Sidebar** with role-based navigation
- Custom **404 page** and global loading spinner

---

## 📦 NPM Packages Used

| Package | Purpose |
|---------|---------|
| `next` | React framework with App Router |
| `react` / `react-dom` | UI library |
| `tailwindcss` | Utility-first CSS framework |
| `framer-motion` | Animations and transitions |
| `better-auth` | Authentication (credentials + Google OAuth) |
| `@tanstack/react-query` | Server state management and data fetching |
| `axios` | HTTP client for API requests |
| `@stripe/react-stripe-js` | Stripe payment UI components |
| `@stripe/stripe-js` | Stripe.js SDK |
| `react-hook-form` | Form handling and validation |
| `react-hot-toast` | Toast notifications |
| `recharts` | Charts for admin analytics dashboard |
| `lucide-react` | Icon library |
| `postcss` / `autoprefixer` | CSS processing |

---

## 🔗 Related Repositories

- **Server Repository:** [https://github.com/rakibulhasanridoy/apexforge-server](https://github.com/rakibulhasanridoy/apexforge-server)
- **Client Repository:** [https://github.com/rakibulhasanridoy/apexforge-nextjs](https://github.com/rakibulhasanridoy/apexforge-nextjs)

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/rakibulhasanridoy/apexforge-nextjs.git
cd apexforge-nextjs

# Install dependencies
npm install

# Create .env.local and add your variables
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key

# Start development server
npm run dev
```

---

## 🧑‍💻 Developer

**Rakibul Hasan Ridoy**
- 🌐 Portfolio: [rakibul-hasan-ridoy.vercel.app](https://rakibul-hasan-ridoy.vercel.app)
- 💼 LinkedIn: [linkedin.com/in/rakibulhasanridoy](https://linkedin.com/in/rakibulhasanridoy)
- 🐙 GitHub: [github.com/rakibulhasanridoy](https://github.com/rakibulhasanridoy)

---

> ⚡ *Engineered for High Performance.*
