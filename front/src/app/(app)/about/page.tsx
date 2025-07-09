import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export default function AboutPage() {
  return (
    <div className="container max-w-(--breakpoint-md) mx-auto w-full h-full flex-1 flex flex-col">
      <div className="w-full h-full flex flex-col gap-8 pt-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Questions & Answers
        </h1>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What is this URL shortener project?
            </AccordionTrigger>
            <AccordionContent>
              This project is a service that allows users to create short,
              easy-to-share URLs. Behind each shortened URL, the original URL is
              stored along with additional information such as metadata and a
              click counter to analyze its performance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              How does the URL shortener work?
            </AccordionTrigger>
            <AccordionContent>
              Users enter a URL into the system, and it generates a short,
              unique version that redirects to the original URL.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Do the generated QR codes expire?
            </AccordionTrigger>
            <AccordionContent>
              NO! QR codes never expire. Each QR is permanently linked to the
              short URL, which means it can be used indefinitely as long as the
              short URL remains valid in the system.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Is the project finished?</AccordionTrigger>
            <AccordionContent>
              Not at all, the project is in a testing phase. Although it is
              fully usable for shortening URLs and generating QR codes, key
              features such as user registration, authentication, and advanced
              analytics tools are still missing. These features are under
              development and will be added in future versions.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
