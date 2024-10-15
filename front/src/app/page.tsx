import { FlipWordsAcorta } from '@/components/flip-acorta';
import { FormSendURL } from '@/components/form-send-url';

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col gap-8 pt-12">
      <div className="scroll-m-20 text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl">
        <h1>Acorta tu URL fácilmente</h1>
        <FlipWordsAcorta />
      </div>
      <div className="max-w-screen-sm flex justify-center self-center w-full">
        <FormSendURL />
      </div>
    </div>
  );
}
