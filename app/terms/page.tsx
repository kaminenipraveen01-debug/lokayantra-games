"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden bg-[#cfcfcf]">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[40%] left-[-40px] w-[150px] h-[150px] rounded-full bg-black" />
        <div className="absolute top-[10%] right-[30%] w-[100px] h-[100px] rounded-full bg-black" />
        <div className="absolute bottom-[-40px] left-[20%] w-[180px] h-[180px] rounded-full bg-black" />
      </div>

      <div className="w-full max-w-[850px] mx-auto px-4 mt-[120px] relative z-10">
        <div 
          className="border border-black/10 p-8 sm:p-12 rounded-[32px] shadow-2xl backdrop-blur-xl space-y-6"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.55)" }}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">USER AGREEMENT</span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">TERMS & CONDITIONS</h1>
            <p className="text-xs font-bold text-black/50 uppercase">Last Updated: June 2026</p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm font-semibold text-black/70 leading-relaxed border-t border-black/5 pt-4">
            <p>
              Welcome to LokaYantra. These terms and conditions outline the rules and regulations for the use of LokaYantra&apos;s Arcade Platform. By accessing this website we assume you accept these terms and conditions in full. Do not continue to use LokaYantra if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">1. Eligibility & Acceptance</h2>
            <p>
              By using LokaYantra, you confirm that you are either at least 13 years of age, or are accessing the site with the consent and supervision of a parent or guardian. If you do not agree with any part of these terms, please discontinue use of the platform immediately.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">2. Intellectual Property Rights</h2>
            <p>
              Other than the content you own, under these Terms, LokaYantra and/or its licensors own all the intellectual property rights and materials contained in this Website, including the LokaYantra name, panda logo, bubble-grid design system, and all original games developed in-house. All third-party game titles, thumbnails, and codebases remain copyrighted to their respective original developers, and are featured on LokaYantra under fair use, license, or with permission.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">3. Use of Games & Third-Party Content (DMCA)</h2>
            <p>
              LokaYantra acts as a curated hosting and discovery platform for free HTML5 browser games. Some games are built in-house, while others are sourced from or embedded via third-party developers and hosting providers. We do our best to ensure all featured games are safe and functional, but we do not guarantee uninterrupted availability, and we are not responsible for bugs, content, or behavior originating from third-party game code.
            </p>
            <p className="bg-black/5 p-3 rounded-xl border border-black/5 text-xs italic">
              <strong>Copyright Notice:</strong> If you are a game developer or copyright owner and believe your content has been shared here without authorization, please contact us immediately through our Contact Station, and we will take it down within 24-48 hours.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">4. Acceptable Use & Restrictions</h2>
            <p className="uppercase text-[11px] text-black/50 font-black tracking-wider">You are specifically restricted from all of the following:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Publishing any website material or games in any other media without prior written credit or permission.</li>
              <li>Selling, sublicensing, and/or otherwise commercializing any website material without authorization.</li>
              <li>Using this Website in any way that is or may be damaging to this Website, including attempting to disrupt servers, scrape content at scale, or reverse-engineer the platform.</li>
              <li>Using this Website contrary to applicable laws and regulations, or in a way that causes harm to the Website, or to any person or business entity.</li>
              <li>Engaging in any data mining, data harvesting, data extraction, or any other similar activity in relation to this Website.</li>
              <li>Posting abusive, hateful, sexually explicit, or otherwise objectionable content in the comments section.</li>
            </ul>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">5. User-Generated Content</h2>
            <p>
              Certain parts of this Website allow users to post comments and reactions via our embedded Disqus integration. By submitting such content, you grant LokaYantra a non-exclusive, royalty-free license to display it on the platform. We reserve the right to monitor, edit, or remove any user-submitted content that we consider, at our sole discretion, to be inappropriate, offensive, or in violation of these Terms.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">6. Advertising</h2>
            <p>
              LokaYantra is, and intends to remain, free to play. To support this, the platform may display third-party advertisements. We do not control the specific content of every ad shown by our advertising partners, though we make reasonable efforts to ensure ads are appropriate for a general audience.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">7. Disclaimer of Warranties</h2>
            <p>
              This Website and the games on it are provided &ldquo;as is&rdquo;, without warranty of any kind, express or implied. LokaYantra does not warrant that the Website will be constantly available, uninterrupted, error-free, or free from viruses or other harmful components, although we take reasonable steps to keep it that way.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">8. Limitation of Liability</h2>
            <p>
              In no event shall LokaYantra, its developer, or affiliates be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Website or any games hosted or embedded on it.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">9. Termination</h2>
            <p>
              We reserve the right to restrict or terminate your access to LokaYantra, without notice, for any conduct that we believe violates these Terms or is otherwise harmful to other users, third parties, or the platform itself.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">10. Changes to These Terms</h2>
            <p>
              We may revise these Terms of Use at any time by updating this page. By continuing to use LokaYantra after changes are posted, you agree to be bound by the revised Terms.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">11. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between LokaYantra and you in relation to your use of this Website, and supersede all prior agreements and understandings, whether written or oral, relating to such use.
            </p>

            <h2 className="text-sm font-black uppercase text-black tracking-wide pt-2">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms & Conditions, please reach out through our Contact Station page.
            </p>
          </div>

          <div className="pt-4 border-t border-black/5 flex justify-between items-center text-xs font-black uppercase">
            <Link href="/privacy-policy" className="text-black/60 hover:text-black">← Privacy Policy</Link>
            <Link href="/" className="text-black/40 hover:text-black">Home Terminal →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}