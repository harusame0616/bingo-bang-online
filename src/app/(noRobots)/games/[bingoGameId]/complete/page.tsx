import { ReloadIcon } from '@radix-ui/react-icons';
import { Suspense } from 'react';

import { Heading } from '@/app/(noRobots)/_components/Heading';
import { Section } from '@/components/BoxSection';
import { isCardBingo } from '@/domains/BingoCard/lib/isCardBingo';
import { BingoGameFindOneWithCardsQueryUsecase } from '@/domains/BingoGame/usecases/BingoGameFindOneWithCards.query-usecase';
import { getQuery } from '@/lib/infra/getQuery';

export default async function BingoCardCompletePage({
  params,
}: PageProps<'/games/[bingoGameId]/complete'>) {
  const { bingoGameId } = await params;

  return (
    <article>
      <Section>
        <Heading>ビンゴ完成カードリスト</Heading>
        <Suspense
          fallback={
            <div className="flex justify-center">
              <ReloadIcon className="mr-2 h-8 w-8 animate-spin" />
            </div>
          }
        >
          <div className="flex justify-center">
            <BingoCompletionCards bingoGameId={bingoGameId} />
          </div>
        </Suspense>
      </Section>
    </article>
  );
}

function getBingoGame(bingoGameId: string) {
  const bingoGameQueryUsecase = new BingoGameFindOneWithCardsQueryUsecase(
    getQuery('bingoGame'),
  );

  return bingoGameQueryUsecase.execute(bingoGameId);
}

async function BingoCompletionCards({ bingoGameId }: { bingoGameId: string }) {
  const { bingoCards, lotteryNumbers } = await getBingoGame(bingoGameId);

  const bingoCompleteCards = bingoCards
    .filter((bingoCard) => isCardBingo(lotteryNumbers, bingoCard.squares))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ol aria-labelledby="bingo-complete-card-name-list">
      {bingoCompleteCards.map(({ id, name }) => (
        <li key={id}>・{name || '名無しのカード'}</li>
      ))}
    </ol>
  );
}
