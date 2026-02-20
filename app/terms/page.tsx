import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SomeYum",
  description: "SomeYum terms of service.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#FAFAFA] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-orange-400 hover:text-orange-300 text-sm mb-8 inline-block">← Back to SomeYum</Link>
        <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: January 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By using SomeYum, you agree to these Terms of Service. SomeYum is a free, web-based recipe discovery application provided as-is for entertainment and practical use.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Use of Service</h2>
            <p>SomeYum is intended for personal, non-commercial use. You may use the recipe swiper and save recipes to your device. You may not:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Scrape or copy recipe content at scale</li>
              <li>Attempt to reverse-engineer our AI recommendation systems</li>
              <li>Use the service for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Recipe Content</h2>
            <p>Recipes provided on SomeYum are for informational and inspirational purposes only. Always follow proper food safety guidelines. We are not responsible for any dietary reactions or allergies resulting from recipes discovered on this platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Disclaimer of Warranties</h2>
            <p>SomeYum is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or suitability of any recipe for any particular purpose.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, SomeYum and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Changes</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of SomeYum constitutes acceptance of updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Contact</h2>
            <p>Legal questions? Email <a href="mailto:legal@no-humans.app" className="text-orange-400 hover:underline">legal@no-humans.app</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
