import { FlipWordsAcorta } from "@/components/flip-acorta";
import { FormSendURL } from "@/components/form-send-url";

export default function Home() {
  return (
    <div className="container max-w-(--breakpoint-md) mx-auto w-full h-full flex-1 flex flex-col">
      <div className="w-full h-full flex flex-col gap-8 pt-12">
        <div className="scroll-m-20 text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl">
          <h1>Shorten your URL easily</h1>
          <FlipWordsAcorta />
        </div>
        <div className="flex justify-center self-center w-full">
          <FormSendURL />
        </div>
      </div>
    </div>
  );
}
