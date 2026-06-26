# Lokayantra — HTML5 Game Platform

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Firebase (Auth, Firestore, Storage) + Cloudinary + Disqus.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Firebase, Cloudinary,
   and admin email values.

   - Firebase web config: Firebase Console → Project Settings → General → Your apps
   - Firebase Admin SDK (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`,
     `FIREBASE_PROJECT_ID`): Firebase Console → Project Settings → Service
     Accounts → Generate new private key
   - Cloudinary cloud name: Cloudinary Dashboard
   - Create an **unsigned** Cloudinary upload preset named
     `lokayantra_unsigned` (Settings → Upload → Upload presets)

3. Replace `yourgmail@gmail.com` in `firestore.rules` and `storage.rules`
   with your real admin Gmail address (must match `ADMIN_EMAIL` /
   `NEXT_PUBLIC_ADMIN_EMAIL` in `.env.local`).

4. Deploy Firestore & Storage rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```
   (requires `firebase-tools` and `firebase login` / `firebase use <project>`)

5. In Firebase Console → Authentication → Sign-in method, enable **Google**.

6. In Firebase Console → Authentication → Settings → Authorized domains,
   add your production domain.

7. Update `DISQUS_SHORTNAME` in `components/DisqusComments.tsx` and
   `SITE_URL` in `app/games/[id]/page.tsx` to match your real site.

8. Run locally:
   ```bash
   npm run dev
   ```

## Deploying

Push to GitHub and import into Vercel. Add every variable from
`.env.example` under Project Settings → Environment Variables, then deploy.

## Structure

- `/app` — pages (home grid, `/games/[id]` player, `/admin` dashboard & upload)
- `/components` — UI components (GameCard, AdminGuard, upload form, etc.)
- `/lib` — Firebase client/admin config, auth context, helpers
- `/types` — shared TypeScript types
- `firestore.rules` / `storage.rules` — security rules
