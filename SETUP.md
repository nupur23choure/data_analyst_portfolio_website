# Setup: free hosting + add projects from your browser

Everything below is free. Takes about 15 minutes, once.

## 1. Create a free database (Supabase)
1. Go to https://supabase.com and sign up (free plan).
2. Click **New project**, give it a name and a database password, pick a region close to India, and wait about a minute.

## 2. Create the projects table
1. Open `supabase.sql` from this folder.
2. Replace `YOUR_EMAIL@example.com` (twice) with the email you will log in with.
3. In Supabase: **SQL Editor > New query**, paste the text, click **Run**.

## 3. Create your admin login
1. Supabase: **Authentication > Users > Add user > Create new user**.
2. Enter the same email and a strong password. Tick **Auto Confirm User**.
3. Supabase: **Authentication > Sign In / Providers**, turn **OFF** "Allow new users to sign up". This stops anyone else from creating an account.

## 4. Connect the site
1. Supabase: **Project Settings > API**.
2. Copy the **Project URL** and the **anon public** key.
3. Paste them into `config.js`. (The anon key is meant to be public. The database rules from step 2 mean visitors can only read.)

## 5. Put the site online for free
Pick one:
- **Netlify (easiest):** go to https://app.netlify.com/drop and drag the whole portfolio folder in. You get a link like `yourname.netlify.app`. You can rename it in Site settings.
- **GitHub Pages:** create a repo, upload all the files, then Settings > Pages > Deploy from branch > main.

## 6. Add projects
1. Open `your-site-link/admin.html` and log in.
2. Fill in title, domain, tools, GitHub link, short description, and choose a dashboard or overview screenshot.
3. Click **Save project**. It shows on your site straight away. No re-upload needed.
4. While you are logged in, a **+ Add project** button also floats on your site pages. Visitors never see it.

Visitors only see project cards. Clicking a card opens the GitHub link you saved.

## 7. LinkedIn
- Profile: **Contact info > Website**, or add the link under **Featured > Add > Link**.
- Put the same link in your About section and in job applications.

## Tips
- Use `https://` in the GitHub link.
- Screenshots are resized in your browser, so big images are fine.
- Your `admin.html` link is not listed anywhere on the site, and nobody can use it without your password.
