import { useState } from "react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is mentormate?",
      answer:
        "Mentormate is a South African-developed tool designed to provide specialised instant expertise to built environment professionals. It offers locally relevant advice across various knowledge areas, including geotechnical, water management, concrete construction, environmental management, structural design and more.",
    },
    {
      question: "Who are the experts behind mentormate?",
      answer:
        "Each expert persona (e.g., Oom Piet, Mama Dudu, Bra Vusi) represents a different discipline and is built using accurate Southern African data, legislation, and case studies. They're designed to simulate conversations with seasoned local mentors.",
    },
    {
      question: "How is mentormate different from ChatGPT or other AI tools?",
      answer:
        "Unlike other popular AI models, Mentormate is specifically developed for factual content instead of creative content. The models are specifically designed to support you with engineering queries. We have also split the areas of expertise so the models learn jargon within a specific area and there is less chance of misunderstanding or inaccurate information.",
    },
    {
      question: "Who can use mentormate?",
      answer:
        "Anyone can use Mentormate. Mentormate supports both students and professionals, offering guidance on design, licensing, ethics, and environmental compliance. It also helps individuals in fields like project management, policy, or finance understand engineering concepts for collaboration and growth.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply sign up on the right side and start chatting with one of our expert personas! All users will get a free trial on the Premium service before any subscription commences.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Learn more about us
      </h2>

      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="relative">
            {/* Question + Arrow */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left text-gray-900 font-medium text-lg hover:text-gray-700 focus:outline-none transition-colors"
            >
              <span>{faq.question}</span>
              <span
                className={`transform transition-transform duration-300 ml-6 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* Blue underline when CLOSED */}
            {openIndex !== index && (
              <div className="absolute left-0 right-0 bottom-0 h-px bg-[#1d78a3]" />
            )}

            {/* Answer + blue underline when OPEN */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="mt-4 text-gray-700 pb-6">{faq.answer}</p>
                {/* Blue line under the open answer */}
                <div className="h-px bg-[#1d78a3]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}