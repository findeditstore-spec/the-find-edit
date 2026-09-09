"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SettingsPage() {

    const [siteName, setSiteName] = useState("");
const [tagline, setTagline] = useState("");
const [contactEmail, setContactEmail] = useState("");
const [settingsId, setSettingsId] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [savedMessage, setSavedMessage] = useState("");
const [homepageHeadline, setHomepageHeadline] = useState("");
const [homepageSubheadline, setHomepageSubheadline] = useState("");
const [homepageCtaText, setHomepageCtaText] = useState("");
const [homepageCtaLink, setHomepageCtaLink] = useState("");
const [homepageSettingsId, setHomepageSettingsId] = useState("");
const [affiliateDisclosureText, setAffiliateDisclosureText] = useState("");
const [affiliateDisclosureEnabled, setAffiliateDisclosureEnabled] =
  useState(true);
const [affiliateSettingsId, setAffiliateSettingsId] = useState("");
const [instagramUrl, setInstagramUrl] = useState("");
const [tiktokUrl, setTiktokUrl] = useState("");
const [facebookUrl, setFacebookUrl] = useState("");
const [twitterUrl, setTwitterUrl] = useState("");
const [socialSettingsId, setSocialSettingsId] = useState("");

useEffect(() => {
  async function loadSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("id, site_name, tagline, contact_email")
      .limit(1)
      .single();

    if (error) {
      console.error("Error loading settings:", error);
      setLoading(false);
      return;
    }

    const { data: socialData, error: socialError } = await supabase
  .from("social_settings")
  .select("id, instagram_url, tiktok_url, facebook_url, twitter_url")
  .limit(1)
  .single();

if (socialError) {
  console.error("Error loading social settings:", socialError);
} else {
  setSocialSettingsId(socialData.id);
  setInstagramUrl(socialData.instagram_url ?? "");
  setTiktokUrl(socialData.tiktok_url ?? "");
  setFacebookUrl(socialData.facebook_url ?? "");
  setTwitterUrl(socialData.twitter_url ?? "");
}

    const { data: homepageData, error: homepageError } = await supabase
  .from("homepage_settings")
  .select("id, headline, subheadline, cta_text, cta_link")
  .limit(1)
  .single();

if (homepageError) {
  console.error("Error loading homepage settings:", homepageError);
} else {
  setHomepageSettingsId(homepageData.id);
  setHomepageHeadline(homepageData.headline);
  setHomepageSubheadline(homepageData.subheadline);
  setHomepageCtaText(homepageData.cta_text);
  setHomepageCtaLink(homepageData.cta_link);
}

    setSettingsId(data.id);
setSiteName(data.site_name);
setTagline(data.tagline);
setContactEmail(data.contact_email);
setLoading(false);
  }

  loadSettings();
}, []);

async function saveSettings() {
  setSaving(true);
  setSavedMessage("");

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: siteName,
      tagline: tagline,
      contact_email: contactEmail,
      updated_at: new Date().toISOString(),
    })
    .eq("id", settingsId);

  if (error) {
    console.error("Error saving settings:", {
  message: error.message,
  details: error.details,
  hint: error.hint,
  code: error.code,
});
    setSavedMessage("Unable to save settings.");
    setSaving(false);
    return;
  }

  setSavedMessage("Settings saved successfully.");
  setSaving(false);
}

