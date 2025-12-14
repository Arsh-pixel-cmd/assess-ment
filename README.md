# Woohl – Full-Stack Authentication & Dashboard App

This project is a **full-stack web application** built using **Next.js (App Router)** as part of an **unpaid internship assessment**.  
It demonstrates a **practical implementation of authentication, protected routes, and a functional user dashboard**, rather than just static UI screens.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS  
- **Backend / Authentication:** Supabase  
- **Deployment:** Vercel-ready  

---

## ✨ Features Implemented

### 🔐 Complete Authentication System (Supabase)

- Email **Sign Up & Sign In**
- **Email verification** flow
- **Forgot password** with **OTP-based password reset**
- **Google OAuth** login
- Secure **session handling using cookies**
- **Server-side protected routes**

---

### 📊 Fully Loaded Dashboard

- Protected dashboard accessible **only after authentication**
- Personalized user greeting
- Task-based onboarding system
- Progress tracking & points system
- Interactive UI components
- Logout functionality with proper session cleanup

---

## 🧠 Architecture Highlights

- Server-side authentication guard on the dashboard
- Clear separation of **server components** and **client components**
- Supabase **SSR integration** for secure session handling
- Scalable and maintainable folder structure following best practices

---

## 📂 Project Structure (Simplified)

```text
app/
 ├─ auth/
 │   └─ callback/route.ts
 ├─ login/
 ├─ signup/
 ├─ forgot-password/
 ├─ dashboard/
 │   └─ page.tsx (protected route)
components/
 ├─ AuthPage.tsx
 ├─ HomePage.tsx
 ```

## 🧪 What This Project Demonstrates

- Real-world authentication flows (not just UI)
- Proper handling of async session persistence
- Secure route protection using the Next.js App Router
- OTP-based password recovery logic
- OAuth integration
- Clean, readable, and maintainable code

This project focuses on **functionality, structure, and correctness**, not just visuals.

---

## 🛠 Getting Started Locally

### Install dependencies
```bash
npm install
```

## 🛠 Run the Development Server

```bash
npm run dev
```
## 🌐 Open in Browser

```
http://localhost:3000
```


---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Deployment

The project is ready to be deployed on **Vercel**.

### Deployment Steps
1. Push the repository to GitHub  
2. Import the project into Vercel  
3. Add environment variables  
4. Deploy  

---

## 📝 Notes for Reviewers

This project was built as part of an **internship assessment**.  
Special emphasis was placed on:

- Correct authentication flow  
- Secure session handling  
- Practical backend integration  
- Clean and scalable architecture  

---

## 👨‍💻 Author

**Arsh**  
Computer Science Engineering Student  
Focused on **Full-Stack Development** & **Real-World Web Applications**
