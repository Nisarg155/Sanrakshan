// app/privacy-policy/page.tsx
"use client"
import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold mb-6">🛡️ Privacy Policy — Sanrakshan</h1>
            <p className="text-sm text-gray-500 mb-10">Last updated: April 16, 2025</p>

            <section className="mb-8">
                <p className="mb-4">
                    Thank you for using <strong>Sanrakshan</strong>, your privacy policy analyzer powered by AI. We respect your privacy and are committed to protecting your data.
                </p>
                <p>This policy outlines what we collect, why we collect it, and how we handle your information.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">🔐 1. What We Collect</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong>Google OAuth Login:</strong> We use Google OAuth for secure sign-in. Only your basic profile info (email, name) is accessed. No passwords are stored.
                    </li>
                    <li>
                        <strong>Uploaded Privacy Policies:</strong> Temporarily stored in <code>Redis</code> for analysis, and deleted shortly after processing.
                    </li>
                    <li>
                        <strong>Analysis Results:</strong> Stored securely in our database and linked to your account for later access.
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">🚫 2. What We <em>Do Not</em> Collect</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>No tracking data, IP addresses, or device fingerprints.</li>
                    <li>No cookies or analytics are used.</li>
                    <li>No document contents are retained after processing (beyond result storage).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">🛠️ 3. How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>To authenticate users via Google OAuth.</li>
                    <li>To analyze your uploaded privacy policy documents.</li>
                    <li>To store analysis results securely for future reference.</li>
                </ul>
                <p className="mt-2">We do <strong>not</strong> use your data for advertising or resale.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">🔒 4. Data Security</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Temporary data stored in secured Redis with auto-expiry.</li>
                    <li>All communications use HTTPS encryption.</li>
                    <li>Results are stored in access-controlled databases.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">📬 Contact Us</h2>
                <p>If you have any questions, feel free to contact us at <a className="text-blue-600 underline" href="mailto:amlaninisarg@gmail.com">amlaninisarg@gmail.com</a> , <a className="text-blue-600 underline" href="mailto:kavyaatulshahpatan@gmail.com">kavyaatulshahpatan@gmail.com</a> .</p>
            </section>
        </main>
    );
};

export default PrivacyPolicyPage;
