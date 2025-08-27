# Referral & Share System (Supabase + Next.js/React)

This is an end‑to‑end, production‑ready blueprint (schema, RLS, API routes, components, and reward logic) to let each user share book‑specific posts/stories with a unique link and QR code. Clicks and purchases are tracked and converted into credits/discounts.

---

## 0) Environment & Packages

**Next.js (App Router or Pages)** — examples below use `/app` but adapt easily.

**Install**
```bash
npm i qrcode lucide-react js-cookie nanoid zod
npm i -D @types/js-cookie @types/qrcode
# If you use an OG image route with node-canvas (Node runtime):
npm i canvas
```

**Supabase client setup**: one public client with anon key (browser) and one **server client** with service role (server only).

Add env:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_WEBHOOK_SECRET= # if using Stripe
BASE_URL=https://yourdomain.com
```

---

## 1) Database Schema (SQL) — Supabase

```sql
-- Enable extensions
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- 1. profiles (you may already have this)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  referral_code text unique,
  created_at timestamptz default now()
);

-- Generate default referral_code on first insert
create or replace function public.generate_referral_code() returns trigger as $$
begin
  if NEW.referral_code is null then
    NEW.referral_code := lower(replace(encode(gen_random_bytes(4), 'hex'), '-', ''));
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_profiles_refcode
before insert on public.profiles
for each row execute function public.generate_referral_code();

-- 2. books
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  bg_image_url text,     -- used for share/story background
  accent text,           -- hex color for overlays if you want
  created_at timestamptz default now()
);

-- 3. referral_clicks: raw clickstream
create table if not exists public.referral_clicks (
  id bigserial primary key,
  ref_code text not null,
  book_id uuid references public.books(id) on delete set null,
  ip_hash text,               -- hash(ip + secret) to avoid PII storage
  user_agent text,
  referer text,
  utm jsonb,
  created_at timestamptz default now()
);
create index on public.referral_clicks(ref_code, created_at desc);

-- 4. referral_attributions: successful purchases attributed to a referrer
create table if not exists public.referral_attributions (
  id bigserial primary key,
  referrer_user_id uuid references public.profiles(id) on delete set null,
  ref_code text,
  referred_user_id uuid references public.profiles(id) on delete set null,
  order_id text,
  book_id uuid references public.books(id) on delete set null,
  amount_cents integer not null default 0,
  created_at timestamptz default now()
);
create index on public.referral_attributions(referrer_user_id, created_at desc);

