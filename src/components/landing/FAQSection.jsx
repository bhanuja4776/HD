import { useState } from "react";

const faqs = [
  {
    question: "How does the investment simulator work?",
    answer:
      "You allocate virtual money across simple instruments and explore outcomes over time. This helps you understand risk and returns before investing real money."
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Yes. We use secure cloud infrastructure, authenticated access, and strict data controls so your personal information stays protected."
  },
  {
    question: "Do I need prior investing experience?",
    answer:
      "No. Aarvika is built specifically for beginners and explains every concept step by step."
  },
  {
    question: "Can I start with just small monthly amounts?",
    answer:
      "Absolutely. Aarvika helps you begin with practical, small-step plans so you can build confidence and consistency over time."
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
  };

  return (
    <section className="surface-panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -top-16 -right-24 h-44 w-44 rounded-full bg-primary-pink/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-20 h-44 w-44 rounded-full bg-primary-purple/15 blur-3xl" />

      <div className="relative space-y-5">
        <div className="space-y-2">
          <p className="eyebrow">
            FAQ
          </p>
          <h2 className="font-display text-2xl text-brand-blue md:text-3xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = index === openIndex;

            return (
              <article
                key={item.question}
                className="surface-card bg-brand-background/70 p-6"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-sm font-semibold text-brand-blue md:text-base">
                    {item.question}
                  </span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary-purple/20 bg-white text-xs text-primary-purple">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`grid overflow-hidden transition-all duration-300 ${
                    isOpen ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <p className="min-h-0 text-sm leading-relaxed text-brand-blue/75">
                    {item.answer}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

