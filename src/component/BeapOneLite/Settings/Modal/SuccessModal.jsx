"use client";

export default function SuccessModal({
  open,
  onClose,
  title = "Success!",
  message = "Your action was completed successfully.",
  buttonText = "OK",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[500px] p-8 relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* Green success banner */}
        <div className="w-full bg-green-100 rounded-full py-6 mb-6 flex justify-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full border-4 border-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Dynamic title */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          {title}
        </h2>

        {/* Dynamic message */}
        <p className="text-gray-600 text-center mb-8">
          {message}
        </p>

        {/* Dynamic button text */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#1B0954] text-white px-10 py-3 rounded-lg text-md font-semibold"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