-- 5. rewards ledger (credits/discounts)
create table if not exists public.rewards (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  reason text,
  kind text check (kind in ('credit_cents','discount_pct','perk')) not null,
  value integer not null, -- cents or percent
  source_attr_id bigint references public.referral_attributions(id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz default now()
);
create index on public.rewards(user_id);
```

### RLS Policies
```sql
alter table public.profiles enable row level security;
alter table public.referral_clicks enable row level security;
alter table public.referral_attributions enable row level security;
alter table public.rewards enable row level security;

-- profiles: users can read their own profile
create policy "read own profile" on public.profiles
for select using (auth.uid() = id);
create policy "update own profile" on public.profiles
for update using (auth.uid() = id);

-- clicks/attributions are service-written; allow owners to read aggregates via views or RPCs
create policy "service inserts" on public.referral_clicks
for insert with check (true);
create policy "service inserts" on public.referral_attributions
for insert with check (true);
create policy "owner read attributions" on public.referral_attributions
for select using (referrer_user_id = auth.uid());

create policy "owner read rewards" on public.rewards
for select using (user_id = auth.uid());

-- Optional: create a materialized view for dashboard aggregates (owner-scoped via RPC)
```

---

## 2) Link Structure & Redirect Flow

**Share URL pattern**
```
/r/[refCode]/[bookSlug]
```
This route:
1. Records a click (`referral_clicks`).
2. Sets a cookie `ref_code` and `ref_book` (30 days).
3. Redirects to the book’s landing page `/book/[bookSlug]`.

**App Router example: `/app/r/[refCode]/[bookSlug]/route.ts`**
```ts
// app/r/[refCode]/[bookSlug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, { params }: { params: { refCode: string, bookSlug: string } }) {
  const { refCode, bookSlug } = params;
  const url = new URL(req.url);
  const referer = req.headers.get('referer') || undefined;
  const ua = req.headers.get('user-agent') || '';
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0';
  const ip_hash = crypto.createHmac('sha256', process.env.IP_SALT || 'salt').update(ip + ua).digest('hex');

  // get book id
  const { data: book } = await supabase.from('books').select('id, slug').eq('slug', bookSlug).single();

  // store click (best-effort; do not block redirect on error)
  await supabase.from('referral_clicks').insert({
    ref_code: refCode,
    book_id: book?.id ?? null,
    ip_hash,
    user_agent: ua,
    referer,
    utm: Object.fromEntries(url.searchParams)
  });

  const res = NextResponse.redirect(new URL(`/book/${bookSlug}`, process.env.BASE_URL));
  res.cookies.set('ref_code', refCode, { httpOnly: false, maxAge: 60*60*24*30, path: '/' });
  if (book?.id) res.cookies.set('ref_book', String(book.id), { httpOnly: false, maxAge: 60*60*24*30, path: '/' });
  return res;
}
```

> **Note**: We use the **service role** on the server route to write clicks without the user being logged in. Keep the key **server-only**.

---

## 3) Checkout Attribution (Stripe example)

When an order is completed, add the `ref_code` from cookies to the order metadata and process in a webhook.

**On client at checkout start:**
```ts
// read cookie value and include in checkout session creation
import Cookies from 'js-cookie';

const refCode = Cookies.get('ref_code');

