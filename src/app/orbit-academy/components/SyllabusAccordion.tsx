"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionItem {
  week: string;
  title: string;
  topics: string[];
}

interface SyllabusAccordionProps {
  items: AccordionItem[];
}

export default function SyllabusAccordion({ items }: SyllabusAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="glass-card overflow-hidden">
      {items.map((item, i) => (
        <div key={i} className="orbit-accordion-item">
          <button
            className="orbit-accordion-trigger"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="flex items-center gap-4">
              <span
                className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(0, 242, 255, 0.1)",
                  color: "#00f2ff",
                  border: "1px solid rgba(0, 242, 255, 0.25)",
                }}
              >
                {item.week}
              </span>
              <span>{item.title}</span>
            </div>
            {openIndex === i ? (
              <ChevronUp className="w-4 h-4 text-[#00f2ff] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
            )}
          </button>

          {openIndex === i && (
            <div className="orbit-accordion-content">
              <ul className="space-y-1.5">
                {item.topics.map((topic, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-[#00f2ff] mt-0.5">›</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
