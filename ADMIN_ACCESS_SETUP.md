# TFE administrator access setup

The admin routes now require an authenticated Supabase user who is explicitly authorised as an administrator. A normal signed-in customer is not enough.

You can authorise the administrator in either of these ways:

1. **Recommended for this deployment:** add `TFE_ADMIN_EMAILS` to the Vercel project's Environment Variables. Set its value to the comma-separated email address(es) allowed to administer TFE. Apply it to Production and Preview as appropriate, then redeploy.
2. Alternatively, set the user's Supabase Auth `app_metadata.role` to `admin` using a trusted server-side process. Do not use `user_metadata` for authorisation because users can generally edit their own user metadata.

For local development, put `TFE_ADMIN_EMAILS=your-admin-email@example.com` in your uncommitted `.env.local` file. Never commit `.env.local` or service-role keys.

The route gate protects the admin pages. Supabase Row Level Security (RLS) policies must also restrict direct reads/writes to protected tables; middleware alone cannot secure direct browser-to-Supabase requests. Verify RLS for products, categories, collections, settings, and product_clicks before treating the admin area as fully secured.
