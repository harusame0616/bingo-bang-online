import { redirect } from 'next/navigation';

import { Button } from '@/components/Button';
import { BingoGameCreateUsecase } from '@/domains/BingoGame/usecases/BingoGameCreate.usecase';
import { getRepository } from '@/lib/getRepository';

async function startBingoGame() {
  'use server';
  const createUsecase = new BingoGameCreateUsecase(getRepository('bingoGame'));

  const bingoGame = await createUsecase.execute();
  redirect(`/games/${bingoGame.id}`);
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
    <i className="text-xs text-primary-lighter block">
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
    <main className="flex flex-col items-center w-full h-full px-4">
      <section className="text-center mt-4">
        <h2 className="text-2xl text-primary-darken font-black text-center">
          BINGOBANG ONLINE とは
        </h2>
        <div className="mt-2">
          <StrongKeyword>インストール不要</StrongKeyword>、
          <StrongKeyword>登録不要</StrongKeyword>、
          <StrongKeyword>無料</StrongKeyword>
          <div className="md:inline text-sm">
            {' '}
            でビンゴを楽しめるサービスです。
          </div>
        </div>
      </section>

      <section className="mt-12">
        <form action={startBingoGame} className="flex justify-center">
          <Button
            disableInAction={true}
            disableInActionChildren="ビンゴゲームを準備中です"
            className="mx-auto"
          >
            新しくビンゴゲームを開始する
          </Button>
        </form>
        <div className="mt-2">
          <Note>
            「新しいビンゴゲームを開始する」をクリックすると専用の URL
            が発行されます。お気に入りに登録してご利用ください。
          </Note>
          <Note>
            URL
            が流出すると他の人がビンゴゲームの管理（抽選やカードの生成)ができてしまうのでご注意ください。
          </Note>
        </div>
      </section>

      <section className="block mt-12">
        <h2 className="text-2xl text-primary-darken font-black text-center">
          BINGOBANG ONLINE <div className="md:inline">でできること</div>
        </h2>
        <ul className="flex flex-col gap-y-4 mt-2">
          {features.map((feature) => (
            <li key={feature.title}>
              <div className="text-primary-darken font-black">
                {feature.title}
              </div>
              <div className="text-sm mt-1"> {feature.description}</div>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-primary-darken">
          その他続々と機能を追加予定です。
        </div>
      </section>
    </main>
  );
}
