# SalonBook Client Application

> Modern, responsive luxury frontend web application for **SalonBook - Salon Appointment Booking Platform**, developed with Next.js (App Router), TypeScript, Tailwind CSS, and verified Stripe Checkout integration.

---

## 📌 Project Overview
SalonBook Client is an aesthetic appointment scheduling web application designed for luxury personal care salons. It offers real-time catalog browsing, instant category filtering and price sorting, protected dynamic service details, clash-free appointment slot booking, responsive Customer and Administrator dashboards, ImgBB image uploading, and seamless digital payments via Stripe.

---

## 🛠️ Technology Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer, Custom Luxury Rose-Gold Palette
- **Icons & UI:** Lucide React, Clsx, Tailwind-Merge
- **State & Auth:** React Context API, JWT authentication, Better Auth client flow
- **Payment Processing:** Stripe Checkout Session redirects & success/cancel handling
- **Image Uploading:** ImgBB REST API integration
- **Document Generation:** jsPDF & jspdf-autotable (PDF invoice generation)
- **Notifications:** React Hot Toast

---

## ✨ Features Breakdown

### 🌐 Public Pages
1. **Homepage:**
   - **Hero Banner:** Compelling headline, luxury salon background overlay, and direct CTA to Explore Services.
   - **Featured Services:** Dynamic grid presenting active database services with images, prices, categories, and durations.
   - **Category Explorer:** Interactive specialty cards (Haircut & Styling, Hair Coloring, Hair Treatment, Facial & Skincare, Makeup, Manicure & Pedicure, Spa & Massage).
   - **Why Choose Us:** Extra showcase highlighting certified master stylists, sterile medical-grade hygiene, and verified client accolades.
2. **Browse Services Page (`/services`):**
   - Live debounced search by service name.
   - Instant category filtering chips.
   - Sorting options by price (Low to High, High to Low), duration, and popularity.
   - Responsive service cards with status and rating indicators.

### 🔒 Authenticated & Protected Pages
3. **Service Details Dynamic Route (`/services/[id]`):**
   - Protected: Automatically prompts unauthenticated guests to sign in.
   - Detailed treatment overview, pricing, duration, and safety checklist.
   - Interactive appointment booking modal with date selection and predefined time slot reservation.
   - Prevents double-booking clashes and restricts admins from submitting customer requests.
4. **Customer Dashboard (`/dashboard/customer`):**
   - **Overview:** Metrics cards displaying Total, Pending, Confirmed, and Cancelled appointments.
   - **My Appointments:** Full booking ledger with status badges, Pay Now trigger for confirmed slots, and cancellation option for pending requests.
   - **PDF Receipt:** Instant branded PDF invoice download for paid appointments.
   - **Profile Management:** Update customer name, phone number, and avatar image via ImgBB upload.
5. **Administrator Dashboard (`/dashboard/admin`):**
   - **Overview:** System-wide metrics (Total Customers, Active Services, Total Requests, Pending, Confirmed, Stripe Revenue totals, Category sales distribution).
   - **Manage Services:** Add new salon services with ImgBB image upload, edit details, delete, and toggle active/inactive status.
   - **Manage Appointments:** Review all bookings, confirm pending slots, or cancel requests.
   - **Manage Users:** View registered customers and toggle block/unblock account access.
   - **Transactions Ledger:** View immutable payment records verified by Stripe webhooks.
   - **Admin Profile:** Manage administrator credentials and avatar.

---

## ⚙️ Environment Variables
Create a `.env.local` file in the root of the client directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ImgBB API Key (Free from api.imgbb.com)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here

# Better Auth Client URL
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <CLIENT_REPOSITORY_URL>
   cd salonbook-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Ensure NEXT_PUBLIC_API_URL points to your running backend server (e.g. http://localhost:5000/api)
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Repository & Live Deployment Links
- **Client Side Repository:** [https://github.com/raisul022/salonbook-client](https://github.com/raisul022/salonbook-client)
- **Server Side Repository:** [https://github.com/raisul022/salonbook-server](https://github.com/raisul022/salonbook-server)
- **Live Server API:** [https://salonbook-server-m31w.onrender.com/api](https://salonbook-server-m31w.onrender.com/api)
- **Live Website:** [https://salonbook-client.vercel.app](https://salonbook-client.vercel.app)

---

## 🔑 Evaluation Credentials
- **Admin Email:** `admin@salonbook.com`
- **Admin Password:** `AdminPassword123!`
- **Demo Customer Email:** `customer@salonbook.com`
- **Demo Customer Password:** `Customer123!`
*(Fast 1-click credential fill buttons are also available directly on the `/auth/signin` screen for evaluator convenience).*
