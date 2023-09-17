import { redirect } from 'next/navigation';

import { PageBox } from '@/components/BoxPageContent';
import { Section } from '@/components/BoxSection';
import { Button } from '@/components/Button';
import { BingoGameCreateUsecase } from '@/domains/BingoGame/usecases/BingoGameCreate.usecase';
import { getRepository } from '@/lib/infra/getRepository';

async function startBingoGame() {
  'use server';
  const createUsecase = new BingoGameCreateUsecase(getRepository('bingoGame'));

  const bingoGame = await createUsecase.execute();
  redirect(`/games/${bingoGame.id}?sound=${process.env.ci ? 'off' : 'on'}`);
}

function StrongKeyword({ children }: { children: React.ReactNode }) {
  return <strong className="font-black text-primary-darken">{children}</strong>;
}

function Note({
  children,
  pre = '※',
}: {
  children: React.ReactNode;
  pre?: string;
}) {
  return (
    <i className="block text-xs text-primary-lighter">
      {pre}&nbsp;{children}
    </i>
  );
}

export default function Home() {
  const features = [
    {
      title: 'ビンゴカードの自動生成',
      description: (
        <>
          ビンゴカードを生成し、名前をつけて誰のカードなのか管理できます。
          <br />
          現状では1ゲーム最大で 30 枚まで生成できます。
        </>
      ),
    },
    {
      title: '番号の抽選',
      description: (
        <>
          番号を抽選することができます。
          <br />
          抽選済みの番号も表示されるのでひと目で抽選済みの番号がわかります。
        </>
      ),
    },
    {
      title: 'ビンゴカードのビンゴチェック',
      description: (
        <>
          ビンゴカードがビンゴしているか自動で確認できます。
          <br />
          ビンゴしているかどうかのチェックが不要になります。
        </>
      ),
    },
    {
      title: '閲覧専用のビンゴカード一覧ページ',
      description: (
        <>
          ビンゴゲームの URL
          を知られることなく閲覧専用のビンゴカード一覧ページを共有できます。
          <br />
          対象者にビンゴカードの一覧を共有することで、各ユーザーが自分のビンゴカードを確認できます。
        </>
      ),
    },
    {
      title: '閲覧専用の抽選番号ページ',
      description: (
        <>
          ビンゴゲームの URL
          を知られることなく閲覧専用の抽選番号を表示するページを共有できます。
          <br />
          専用の画面に表示したり、URL
          をシェアすることで各ユーザーが自分のビンゴカードと抽選番号を確認できます。
        </>
      ),
    },
  ];

  return (
    <PageBox>
      <Section className="mt-12 text-center">
        <h2 className="text-center text-2xl font-black text-primary-darken">
          BINGOBANG ONLINE とは
        </h2>
        <div className="mt-2">
          <StrongKeyword>インストール不要</StrongKeyword>、
          <StrongKeyword>登録不要</StrongKeyword>、
          <StrongKeyword>無料</StrongKeyword>
          <div className="text-sm md:inline">
            {' '}
            でビンゴを楽しめるサービスです。
          </div>
        </div>
      </Section>

      <Section>
        <form action={startBingoGame} className="mb-2 flex justify-center">
          <Button
            disableInAction={true}
            disableInActionChildren="ビンゴゲームを準備中です"
            className="mx-auto"
          >
            新しくビンゴゲームを開始する
          </Button>
        </form>
        <div className="mx-auto max-w-screen-sm">
          <Note>
            ボタンをクリックするとビンゴゲーム管理 URL が発行されます。
            お気に入りに登録してご利用ください。
          </Note>
          <Note>
            URL
            が流出すると他の人がビンゴゲームの管理（抽選やカードの生成)ができてしまうのでご注意ください。
          </Note>
        </div>
      </Section>

      <Section>
        <h2 className="mb-2 text-center text-2xl font-black text-primary-darken">
          BINGOBANG ONLINE <div className="md:inline">でできること</div>
        </h2>
        <ul className="mx-auto mb-8 flex max-w-screen-sm flex-col gap-y-4">
          {features.map((feature) => (
            <li key={feature.title}>
              <div className="font-black text-primary-darken">
                {feature.title}
              </div>
              <div className="mt-1 text-sm"> {feature.description}</div>
            </li>
          ))}
        </ul>
        <div className="mx-auto max-w-screen-sm ">
          その他続々と機能を追加予定です。
        </div>
      </Section>
    </PageBox>
  );
}
