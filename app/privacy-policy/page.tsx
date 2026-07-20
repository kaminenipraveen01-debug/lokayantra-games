"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full min-h-screen text-white font-sans pb-12 relative overflow-hidden bg-[#0a0a0d]">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20px] left-[-20px] w-[200px] h-[200px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[250px] h-[250px] rounded-full bg-white/10" />
        <div className="absolute top-[40%] right-[10%] w-[120px] h-[120px] rounded-full bg-white/10" />
      </div>

      <div className="w-full max-w-[850px] mx-auto px-4 mt-[120px] relative z-10">
        <div 
          className="border border-white/10 p-8 sm:p-12 rounded-[32px] shadow-2xl backdrop-blur-xl space-y-6"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">LEGAL COMPLIANCE</span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">PRIVACY POLICY</h1>
            <p className="text-xs font-bold text-white/50 uppercase">Last Updated: July 2026</p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm font-semibold text-white/70 leading-relaxed border-t border-white/5 pt-4">
            <p>
              At LokaYantra, accessible from our main web terminal, one of our main priorities is the privacy of our players. This Privacy Policy document contains the types of information that is collected and recorded by LokaYantra and how we use it. If you have additional questions or require more information about this policy, do not hesitate to contact us through our Contact page.
            </p>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">1. Information We Collect</h2>
            <p>
              We aim to collect as little personal information as possible. Depending on how you use the site, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Technical data such as browser type, device type, screen size, and operating system, used purely to keep the site working smoothly across devices.</li>
              <li>Gameplay data such as which games you open, recently-played history, and play counts — most of this is stored locally in your own browser (localStorage) and is never tied to your real identity.</li>
              <li>Anonymous interaction data such as likes/dislikes on a game, which is not linked to your identity and requires no account or sign-in.</li>
              <li>Information you voluntarily submit, such as your name, email address, or message text when you use our Contact form.</li>
              <li>Cookies and similar technologies used by embedded third-party services (see Section 3 and 4 below).</li>
            </ul>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">2. Log Files & Analytics</h2>
            <p>
              LokaYantra follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of this information is to analyze trends, administer the site, track user movement, and gather demographic information for internal use.
            </p>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">3. Cookies and Web Beacons</h2>
            <p>
              Like any other website, LokaYantra uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information. You are free to decline cookies through your individual browser settings, though doing so may affect certain interactive features of the site.
            </p>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">4. Third-Party Services & Advertising</h2>
            <p>
              LokaYantra hosts and embeds content from a number of third-party providers in order to operate the platform. These include, but are not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Advertising networks (including Google AdSense and other third-party ad partners):</strong> These networks may use cookies or similar technologies to serve ads based on your visit to LokaYantra and other sites on the internet. You may opt out of personalized advertising through your browser settings or the respective ad network&apos;s opt-out tools.</li>
              <li><strong>GamePix:</strong> The majority of games on LokaYantra are sourced from and played via GamePix, an external HTML5 game distribution platform. Loading a game may load content from GamePix&apos;s servers, governed by their own privacy practices.</li>
              <li><strong>Cloudinary:</strong> Thumbnails and images for select games are delivered via Cloudinary&apos;s content delivery network.</li>
              <li><strong>Firebase (Google):</strong> We use Firebase for authentication (admin access only) and storing game metadata such as titles, categories, play counts, and anonymous likes/dislikes.</li>
            </ul>
            <p>
              LokaYantra&apos;s Privacy Policy does not apply to these other advertisers or websites. We advise you to consult the respective Privacy Policies of these third-party servers for more detailed information, including their practices and instructions about how to opt out of certain options.
            </p>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">5. How We Use Your Information</h2>
            <p>
              Any information we collect is used solely to operate, maintain, and improve LokaYantra — including displaying relevant games, responding to contact requests, preventing abuse, and understanding which categories of games are most popular so we can curate the platform better. We do not sell personal information to third parties.
            </p>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">6. Children&apos;s Privacy</h2>
            <p>
              LokaYantra does not knowingly collect any personal identifiable information from children under the age of 13. If you believe your child has provided this kind of information through our Contact form, please contact us immediately so we can take appropriate action, including removal of such information from our records.
            </p>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">7. Data Storage & Security</h2>
            <p>
              We take reasonable technical measures to protect the limited data we do collect. Gameplay preferences like &ldquo;Continue Playing&rdquo; history are stored locally on your own device and are never transmitted to our servers. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">8. Your Choices</h2>
            <p>
              You can clear your locally-stored gameplay history at any time by clearing your browser&apos;s site data. You may also disable cookies in your browser settings and choose not to submit information through our Contact form.
            </p>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">9. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date above. You are advised to review this page periodically for any changes.
            </p>

            <h2 className="text-sm font-black uppercase text-white tracking-wide pt-2">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, you may reach out through our Contact Station page and we will respond as soon as possible.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs font-black uppercase">
            <Link href="/" className="text-white/40 hover:text-white">← Home</Link>
            <Link href="/terms" className="text-white/60 hover:text-white">Terms of Service →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}