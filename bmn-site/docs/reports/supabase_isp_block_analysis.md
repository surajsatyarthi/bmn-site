# Root Cause Analysis: Supabase Login Hang

**Date:** 2026-02-25
**Issue:** User unable to log into Vercel Preview for over a week. The login button "hangs" on "Signing In..." indefinitely.

## The Findings

The code and Vercel are **not the problem**. The issue is entirely caused by your local Internet Service Provider (Reliance Jio / Indian ISP) actively blocking and sinkholing your Supabase project domain at the DNS layer.

When your browser (or my automated browser on your Mac) tries to connect to `https://bxyjkcdqxaeorcwhntqq.supabase.co` to authenticate the user, your router's DNS redirects the request to a dead IP address owned by Reliance Jio (`49.44.79.236`). This drops the connection into a black hole, causing the browser to hang forever waiting for a response that will never come.

### Proof 1: Local DNS Query (Your ISP)
If we ask your local router for the Supabase IP, it returns the Jio block IP:
```bash
$ nslookup bxyjkcdqxaeorcwhntqq.supabase.co
Server:         2405:201:a404:683e::c0a8:1d01
Address:        2405:201:a404:683e::c0a8:1d01#53

Non-authoritative answer:
Name:   bxyjkcdqxaeorcwhntqq.supabase.co
Address: 49.44.79.236   <--- Jio Sinkhole IP!
```

### Proof 2: Google Public DNS Query
If we bypass your router and ask Google (8.8.8.8) for the real IP, it returns the correct Cloudflare IPs:
```bash
$ nslookup bxyjkcdqxaeorcwhntqq.supabase.co 8.8.8.8
Server:         8.8.8.8
Address:        8.8.8.8#53

Non-authoritative answer:
Name:   bxyjkcdqxaeorcwhntqq.supabase.co
Address: 172.64.149.246  <--- Real Supabase IP
Name:   bxyjkcdqxaeorcwhntqq.supabase.co
Address: 104.18.38.10    <--- Real Supabase IP
```

*(Note: Your background data script `import-santander.ts` worked perfectly because it uses the Postgres connection string `aws-1-ap-south-1.pooler.supabase.com`, which your ISP has not blocked.)*

## How to Fix It Right Now

To instantly fix the login issue across your entire local environment (and allow my automated browser to finish the Vercel verification):

**Change your Mac's DNS to Google or Cloudflare:**
1. Open **System Settings** on your Mac.
2. Go to **Network** -> **Wi-Fi** (or your active connection) -> **Details**.
3. Click on the **DNS** tab.
4. Click the **+** button under DNS Servers and add `8.8.8.8`.
5. Click the **+** button again and add `1.1.1.1`.
6. Click **OK**.

Once you do this, your browser will immediately be able to reach Supabase and the login will work instantly.
