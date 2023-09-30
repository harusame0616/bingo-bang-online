import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { PageBox } from '@/components/BoxPageContent';
import { Section } from '@/components/BoxSection';
import { Button } from '@/components/Button';
import { BingoGameCreateUsecase } from '@/domains/BingoGame/usecases/BingoGameCreate.usecase';
import { getRepository } from '@/lib/infra/getRepository';

import { features } from './_constants/features';

async function startBingoGame() {
  'use server';
  const createUsecase = new BingoGameCreateUsecase(getRepository('bingoGame'));

  const bingoGame = await createUsecase.execute();
  redirect(`/games/${bingoGame.id}?sound=${process.env.CI ? 'off' : 'on'}`);
}

export default function Home() {
  return (
    <PageBox>
      <article>
        <h2 className="sr-only">BINGOBANG ONLINE トップページ</h2>
        <AboutThis />
        <GameStart />
        <Feature />
      </article>
    </PageBox>
  );
}

function AboutThis() {
  return (
    <Section className="mt-12 text-center">
      <strong className="font-black">インストール不要・登録不要・無料</strong>
      <span className="ml-1 block text-sm md:inline">
        でビンゴを管理できるサービスです。
      </span>
    </Section>
  );
}

function GameStart() {
  return (
    <Section>
      <h2 className="sr-only">ビンゴゲームを開始する</h2>
      <form action={startBingoGame} className="mb-2 flex justify-center">
        <Button
          disableInAction={true}
          disableInActionChildren="ビンゴゲームを準備中です"
        >
          新しくビンゴゲームを開始する
        </Button>
      </form>

      <div className="block text-center text-xs" id="bingo-game-start-note">
        新しくゲームを開始する際の注意
      </div>
      <ul
        aria-labelledby="bingo-game-start-note"
        className="mx-auto max-w-screen-sm"
      >
        <li>
          <Note>
            ボタンをクリックするとビンゴゲーム管理 URL が発行されます。
            お気に入りに登録してご利用ください。
          </Note>
        </li>
        <li>
          <Note>
            URL
            が流出すると他の人がビンゴゲームの管理（抽選やカードの生成)ができてしまうのでご注意ください。
          </Note>
        </li>
      </ul>
    </Section>
  );
}

function Feature() {
  return (
    <Section>
      <SectionTitle>
        <div id="what-can-do">
          BINGOBANG ONLINE <span className="block md:inline">でできること</span>
        </div>
      </SectionTitle>
      <ul
        className="mx-auto mb-8 flex max-w-screen-sm flex-col gap-y-4"
        aria-labelledby="what-can-do"
      >
        {features.map((feature, i) => (
          <li key={feature.title} aria-labelledby={`feature-${i}`}>
            <div className="font-black" id={`feature-${i}`}>
              {feature.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {' '}
              {feature.description}
            </div>
          </li>
        ))}
      </ul>
      <div className="mx-auto max-w-screen-sm ">
        その他続々と機能を追加予定です。
      </div>
    </Section>
  );
}

function Note({
  children,
  pre = '※',
}: {
  children: React.ReactNode;
  pre?: string;
}) {
  return (
    <i className="block text-xs font-bold text-muted-foreground">
      {pre}&nbsp;{children}
    </i>
  );
}

function SectionTitle({ children }: PropsWithChildren) {
  return <h2 className="mb-2 text-center text-2xl font-black">{children}</h2>;
}
