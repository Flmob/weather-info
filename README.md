This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🌦️ Weather Info

Simple app to check local and worldwide weather.

## ✨ Features

- **Global Search:** Find weather info for any city.
- **Search History:** Quickly access your recent locations.
- **Smart UI:** Dynamic search bar with blur effects and smooth transitions.
- **Developer Friendly:** Built-in Swagger UI for API testing.
- **Shortcuts:** Undo history deletion with `Cmd/Ctrl + Z`.

## 🚀 Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/Flmob/weather-info.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**

   - Copy `.env.example` to a new file named `.env`:
   - Open `.env` and add your API key. You can get a free key by signing up at [OpenWeatherMap](https://openweathermap.org) (or your chosen provider).

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Have fun:**

   Open [http://localhost:3000](http://localhost:3000) to see the app or [http://localhost:3000/swagger](http://localhost:3000/swagger) for API docs.

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TanStack Query** (Data fetching & Caching)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

> **Note on Swagger:** If you encounter issues with Swagger in production, refer to [this guide](https://tocalai.medium.com/create-swagger-document-on-next-js-11b2c9cf103c).
