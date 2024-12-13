import React from "react";
import Navbar from "@components/NavBar";
import Footer from "@components/Footer";
import "../../styles/privacy.css";

const page = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-14 py-10 text-left max-w-6xl">
        <h1 className="text-7xl font-bold mb-8">Terms and Conditions</h1>

        <section className="mb-6">
          <h2 className="text-4xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            By using ClearHealth's services, you agree to be bound by these
            Terms and Conditions as well as our Privacy Policy. If you do not
            agree with these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-4xl font-semibold mb-4">
            2. Description of Services
          </h2>
          <p>
            ClearHealth provides an AI-powered platform to help users analyze
            and understand their medical reports. Our platform offers tools like
            chatbots, tooltips with definitions, and explanations to assist in
            interpreting complex medical information. Our services are intended
            for informational purposes only and should not be considered medical
            advice.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-4xl font-semibold mb-4">
            3. User Responsibilities
          </h2>
          <p>
            As a user of ClearHealth, you agree to provide accurate information,
            use the service for lawful purposes, and refrain from any actions
            that may disrupt the platform’s operation or misuse the information
            provided.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-4xl font-semibold mb-4">
            4. Disclaimer of Medical Advice
          </h2>
          <p>
            ClearHealth is not a substitute for professional medical advice,
            diagnosis, or treatment. Always seek the advice of your physician or
            other qualified health provider with any questions you may have
            regarding a medical condition. ClearHealth does not guarantee the
            accuracy or completeness of the information provided by our
            platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-4xl font-semibold mb-4">
            5. Limitation of Liability
          </h2>
          <p>
            ClearHealth shall not be liable for any direct, indirect,
            incidental, special, consequential, or exemplary damages resulting
            from the use of or the inability to use our services. This includes,
            but is not limited to, damages for loss of profits, data, or other
            intangible losses.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-4xl font-semibold mb-4">6. Privacy Policy</h2>
          <p>
            Your use of ClearHealth is also governed by our Privacy Policy. By
            using our services, you consent to the practices described in the
            Privacy Policy regarding the collection, use, and sharing of your
            personal information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-4xl font-semibold mb-4">
            7. Modifications to Terms
          </h2>
          <p>
            ClearHealth reserves the right to modify these Terms and Conditions
            at any time. Any changes will be posted on this page, and your
            continued use of the platform signifies your acceptance of the
            updated terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-4xl font-semibold mb-4">8. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in
            accordance with the laws of the jurisdiction in which ClearHealth
            operates.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-4xl font-semibold mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please
            contact us at
            <a
              href="mailto:joshuasouphanthong55@gmail.com"
              className="text-blue-600 underline"
            >
              {" "}
              joshuasouphanthong55@gmail.com
            </a>
            .
          </p>
        </section>
        <p className="text-sm text-gray-500 mt-8">
          Effective Date: November 6, 2024
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default page;
