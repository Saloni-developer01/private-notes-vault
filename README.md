# 🔐 Private Notes Vault

A secure, full-stack private notes application built with **Next.js 15**, **MongoDB**, and **NextAuth.js**. This project features dual-authentication (Google OAuth + Email/Password) and a clean, distraction-free dashboard.

## 🚀 Live Demo
[Click here to view the Live Site](https://your-netlify-link-here.netlify.app) 

## ✨ Features
- **Dual Authentication**: Sign in using Google or create a traditional Email/Password account.
- **Secure Storage**: Passwords are encrypted using `bcryptjs`.
- **Note Management**: Create, view, and delete notes in real-time.
- **Single Note View**: Click on any note to open a detailed modal view.
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.
- **Modern UI**: Built with Tailwind CSS and Lucide React icons.

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas with Mongoose
- **Auth**: NextAuth.js (Google Provider & Credentials)

## 📦 Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/your-username/private-notes-vault.git](https://github.com/your-username/private-notes-vault.git)

2. **Install dependencies:**
    ```bash
    npm install

3. **Set up environment variables:** Create a .env.local file and add:
    ```bash
    MONGODB_URI=your_mongodb_uri
    GOOGLE_ID=your_google_id
    GOOGLE_SECRET=your_google_secret
    NEXTAUTH_SECRET=your_random_secret
    NEXTAUTH_URL=http://localhost:3000

4. **Run the app:**
    ```bash
    npm run dev
    