await fetch('/api/checkout/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items, bookId, refCode })
});
```

**Stripe webhook handler (server)**
```ts
// app/api/stripe/webhook/route.ts (Node runtime)
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new NextResponse('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const refCode = (session.metadata?.ref_code || null) as string | null;
    const bookId = (session.metadata?.book_id || null) as string | null;

    // Buyer (if logged in and passed as metadata)
    const referredUserId = session.metadata?.user_id || null;

    if (refCode) {
      // Find the referrer
      const { data: refProfile } = await supabase.from('profiles').select('id').eq('referral_code', refCode).single();

      if (refProfile?.id) {
        await supabase.from('referral_attributions').insert({
          referrer_user_id: refProfile.id,
          ref_code: refCode,
          referred_user_id: referredUserId,
          order_id: session.id,
          book_id: bookId,
          amount_cents: Math.round((session.amount_total || 0))
        });

        // Reward logic example: 10% of order as store credit
        const credit = Math.floor(((session.amount_total || 0) * 0.10));
        if (credit > 0) {
          await supabase.from('rewards').insert({
            user_id: refProfile.id,
            reason: `Referral order ${session.id}`,
            kind: 'credit_cents',
            value: credit
          });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
```

> **Anti‑abuse**: ignore self‑referrals (if `referred_user_id === referrer_user_id`), de‑dupe by one attribution per order id.

---

## 4) Share Card (QR + Copy + Social Intents)

**BookShareCard.tsx**
```tsx
'use client';
import { useMemo } from 'react';
import QRCode from 'qrcode';
import { Copy, Facebook, Twitter, Share2, Link as LinkIcon, Download } from 'lucide-react';

export default function BookShareCard({ refCode, book }: { refCode: string; book: { slug: string; title: string; bg_image_url?: string } }) {
  const shareUrl = useMemo(() => `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/r/${refCode}/${book.slug}`, [refCode, book.slug]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(`${book.title} → ${shareUrl}`);
    alert('Copied!');
  };

  const onDownloadQR = async () => {
    const dataUrl = await QRCode.toDataURL(shareUrl, { margin: 1, scale: 8 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${book.slug}-${refCode}-qr.png`;
    a.click();
  };

  const enc = encodeURIComponent;
  const tweet = `https://twitter.com/intent/tweet?text=${enc(`Reading ${book.title} — check it out!`)}&url=${enc(shareUrl)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`;
  const whatsapp = `https://wa.me/?text=${enc(`Reading ${book.title} — ${shareUrl}`)}`;

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border bg-white dark:bg-zinc-900">
      <div className="relative h-48 w-full overflow-hidden">
        {book.bg_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.bg_image_url} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-xl font-semibold">{book.title}</h3>
          <p className="text-sm opacity-80 break-all">{shareUrl}</p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        <button onClick={onCopy} className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2">
          <Copy className="w-4 h-4"/> Copy link
        </button>
        <button onClick={onDownloadQR} className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2">
          <Download className="w-4 h-4"/> QR PNG
        </button>
        <a href={tweet} target="_blank" className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2">
          <Share2 className="w-4 h-4"/> X/Twitter
        </a>
        <a href={facebook} target="_blank" className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2">
          <Facebook className="w-4 h-4"/> Facebook
        </a>
        <a href={whatsapp} target="_blank" className="col-span-2 flex items-center justify-center gap-2 rounded-xl border px-3 py-2">
          <LinkIcon className="w-4 h-4"/> WhatsApp
        </a>
      </div>
    </div>
  );
}
```

> Instagram: no direct share intent. Provide the **QR PNG** + **OG/story image** to post manually.

---

## 5) Dynamic Story/OG Image (per book, with ref)

A server route that returns a **1200×630** PNG (or **1080×1920** for story) with the book’s background and embedded QR + title.

**/app/api/share-image/route.ts (Node runtime)**
```ts
// app/api/share-image/route.ts
import { NextRequest } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import QR from 'qrcode';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'My Book';
  const bg = searchParams.get('bg');
  const url = searchParams.get('url') || 'https://example.com';
  const mode = searchParams.get('mode') || 'og'; // og | story

  const width = mode === 'story' ? 1080 : 1200;
  const height = mode === 'story' ? 1920 : 630;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // background
  if (bg) {
    try {
      const img = await loadImage(bg);
      ctx.drawImage(img, 0, 0, width, height);
    } catch {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);
  }

  // overlay gradient
  const grad = ctx.createLinearGradient(0, height, 0, height * 0.5);
  grad.addColorStop(0, 'rgba(0,0,0,0.75)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // title
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.floor(width * 0.05)}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  const pad = Math.floor(width * 0.06);
  const titleMaxWidth = width - pad * 2 - 260;
  wrapText(ctx, title, pad, height - pad - 220, titleMaxWidth, Math.floor(width * 0.06));

  // URL text
  ctx.font = `normal ${Math.floor(width * 0.028)}px sans-serif`;
  ctx.fillText(url, pad, height - pad - 60);

  // QR code block
  const qrPng = await QR.toDataURL(url, { margin: 1, scale: 12 });
  const qrImg = await loadImage(qrPng);
  const size = 220;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(width - pad - size - 24, height - pad - size - 24, size + 24, size + 24);
  ctx.drawImage(qrImg, width - pad - size - 12, height - pad - size - 12, size, size);

  return new Response(canvas.toBuffer('image/png'), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' }
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
```

**Usage** (client):
```tsx
const imgUrl = `/api/share-image?title=${encodeURIComponent(book.title)}&bg=${encodeURIComponent(book.bg_image_url)}&url=${encodeURIComponent(shareUrl)}&mode=story`;
// Render <img src={imgUrl} /> or offer a download button
```

---

## 6) User Referral Dashboard (progress → rewards)

**/app/dashboard/referrals/page.tsx**
```tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import BookShareCard from '@/components/BookShareCard';

export default async function ReferralsPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return <div>Please sign in.</div>;

  const { data: profile } = await supabase.from('profiles').select('referral_code').eq('id', user.id).single();
  const { data: books } = await supabase.from('books').select('id, slug, title, bg_image_url').order('created_at');

  const { data: stats } = await supabase.rpc('my_referral_stats'); // optional RPC, see below

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Refer & Earn</h1>
      <p>Your code: <span className="font-mono bg-zinc-100 px-2 py-1 rounded">{profile?.referral_code}</span></p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((b) => (
          <BookShareCard key={b.id} refCode={profile!.referral_code!} book={b} />
        ))}
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Clicks" value={stats.clicks} />
          <Stat label="Orders" value={stats.orders} />
          <Stat label="Earnings (credits)" value={`€${(stats.credits_cents/100).toFixed(2)}`} />
          <Stat label="Conversion" value={`${(stats.conversion*100).toFixed(1)}%`} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="text-sm opacity-60">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
```

**Optional RPC** for stats (owner‑scoped):
```sql
create or replace function public.my_referral_stats()
returns json language plpgsql security definer as $$
declare
  uid uuid := auth.uid();
  clicks int := 0;
  orders int := 0;
  credits int := 0;
  conv numeric := 0;
  refcode text;
begin
  select referral_code into refcode from public.profiles where id = uid;
  if refcode is null then return '{"clicks":0,"orders":0,"credits_cents":0,"conversion":0}'::json; end if;

  select count(*) into clicks from public.referral_clicks where ref_code = refcode;
  select count(*) into orders from public.referral_attributions where referrer_user_id = uid;
  select coalesce(sum(value),0) into credits from public.rewards where user_id = uid and kind='credit_cents';
  if clicks > 0 then conv := orders::numeric / clicks; end if;

  return json_build_object(
    'clicks', clicks,
    'orders', orders,
    'credits_cents', credits,
    'conversion', conv
  );
end; $$;

revoke all on function public.my_referral_stats from public;
grant execute on function public.my_referral_stats to authenticated;
```

---

## 7) Preventing Self‑Referral & Simple Fraud Controls

- In webhook, **ignore** if `referred_user_id === referrer_user_id`.
- De‑dupe attributions by unique `order_id`.
- Optional: drop clicks from same `ip_hash` within N minutes.
- Optionally require referred buyer to be **new** (first order).

---

## 8) Reward Redemption

- If using store credit: maintain a `wallet_balance_cents` in `profiles` or compute from `rewards` ledger.
- Apply credit at checkout by subtracting from amount and storing `credit_applied_cents` on order.
- For discount tiers: create a scheduled job (Supabase cron) that scans `referral_attributions` and issues `rewards(kind='discount_pct')` when thresholds are reached.

**Example thresholds**
```
5 orders → 10% off coupon (one-time)
10 orders → +€20 credit
```

---

## 9) Putting It Together (happy path)

1. User signs up → profile row auto‑creates with `referral_code`.
2. They open **Referral Dashboard** → see all books and a share card for each.
3. Share card provides: link, QR PNG, social intents, and downloadable **story image**.
4. Friend scans QR or visits link → `/r/[code]/[book]` logs click, sets cookie, redirects to book page.
5. Friend buys → checkout metadata includes `ref_code` → webhook creates attribution + reward.
6. Referrer sees stats and growing rewards.

---

## 10) Quick Checklist

- [ ] Run SQL schema & policies in Supabase.
- [ ] Add server route `/r/[refCode]/[bookSlug]`.
- [ ] Wire checkout to pass `ref_code` & `book_id` to Stripe.
- [ ] Implement webhook to insert attributions + rewards.
- [ ] Build `BookShareCard` (QR + social + image download).
- [ ] Add `/api/share-image` (OG/story with background & QR).
- [ ] Create dashboard page + optional RPC for stats.
- [ ] Add anti‑abuse checks.

---

### Notes
- If you prefer Edge Runtime for the OG image, switch to `@vercel/og` and render an SVG QR (e.g., tiny QR SVG component) instead of `canvas`.
- Keep service role keys strictly on server routes.
- If you already have an orders table, adapt the webhook insert to your schema.

