import { FlipWordsAcorta } from '@/components/features/flip-acorta';
import { FormSendURL } from '@/components/forms/form-send-url';
import { SiteHeader } from '@/components/layout/site-header';

export default function createPage() {
  return (
    <>
      <SiteHeader site="Create a new short URL" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Add your analytics components here */}

            <div className="px-4 lg:px-6 max-w-2xl w-full mx-auto">
              {/* Placeholder for analytics content */}
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
          </div>
        </div>
      </div>
    </>
  );
}
