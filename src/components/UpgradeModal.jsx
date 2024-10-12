import React from "react";

const Modal = ({ showModal, setShowModal }) => {
  if (!showModal) return null; // Don't render if the modal is not supposed to be visible.

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 font-inter relative">
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Upgrade to Unlimited
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 text-center mb-6">
          Create without limits by upgrading to an unlimited plan.
        </p>

        {/* Features */}
        <ul className="text-gray-700 text-sm space-y-3 mb-6">
          <li className="flex items-center">
            <svg
              className="w-5 h-5 text-red mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-6.707a1 1 0 011.414 0L12 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Unlimited AI generation
          </li>
          <li className="flex items-center">
            <svg
              className="w-5 h-5 text-red mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-6.707a1 1 0 011.414 0L12 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            AskJenni AI assistant
          </li>
          <li className="flex items-center">
            <svg
              className="w-5 h-5 text-red mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-6.707a1 1 0 011.414 0L12 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Unlimited citations
          </li>
        </ul>

        {/* Pricing Options */}
        <div className="space-y-3 mb-6">
          {/* Monthly Plan */}
          <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2">
            <div className="flex items-center">
              <input
                type="radio"
                name="plan"
                className="form-radio text-red-500 focus:ring-red-500"
              />
              <label className="ml-3 text-gray-800 font-semibold">
                Monthly
              </label>
            </div>
            <div className="text-gray-900 font-bold">$9.00/mo</div>
          </div>
        </div>

        {/* Upgrade Button */}
        <div className="flex justify-center">
          <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
