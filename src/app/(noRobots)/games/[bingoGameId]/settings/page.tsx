import { ReloadIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Suspense } from 'react';

import { Heading } from '@/app/(noRobots)/_components/Heading';
import { PageBox } from '@/components/BoxPageContent';
import { Section } from '@/components/BoxSection';
import { BingoGameFindOneWithCardsQueryUsecase } from '@/domains/BingoGame/usecases/BingoGameFindOneWithCards.query-usecase';
import { getQuery } from '@/lib/infra/getQuery';

interface Props {
  params: {
    bingoGameId: string;
  };
}

export default async function BingoCardCompletePage({
  params: { bingoGameId },
}: Props) {
  return (
    <PageBox>
      <article>
        <Section>
          <Heading>閲覧専用ページリンク</Heading>
          <Suspense
            fallback={
              <div className="flex justify-center">
                <ReloadIcon className="mr-2 h-8 w-8 animate-spin" />
              </div>
            }
          >
            <div className="flex justify-center">
              <ViewLinks bingoGameId={bingoGameId} />
            </div>
          </Suspense>
          <p className="pt-1 text-center text-xs text-muted-foreground">
            ※ ユーザーにお伝えする際はこちらのリンクを使用してください。
          </p>
        </Section>
      </article>
    </PageBox>
  );
}

function getBingoGame(bingoGameId: string) {
  const bingoGameQueryUsecase = new BingoGameFindOneWithCardsQueryUsecase(
    getQuery('bingoGame'),
  );

  return bingoGameQueryUsecase.execute(bingoGameId);
}

async function ViewLinks({ bingoGameId }: { bingoGameId: string }) {
  const { viewId } = await getBingoGame(bingoGameId);

  return (
    <ul aria-label="閲覧用リンク" className="flex flex-col">
      <li className="flex">
        ・
        <Link
          href={`/views/${viewId}/lottery_numbers`}
          className="block text-xs italic underline hover:text-primary-darken"
        >
          抽選番号発表ページ
        </Link>
      </li>
      <li className="flex">
        ・
        <Link
          href={`/views/${viewId}/cards`}
          className="block text-xs italic underline hover:text-primary-darken"
        >
          カード一覧ページ
        </Link>
      </li>
    </ul>
  );
}