async function saveHomepageSettings() {
  setSaving(true);
  setSavedMessage("");

  const { error } = await supabase
    .from("homepage_settings")
    .update({
      headline: homepageHeadline,
      subheadline: homepageSubheadline,
      cta_text: homepageCtaText,
      cta_link: homepageCtaLink,
      updated_at: new Date().toISOString(),
    })
    .eq("id", homepageSettingsId);

  if (error) {
    console.error("Error saving homepage settings:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    setSavedMessage("Unable to save homepage settings.");
    setSaving(false);
    return;
  }

  const { data: affiliateData, error: affiliateError } = await supabase
  .from("affiliate_settings")
  .select("id, disclosure_text, disclosure_enabled")
  .limit(1)
  .single();

if (affiliateError) {
  console.error("Error loading affiliate settings:", affiliateError);
} else {
  setAffiliateSettingsId(affiliateData.id);
  setAffiliateDisclosureText(affiliateData.disclosure_text);
  setAffiliateDisclosureEnabled(affiliateData.disclosure_enabled);
}

  setSavedMessage("Homepage settings saved successfully.");
  setSaving(false);
}

async function saveAffiliateSettings() {
  setSaving(true);
  setSavedMessage("");

  const { error } = await supabase
    .from("affiliate_settings")
    .update({
      disclosure_text: affiliateDisclosureText,
      disclosure_enabled: affiliateDisclosureEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq("id", affiliateSettingsId);

  if (error) {
    console.error("Error saving affiliate settings:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    setSavedMessage("Unable to save affiliate settings.");
    setSaving(false);
    return;
  }

  setSavedMessage("Affiliate settings saved successfully.");
  setSaving(false);
}

async function saveSocialSettings() {
  setSaving(true);
  setSavedMessage("");

  const { error } = await supabase
    .from("social_settings")
    .update({
      instagram_url: instagramUrl,
      tiktok_url: tiktokUrl,
      facebook_url: facebookUrl,
      twitter_url: twitterUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", socialSettingsId);

  if (error) {
    console.error("Error saving social settings:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    setSavedMessage("Unable to save social settings.");
    setSaving(false);
    return;
  }

  setSavedMessage("Social settings saved successfully.");
  setSaving(false);
}

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">
      <header className="border-b border-[#EAE6DF] px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/admin"
            className="text-xl font-semibold tracking-wide"
          >
            The Find Edit
          </a>

          <a
            href="/admin"
            className="text-sm text-[#5B6470] transition hover:text-[#176B6B]"
          >
            ← Back to Admin
          </a>
        </div>
      </header>

      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            Settings
          </p>

          <h1 className="font-serif text-5xl font-medium tracking-tight md:text-7xl">
            Control The Find Edit.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5B6470]">
            Manage the settings that control how The Find Edit works and
            appears across the site.
          </p>

          <div className="mt-16 max-w-3xl">
  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8 md:p-10">
    <div>
      <p className="text-sm text-[#7A827D]">
        Site Identity
      </p>

      <h2 className="mt-2 font-serif text-3xl font-medium">
        Your brand details
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#5B6470]">
        These details help define the identity of The Find Edit across
        the website.
      </p>
    </div>

    <div className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-medium">
          Site name
        </label>

        <input
          type="text"
          value={siteName}
onChange={(event) => setSiteName(event.target.value)}
disabled={loading}
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Tagline
        </label>

        <input
          type="text"
          value={tagline}
onChange={(event) => setTagline(event.target.value)}
disabled={loading}
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Contact email
        </label>

        <input
          type="email"
          value={contactEmail}
onChange={(event) => setContactEmail(event.target.value)}
disabled={loading}
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={saveSettings}
          disabled={saving || loading}
          className="rounded-xl bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {savedMessage && (
          <p className="text-sm text-[#5B6470]">
            {savedMessage}
          </p>
        )}
      </div>

    </div>
  </div>
</div>

<div className="mt-8 max-w-3xl">
  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8 md:p-10">
    <div>
      <p className="text-sm text-[#7A827D]">
        Homepage
      </p>

      <h2 className="mt-2 font-serif text-3xl font-medium">
        Homepage content
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#5B6470]">
        Control the main message and call-to-action shown on the homepage.
      </p>
    </div>

    <div className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-medium">
          Headline
        </label>

        <input
          type="text"
          value={homepageHeadline}
          onChange={(event) =>
            setHomepageHeadline(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Subheadline
        </label>

        <textarea
          value={homepageSubheadline}
          onChange={(event) =>
            setHomepageSubheadline(event.target.value)
          }
          rows={3}
          className="mt-2 w-full resize-none rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          CTA text
        </label>

        <input
          type="text"
          value={homepageCtaText}
          onChange={(event) =>
            setHomepageCtaText(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          CTA link
        </label>

        <input
          type="text"
          value={homepageCtaLink}
          onChange={(event) =>
            setHomepageCtaLink(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />

        <div className="mt-8 flex items-center gap-4">
  <button
    type="button"
    onClick={saveHomepageSettings}
    disabled={saving || loading}
    className="rounded-xl bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>

  {savedMessage && (
    <p className="text-sm text-[#5B6470]">
      {savedMessage}
    </p>
  )}
</div>
      </div>
    </div>
  </div>
</div>

<div className="mt-8 max-w-3xl">
  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8 md:p-10">
    <div>
      <p className="text-sm text-[#7A827D]">
        Affiliate
      </p>

      <h2 className="mt-2 font-serif text-3xl font-medium">
        Affiliate disclosure
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#5B6470]">
        Control the disclosure shown to visitors about affiliate links and commissions.
      </p>
    </div>

    <div className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-medium">
          Disclosure text
        </label>

        <textarea
          value={affiliateDisclosureText}
          onChange={(event) =>
            setAffiliateDisclosureText(event.target.value)
          }
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-4">
        <div>
          <p className="text-sm font-medium">
            Show affiliate disclosure
          </p>

          <p className="mt-1 text-xs text-[#7A827D]">
            Display the affiliate disclosure across the site.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setAffiliateDisclosureEnabled(
              !affiliateDisclosureEnabled
            )
          }
          className={`relative h-6 w-11 rounded-full transition ${
            affiliateDisclosureEnabled
              ? "bg-[#176B6B]"
              : "bg-[#D6D1C8]"
          }`}
          aria-label="Toggle affiliate disclosure"
          aria-pressed={affiliateDisclosureEnabled}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
              affiliateDisclosureEnabled
                ? "left-6"
                : "left-1"
            }`}
          />
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
  <button
    type="button"
    onClick={saveAffiliateSettings}
    disabled={saving || loading}
    className="rounded-xl bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#125858] disabled:cursor-not-allowed disabled:opacity-50"
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>

  {savedMessage && (
    <p className="text-sm text-[#5B6470]">
      {savedMessage}
    </p>
  )}
</div>
    </div>
  </div>
</div>

<div className="mt-8 max-w-3xl">
  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8 md:p-10">
    <div>
      <p className="text-sm text-[#7A827D]">
        Social
      </p>

      <h2 className="mt-2 font-serif text-3xl font-medium">
        Social links
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#5B6470]">
        Manage the social media links shown across The Find Edit.
      </p>
    </div>

    <div className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-medium">
          Instagram
        </label>

        <input
          type="url"
          value={instagramUrl}
          onChange={(event) => setInstagramUrl(event.target.value)}
          placeholder="https://instagram.com/..."
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          TikTok
        </label>

        <input
          type="url"
          value={tiktokUrl}
          onChange={(event) => setTiktokUrl(event.target.value)}
          placeholder="https://tiktok.com/@..."
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Facebook
        </label>

        <input
          type="url"
          value={facebookUrl}
          onChange={(event) => setFacebookUrl(event.target.value)}
          placeholder="https://facebook.com/..."
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          X / Twitter
        </label>

        <input
          type="url"
          value={twitterUrl}
          onChange={(event) => setTwitterUrl(event.target.value)}
          placeholder="https://x.com/..."
          className="mt-2 w-full rounded-xl border border-[#EAE6DF] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#176B6B]"
        />
      </div>
      <div className="mt-8 flex items-center gap-4">
  <button
    type="button"
    onClick={saveSocialSettings}
    disabled={saving || loading}
    className="rounded-xl bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#125858] disabled:cursor-not-allowed disabled:opacity-50"
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>

  {savedMessage && (
    <p className="text-sm text-[#5B6470]">
      {savedMessage}
    </p>
  )}
</div>
    </div>
  </div>
</div>
        </div>
      </section>
    </main>
  );
}