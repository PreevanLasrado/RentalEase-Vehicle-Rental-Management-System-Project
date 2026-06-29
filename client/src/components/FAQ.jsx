import { useState } from "react";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Can I cancel my plan anytime?",
      answer:
        "Yes, you can cancel your subscription anytime with no hidden charges.",
    },
    {
      question: "What happens when my plan expires?",
      answer:
        "Your account will automatically switch back to the Basic plan.",
    },
    {
      question: "Do I get a refund if I cancel early?",
      answer:
        "Refunds depend on usage. Please contact support for assistance.",
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer:
        "Upgrades are instant. Downgrades apply after the billing cycle.",
    },
    {
      question: "Is payment secure?",
      answer:
        "Yes, we use secure and trusted payment gateways.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-14 px-4">

      {/* TITLE */}
      <h2 className="text-5xl font-black text-center mb-6 text-orange-500">
        Frequently Asked Questions
      </h2>

      <div className="space-y-5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`bg-white rounded-2xl border border-orange-100 overflow-hidden transition duration-300 ${
                isOpen
                  ? "shadow-[0_0_20px_rgba(255,115,0,0.25)]"
                  : "shadow-md"
              }`}
            >
              {/* QUESTION */}
              <button
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className="w-full flex justify-between items-center p-5 text-left hover:bg-orange-50 transition"
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-3">
                  <FaQuestionCircle className="text-orange-500 text-lg" />

                  <span className="text-[18px] font-semibold text-gray-800">
                    {faq.question}
                  </span>
                </div>

                {/* ARROW */}
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    isOpen
                      ? "rotate-180 text-orange-500"
                      : "text-gray-400"
                  }`}
                />
              </button>

              {/* ANSWER */}
              <div
                className={`px-5 overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-40 pb-5" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 text-[16px]">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}