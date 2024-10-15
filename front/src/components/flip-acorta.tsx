import { FlipWords } from '@/components/ui/flipwords';

export function FlipWordsAcorta() {
  const words = ['tWe5wR', 'bij-6cg', 'zvf1nIg', 'ux1ewg'];

  return (
    <div className="flex items-center ">
      <div className="tex2t-primary/80 dark:text2-primary/80">
        /
        <FlipWords
          words={words}
          duration={1000}
          className="text-amber-400 dark:text-amber-300"
        />
      </div>
    </div>
  );
}
