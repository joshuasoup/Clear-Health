"use client";
import React from "react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useEffect } from "react";

const page = () => {
  useEffect(() => {
    document.title = "Privacy Policy";
  }, []);
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        {/* Introduction */}
        <p>Your privacy is critically important to us.</p>

        <p>
          It is <strong>[Your Company Name]</strong>'s policy to respect your
          privacy regarding any information we may collect while operating our
          website. This Privacy Policy applies to{" "}
          <a
            href="[Your Website URL]"
            className="text-blue-600 hover:underline"
          >
            [Your Website URL]
          </a>{" "}
          (hereinafter, "us", "we", or "our website"). We respect your privacy
          and are committed to protecting personally identifiable information
          you may provide us through the website. This Privacy Policy, together
          with our{" "}
          <a href="/terms-of-service" className="text-blue-600 hover:underline">
            Terms and Conditions
          </a>{" "}
          posted on our website, set forth the general rules and policies
          governing your use of our website.
        </p>

        {/* Website Visitors */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Website Visitors</h2>
        <p>
          Like most website operators, we collect non-personally-identifying
          information typically made available by web browsers and servers, such
          as the browser type, language preference, referring site, and the date
          and time of each visitor request. Our purpose in collecting
          non-personally-identifying information is to better understand how our
          visitors use the website. From time to time, we may release
          non-personally-identifying information in the aggregate, e.g., by
          publishing a report on website usage trends.
        </p>
        <p>
          We also collect potentially personally-identifying information like
          Internet Protocol (IP) addresses for logged-in users and for users
          leaving comments on our blog posts. We only disclose logged-in user
          and commenter IP addresses under the same circumstances that we use
          and disclose personally-identifying information as described below.
        </p>

        {/* Information We Collect */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Information We Collect
        </h2>
        <p>We collect information from you when you:</p>
        <ul className="list-disc pl-6">
          <li>Register on our site</li>
          <li>Place an order</li>
          <li>Subscribe to our newsletter</li>
          <li>Respond to a survey</li>
          <li>Fill out a form</li>
        </ul>
        <p>
          When ordering or registering on our site, as appropriate, you may be
          asked to enter:
        </p>
        <ul className="list-disc pl-6">
          <li>Your name</li>
          <li>Email address</li>
          <li>Mailing address</li>
          <li>Phone number</li>
          <li>Credit card information</li>
        </ul>
        <p>You may, however, visit our site anonymously.</p>

        {/* Credit Card Information */}
        <h3 className="text-xl font-semibold mt-8 mb-4">
          Credit Card Information
        </h3>
        <p>
          We use Canada’s leading payment processor—<strong>Moneris</strong>—to
          process your credit card payments. Moneris stores all credit card
          information and conducts the entire credit card transaction using
          industry-standard 128-bit SSL encryption. We only store a record that
          the transaction took place.
        </p>

        {/* How We Use Your Information */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p>
          The information we collect from you may be used in the following ways:
        </p>
        <ul className="list-disc pl-6">
          <li>To personalize your experience</li>
          <li>To improve our website</li>
          <li>To enhance customer service</li>
          <li>To process transactions</li>
          <li>To administer contests or promotions</li>
          <li>To send periodic emails</li>
        </ul>

        {/* Email Usage */}
        <h3 className="text-xl font-semibold mt-8 mb-4">Email Usage</h3>
        <ul className="list-disc pl-6">
          <li>
            Your email address will not be sold, rented, or leased to third
            parties.
          </li>
          <li>
            If you make a purchase, we will send you a confirmation email.
          </li>
          <li>
            If you sign up for our mailing list, we will send you informational
            emails about service offers. You can unsubscribe at any time by
            clicking the 'unsubscribe' link in our emails.
          </li>
        </ul>

        {/* Protection of Information */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Protection of Certain Personally-Identifying Information
        </h2>
        <p>
          We disclose potentially personally-identifying and
          personally-identifying information only to those of our employees,
          contractors, and affiliated organizations that:
        </p>
        <ol className="list-decimal pl-6">
          <li>
            Need to know that information in order to process it on our behalf
            or to provide services available at our website.
          </li>
          <li>Have agreed not to disclose it to others.</li>
        </ol>
        <p>
          Some of these individuals may be located outside of your home country;
          by using our website, you consent to the transfer of such information
          to them.
        </p>
        <p>
          We will not rent or sell potentially personally-identifying and
          personally-identifying information to anyone. Other than to our
          employees, contractors, and affiliated organizations as described
          above, we disclose such information only in response to a subpoena,
          court order, or other governmental request, or when we believe in good
          faith that disclosure is reasonably necessary to protect our property
          or rights, third parties, or the public at large.
        </p>

        {/* Security */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
        <p>
          The security of your personal information is important to us. We
          implement a variety of security measures to maintain the safety of
          your personal information when you place an order or access your
          personal information.
        </p>
        <ul className="list-disc pl-6">
          <li>We offer the use of a secure server.</li>
          <li>
            All supplied sensitive/credit information is transmitted via Secure
            Socket Layer (SSL) technology.
          </li>
          <li>
            After a transaction, your private information (credit card details)
            will not be stored on our servers.
          </li>
        </ul>
        <p>
          However, no method of transmission over the Internet or electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your personal information, we cannot guarantee its
          absolute security.
        </p>

        {/* Use of Cookies */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Cookies</h2>
        <p>
          Our website uses "cookies" to enhance your experience. A cookie is a
          small piece of data stored on your computer by your web browser.
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-4">Purpose of Cookies</h3>
        <ul className="list-disc pl-6">
          <li>To help us remember and process items in your shopping cart.</li>
          <li>To understand and save your preferences for future visits.</li>
          <li>
            To compile aggregate data about site traffic and interaction to
            improve our website in the future.
          </li>
        </ul>
        <h3 className="text-xl font-semibold mt-8 mb-4">
          Third-Party Services
        </h3>
        <p>
          We may contract with third-party service providers to assist us in
          better understanding our site visitors. These service providers are
          not permitted to use the information collected on our behalf except to
          help us conduct and improve our business.
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-4">Cookie Management</h3>
        <p>
          You can choose to have your computer warn you each time a cookie is
          being sent or turn off all cookies via your browser settings. If you
          disable cookies, some features of our site may not function properly.
          However, you can still place orders by contacting customer service.
        </p>

        {/* Do We Disclose Information to Outside Parties? */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Do We Disclose Information to Outside Parties?
        </h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally
          identifiable information to outside parties. This does not include
          trusted third parties who assist us in operating our website,
          conducting our business, or servicing you, provided they agree to keep
          this information confidential.
        </p>
        <p>
          We may also release your information when we believe it is appropriate
          to:
        </p>
        <ul className="list-disc pl-6">
          <li>Comply with the law</li>
          <li>Enforce our site policies</li>
          <li>Protect ours or others' rights, property, or safety</li>
        </ul>
        <p>
          Non-personally identifiable visitor information may be provided to
          other parties for marketing, advertising, or other uses.
        </p>

        {/* Third-Party Links */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Links</h2>
        <p>
          Occasionally, we may include or offer third-party products or services
          on our website. These third-party sites have separate and independent
          privacy policies. We have no responsibility or liability for the
          content and activities of these linked sites. Nonetheless, we strive
          to protect the integrity of our site and welcome any feedback about
          these sites.
        </p>

        {/* Your Consent */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Consent</h2>
        <p>By using our site, you consent to our Privacy Policy.</p>

        {/* Changes to Our Privacy Policy */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Changes to Our Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. If we decide to
          change our Privacy Policy, we will post those changes on this page. We
          encourage visitors to frequently check this page for any changes.
        </p>

        {/* Contacting Us */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contacting Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:your-email@example.com"
            className="text-blue-600 hover:underline"
          >
            your-email@example.com
          </a>
          <br />
          <strong>Address:</strong> [Your Company Address]
          <br />
          <strong>Phone:</strong>{" "}
          <a
            href="tel:your-contact-number"
            className="text-blue-600 hover:underline"
          >
            [Your Contact Number]
          </a>
        </p>

        {/* Effective Date */}
        <p className="text-sm text-gray-500 mt-8">Effective Date: [Date]</p>
      </div>
      <Footer />
    </>
  );
};
export default page;
