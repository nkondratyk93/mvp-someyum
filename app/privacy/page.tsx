import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SomeYum",
  description: "SomeYum privacy policy. We take your data seriously.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#FAFAFA] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-orange-400 hover:text-orange-300 text-sm mb-8 inline-block">← Back to SomeYum</Link>
        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: January 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>SomeYum is designed with privacy first. We collect minimal data to provide our service:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Swipe preferences (stored locally in your browser only)</li>
              <li>Saved recipe IDs (stored in localStorage on your device)</li>
              <li>Anonymous usage analytics via Google Analytics</li>
              <li>No account, no email, no personal information required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Local Storage</h2>
            <p>Your swipe history and saved recipes are stored exclusively in your browser's localStorage. This data never leaves your device and is not transmitted to our servers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Analytics</h2>
            <p>We use Google Analytics to understand aggregate usage patterns. This includes page views, session duration, and A/B test variant performance. All data is anonymized and used only to improve the product.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies</h2>
            <p>SomeYum uses minimal cookies for analytics purposes only. We do not use tracking cookies or sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Deletion</h2>
            <p>To delete all your data, simply clear your browser's localStorage and cookies for this domain. Since we don't store personal data on our servers, this fully removes your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contact</h2>
            <p>Questions about privacy? Contact us at <a href="mailto:privacy@no-humans.app" className="text-orange-400 hover:underline">privacy@no-humans.app</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
