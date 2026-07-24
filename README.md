# Credentialing Tracker (multi-practice)

A shared, real-time credentialing tracker built to handle multiple practice
groups / clients, not just one. Everyone signs in with their own account;
whoever signs up first is the admin.

- **Practice switcher** — a dropdown in the header lets you add and jump
  between different practice groups (clients). Each one has its own payor
  applications, providers, and documents.
- **Board & table views** of every payor application, by workflow stage:
  Not Started → Submitted → In Review → Approved → Denied
- **Provider Documents tab** for license/PLI/DEA expirations, per practice
- **Team tab** showing who has access
- **Admin-only tracker name** — the app's title (top-left) can only be
  renamed by an admin. Click the pencil icon next to the title to rename it.
- **Live sync** — teammates' changes appear automatically, no refresh needed
- Pre-loaded with DocDx.com's ~60 payor entries as a starter practice the
  first time the database is empty, so it isn't blank on first login

---

## What you'll set up (about 20–30 minutes, no coding required)

1. A free Supabase project (this is your database + login system)
2. A free Vercel account (this hosts the app and gives you a URL)
3. Connect the two together

---

## Step 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign up (free tier is enough).
2. Click **New project**. Name it e.g. `credentialing-tracker`, set a database password (save it somewhere), pick the region closest to you, and click **Create**. Wait ~1 minute.
3. In the left sidebar, click **SQL Editor** → **New query**.
4. Open `supabase/schema.sql` from this project folder, copy the entire contents, paste it into the SQL editor, and click **Run**. This creates every table (`practices`, `entries`, `documents`, `profiles`, `app_settings`) plus the "only admins can delete / rename" rules.
5. In the left sidebar, click **Project Settings** (gear icon) → **API**. You'll need two values in Step 3:
   - **Project URL**
   - **anon public** key

---

## Step 2 — Run it locally to confirm it works

1. Install [Node.js](https://nodejs.org) (LTS version) if you don't have it.
2. Open a terminal in this project folder and run:
   ```
   npm install
   cp .env.example .env.local
   ```
3. Open `.env.local` and paste in your Project URL and anon key from Step 1.5.
4. Run:
   ```
   npm run dev
   ```
5. Open the printed link (usually `http://localhost:5173`). Sign up with your email — this is your permanent login.
6. **Make yourself admin:** in Supabase → **Table Editor** → `profiles` table → find your row → change `role` from `member` to `admin` → save. Refresh the app — you'll see the shield icon next to your email, and a pencil icon will appear next to the tracker's title.

The first time you sign in, the app auto-creates a "DocDx.com" practice with the data from your original spreadsheet, so you can see it working right away. Add your other clients using **+ New practice group** in the practice switcher (top-left dropdown).

---

## Step 3 — Deploy it so your team can use it

**Easiest path — Vercel + GitHub:**

1. Create a free [GitHub](https://github.com) account if needed, make a new repository, and upload this whole project folder (GitHub's website lets you drag-and-drop if you don't want to use git commands).
2. Go to [vercel.com](https://vercel.com) → sign up with GitHub → **Add New Project** → import that repository.
3. Before deploying, expand **Environment Variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**. In about a minute you'll get a live URL like `your-tracker.vercel.app`.
5. Share that link with your team — each person signs up with their own email the first time they visit.

---

## Installing it as an app (desktop + phone)

This is a Progressive Web App (PWA), so it installs like a real app — one
icon, its own window, no browser bar — without going through an app store.

**Desktop (Windows or Mac, Chrome/Edge):**
Once deployed, open the link and either click the install icon (⊕) in the
address bar, or use the in-app banner that appears the first time you visit
— click **Install**. It'll open in its own window and show up in your Start
Menu / Applications like any other app.

**Android:**
Open the link in Chrome — you'll see the same install banner, or use
Chrome's menu (⋮) → *Install app*.

**iPhone / iPad:**
Safari doesn't support one-tap install, so it's two taps: open the link in
Safari → **Share** → **Add to Home Screen**. The in-app banner reminds you
of this the first time you visit on an iPhone.

A few notes on how this works: the app shell (screens, styling) is cached
so it opens instantly and even without a connection, but the actual data
(applications, documents) still requires internet since it lives in
Supabase — this is the same as any other cloud-connected app (e.g. Gmail).

If down the line you specifically need a listing in the Apple App Store or
Google Play Store, that's a bigger step up (Apple/Google developer accounts,
app review, a Mac for iOS builds) — let me know if you get there and I can
help you wrap this same codebase for that using Capacitor.

---

## Managing practices, your team, and permissions

- **Adding a client:** anyone on the team can add a new practice group via the switcher. It starts empty — add payor applications and documents from there.
- **Renaming the tracker itself** (the "Credentialing Tracker" title): only admins can do this, via the pencil icon next to the title. This is separate from practice names, which any team member can set when adding a practice.
- **Who can sign up:** by default, anyone with the link can create an account and joins as a `member` (can view/edit everything, cannot delete or rename). To lock this down, go to Supabase → **Authentication** → **Providers** → **Email** and turn off "Allow new users to sign up," then invite people individually from **Authentication** → **Users** → **Invite user**.
- **Promoting an admin:** edit their row in the `profiles` table the same way you did for yourself. Keep this to people you trust with delete/rename access.
- **Deleting** an application, document, or practice is admin-only by design, since it's shared data across your team.

## Notes

- All data for a practice (applications + documents) is scoped to it — switching practices swaps the whole workspace.
- If you ever want to reset a practice to a clean slate, delete its rows from `entries` and `documents` in the Supabase Table Editor (or delete the practice itself, which cascades and removes everything under it — admin only).
