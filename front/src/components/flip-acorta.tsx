import { FlipWords } from '@/components/ui/flipwords';

export function FlipWordsAcorta() {
  const words = [
    'tWe5wR',
    'bij-6cg',
    'zvf1nIg',
    'ux1ewg',
    'k8pQ2z',
    'm3nX7v',
    'aB4cD5',
    'qR9tY1',
    'lmn-8op',
    's2t3uv',
    'wxy-4z',
    'h7j6kl',
    'p0q1rs',
    'v5w6x7',
    'g8h9ij',
    'b2c3de'
  ];

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
