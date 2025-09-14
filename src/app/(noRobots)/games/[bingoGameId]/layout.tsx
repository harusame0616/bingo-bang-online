import Image from 'next/image';
import Link from 'next/link';

import BingoCardIcon from './_img/bingo-card.svg';
import CompleteIcon from './_img/complete.svg';
import LotteryIcon from './_img/lottery.svg';
import SettingIcon from './_img/setting.svg';

export default async function Layout({
  children,
  params,
}: LayoutProps<'/games/[bingoGameId]'>) {
  const { bingoGameId } = await params;

  const menus = [
    {
      path: `/games/${bingoGameId}`,
      label: '抽選',
      icon: LotteryIcon,
    },
    {
      path: `/games/${bingoGameId}/cards`,
      label: 'カード管理',
      icon: BingoCardIcon,
    },
    {
      path: `/games/${bingoGameId}/complete`,
      label: '完成リスト',
      icon: CompleteIcon,
    },
    {
      path: `/games/${bingoGameId}/settings`,
      label: '設定',
      icon: SettingIcon,
    },
  ];

  return (
    <div className="flex grow flex-col overflow-y-hidden">
      <div className="grow overflow-y-auto p-4 [scrollbar-gutter:stable]">
        {children}
      </div>
      <nav className="bottom-0 flex w-full justify-center border-t">
        <ul className="flex gap-8 py-4">
          {menus.map(({ icon, label, path }) => (
            <li className="flex items-center justify-center" key={path}>
              <Link
                href={path}
                className="flex flex-col items-center justify-center gap-1"
              >
                <div className="relative h-8 w-8">
                  <Image src={icon} alt="" fill />
                </div>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
