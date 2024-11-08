"use client";
import React from "react";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useEffect } from "react";
import "../../styles/privacy.css";

const page = () => {
  useEffect(() => {
    document.title = "Privacy Policy";
  }, []);
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-10 text-left">
        {/* Heading */}
        <h1 className="font-bold mb-8 text-7xl">Privacy Policy</h1>

        {/* Introduction */}
        <p>Your privacy is critically important to us.</p>

        <p>
          It is <strong>Clear Health</strong>'s policy to respect your privacy
          regarding any information we may collect while operating our website.
          This Privacy Policy applies to{" "}
          <a
            href="https://clearhealth.care/"
            className="text-blue-600 hover:underline"
          >
            Clear Health
          </a>{" "}
          (hereinafter, "us", "we", or "our website"). We respect your privacy
          and are committed to protecting personally identifiable information
          you may provide us through the website. This Privacy Policy, together
          with our{" "}
          <a href="/terms-of-use" className="text-blue-600 hover:underline">
            Terms and Conditions
          </a>{" "}
          posted on our website, set forth the general rules and policies
          governing your use of our website.
        </p>

        {/* Website Visitors */}
        <h2 className="text-4xl font-semibold mt-8 mb-4">Website Visitors</h2>
        <p>
          Like most website operators, we collect non-personally-identifying
          information typically made available by web browsers and servers, such
          as the browser type, language preference, referring site, and the date
          and time of each visitor request. Our purpose in collecting
          non-personally-identifying information is to better understand how our
          visitors use the website.
        </p>

        {/* Information We Collect */}
        <h2 className="text-4xl font-semibold mt-8 mb-4">
          Information We Collect
        </h2>
        <p>
          We collect information from you when you register on our site, or
          making a payment. When registering on our site, as appropriate, you
          may be asked to enter:
        </p>
        <ul className="list-disc pl-6 ml-4">
          <li>Your name</li>
          <li>Email address</li>
          <li>Mailing address</li>
          <li>Phone number</li>
          <li>Credit card information</li>
        </ul>
        <p>You may, however, visit our site anonymously.</p>

        {/* How We Use Your Information */}
        <h2 className="text-4xl font-semibold mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p>
          The information we collect from you may be used in the following ways:
        </p>
        <ul className="list-disc pl-6 ml-4 ">
          <li>To personalize your experience</li>
          <li>To improve our website</li>
          <li>To enhance customer service</li>
          <li>To process transactions</li>
          <li>To administer contests or promotions</li>
          <li>To send periodic emails</li>
        </ul>

        {/* Email Usage */}
        <h3 className="text-4xl font-semibold mt-8 mb-4">Email Usage</h3>
        <ul className="list-disc pl-6 ml-4">
          <li>
            Your email address will not be sold, rented, or leased to third
            parties.
          </li>
          <li>
            If you make a purchase, we will send you a confirmation email.
          </li>
        </ul>

        {/* Protection of Information */}
        <h2 className="text-4xl font-semibold mt-8 mb-4">
          Protection of Certain Personally-Identifying Information
        </h2>
        <p>
          We disclose potentially personally-identifying and
          personally-identifying information only to those of our employees,
          contractors, and affiliated organizations that:
        </p>
        <ol className="list-decimal pl-6 ml-4">
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
        <h2 className="text-4xl font-semibold mt-8 mb-4">Security</h2>
        <p>
          The security of your personal information is important to us. We
          implement a variety of security measures to maintain the safety of
          your personal information when you place an order or access your
          personal information.
        </p>
        <ul className="list-disc pl-6 ml-4">
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
        <h2 className="text-4xl font-semibold mt-8 mb-4">Use of Cookies</h2>
        <p>
          Our website uses "cookies" to enhance your experience. A cookie is a
          small piece of data stored on your computer by your web browser.
        </p>
        <h3 className="text-4xl font-semibold mt-8 mb-4">Purpose of Cookies</h3>
        <ul className="list-disc pl-6 ml-4">
          <li>To help us remember and process items in your shopping cart.</li>
          <li>
            To compile aggregate data about site traffic and interaction to
            improve our website in the future.
          </li>
        </ul>
        <h3 className="text-4xl font-semibold mt-8 mb-4">
          Third-Party Services
        </h3>
        <p>
          We may contract with third-party service providers to assist us in
          better understanding our site visitors. These service providers are
          not permitted to use the information collected on our behalf except to
          help us conduct and improve our business.
        </p>
        <h3 className="text-4xl font-semibold mt-8 mb-4">Cookie Management</h3>
        <p>
          You can choose to have your computer warn you each time a cookie is
          being sent or turn off all cookies via your browser settings. If you
          disable cookies, some features of our site may not function properly.
          However, you can still place orders by contacting customer service.
        </p>

        {/* Changes to Our Privacy Policy */}
        <h2 className="text-4xl font-semibold mt-8 mb-4">
          Changes to Our Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. If we decide to
          change our Privacy Policy, we will post those changes on this page. We
          encourage visitors to frequently check this page for any changes.
        </p>

        {/* Contacting Us */}
        <h2 className="text-4xl font-semibold mt-8 mb-4">Contacting Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:joshuasouphanthong55@gmail.com"
            className="text-blue-600 hover:underline"
          >
            joshuasouphanthong55@gmail.com
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a
            href="tel:+1 (437)-775-4514"
            className="text-blue-600 hover:underline"
          >
            +1 (437)-775-4514
          </a>
        </p>

        {/* Effective Date */}
        <p className="text-sm text-gray-500 mt-8">
          Effective Date: November 6, 2024
        </p>
      </div>
      <Footer />
    </>
  );
};
export default page;
