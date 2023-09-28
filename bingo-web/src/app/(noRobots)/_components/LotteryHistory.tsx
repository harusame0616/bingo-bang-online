import { Section } from '@/components/BoxSection';
import { Chip } from '@/components/Chip';

import { Heading } from './Heading';

export function LotteryHistory({
  lotteryNumbers,
}: {
  lotteryNumbers: number[];
}) {
  return (
    <Section>
      <Heading>
        <span id="lottery-number-history">抽選番号履歴</span>
      </Heading>
      <ol
        aria-labelledby="lottery-number-history"
        className="flex flex-wrap justify-center gap-x-2 gap-y-1"
      >
        {lotteryNumbers.map((lotteryNumber) => (
          <li key={lotteryNumber}>
            <Chip>{lotteryNumber}</Chip>
          </li>
        ))}
      </ol>
    </Section>
  );
}
