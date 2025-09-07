import { PageBox } from '@/components/BoxPageContent';
import { Section } from '@/components/BoxSection';
import { LOTTERY_NUMBER_MAX } from '@/domains/BingoCard/models/BingoCard';
import { BingoGameFindOneWithCardsQueryUsecase } from '@/domains/BingoGame/usecases/BingoGameFindOneWithCards.query-usecase';
import { getQuery } from '@/lib/infra/getQuery';

import { Heading } from '../../_components/Heading';
import { LotteryHistory } from '../../_components/LotteryHistory';
import LotteryRoulette from './_components/LotteryRoulette';

interface Props {
  params: {
    bingoGameId: string;
  };
}

function getBingoGame(bingoGameId: string) {
  const bingoGameQueryUsecase = new BingoGameFindOneWithCardsQueryUsecase(
    getQuery('bingoGame'),
  );

  return bingoGameQueryUsecase.execute(bingoGameId);
}

export default async function BingoGameLotteryPage({
  params: { bingoGameId },
}: Props) {
  const { lotteryNumbers } = await getBingoGame(bingoGameId);

  return (
    <PageBox>
      <article>
        <LotteryResult
          bingoGameId={bingoGameId}
          lotteryNumbers={lotteryNumbers}
        />
        <LotteryHistory lotteryNumbers={lotteryNumbers} />
      </article>
    </PageBox>
  );
}

function LotteryResult({
  bingoGameId,
  lotteryNumbers,
}: {
  bingoGameId: string;
  lotteryNumbers: number[];
}) {
  return (
    <Section>
      <Heading>抽選結果</Heading>
      <LotteryRoulette
        bingoGameId={bingoGameId}
        number={lotteryNumbers.slice(-1)[0]}
        finish={lotteryNumbers.length === LOTTERY_NUMBER_MAX}
      />
    </Section>
  );
}
