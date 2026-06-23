"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "Is DreamConsole really free?",
    answer:
      "Yes. All tools on DreamConsole are free to use. No account or credit card is required. We may show ads in the future to support hosting costs.",
  },
  {
    question: "Are my uploaded files stored on your servers?",
    answer:
      "For server-side tools (PDF merge, image compress, etc.), files are processed securely and deleted automatically after your download completes. Browser-only tools never upload your data.",
  },
  {
    question: "What is the maximum file size?",
    answer:
      "Most image tools support files up to 10 MB. PDF tools typically allow up to 50 MB. The exact limit is shown on each tool page.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. You can use every tool immediately without signing up or logging in.",
  },
  {
    question: "Which tools run in my browser vs. on your server?",
    answer:
      "Developer and SEO tools like JSON Formatter, UUID Generator, and Word Counter run entirely in your browser. Image and PDF conversion tools usually process files on our secure servers for better quality and speed.",
  },
  {
    question: "Is it safe to upload sensitive documents?",
    answer:
      "We take security seriously and delete files after processing. However, for highly confidential documents, consider whether local offline software is more appropriate for your needs.",
  },
  {
    question: "Can I use DreamConsole on mobile?",
    answer:
      "Yes. The site is mobile-friendly and works on phones and tablets. Some complex tools are easier to use on a desktop.",
  },
  {
    question: "Why did my conversion fail?",
    answer:
      "Common causes include unsupported file formats, corrupted files, or exceeding size limits. Try a smaller file or a different format. If the problem persists, contact us with details.",
  },
  {
    question: "Can I suggest a new tool?",
    answer:
      "We'd love to hear from you. Reach out via our Contact page with your idea.",
  },
  {
    question: "How do I report a bug or privacy concern?",
    answer:
      "Please use our Contact page or email us. For privacy-specific requests, also see our Privacy Policy.",
  },
];

export function FaqAccordion() {
  return (
    <Accordion className="not-prose w-full">
      {FAQ_ITEMS.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`} className="border-black/10 dark:border-white/10">
          <AccordionTrigger className="text-left font-semibold text-base hover:no-underline py-4">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed text-[15px] pb-4">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
