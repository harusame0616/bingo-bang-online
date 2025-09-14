import { notFound } from 'next/navigation';

import { Section } from '@/components/BoxSection';
import { Chip } from '@/components/Chip';
import prisma from '@/lib/prisma';

import { Heading } from './Heading';

export async function LotteryHistoryContainer({
  bingoGameId,
}: {
  bingoGameId: string;
}) {
  async function getLotteryNumbers() {
    const bingoGame = await prisma.bingoGameEntity.findUnique({
      where: {
        id: bingoGameId,
      },
    });
    if (!bingoGame) {
      notFound();
    }

    return bingoGame?.lotteryNumbers;
  }

  const numbers = await getLotteryNumbers();

  return <LotteryHistory lotteryNumbers={numbers} />;
}

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
