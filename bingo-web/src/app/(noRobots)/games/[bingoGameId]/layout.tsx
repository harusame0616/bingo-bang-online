import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

import BingoCardIcon from './_img/bingo-card.svg';
import CompleteIcon from './_img/complete.svg';
import LotteryIcon from './_img/lottery.svg';
import SettingIcon from './_img/setting.svg';

interface Props {
  params: {
    bingoGameId: string;
  };
}

export default function GameManagementLayout({
  children,
  params: { bingoGameId },
}: PropsWithChildren<Props>) {
  const menus = [
    {
      path: `/games/${bingoGameId}`,
      label: '抽選',
      icon: LotteryIcon,
    },
    {
      path: `/games/${bingoGameId}/cards`,
      label: 'ビンゴカード管理',
      icon: BingoCardIcon,
      width: 35,
      className: 'pt-2',
    },
    {
      path: `/games/${bingoGameId}/complete`,
      label: 'ビンゴ完成リスト',
      icon: CompleteIcon,
    },
    {
      path: `/games/${bingoGameId}/settings`,
      label: '設定',
      icon: SettingIcon,
      className: 'pt-1',
      width: 32,
    },
  ];

  return (
    <>
      {children}
      <nav className="fixed bottom-0  flex w-full justify-center border-t bg-background">
        <ol className="flex gap-8 py-2 ">
          {menus.map(({ className, icon, label, path, width = 40 }) => (
            <li className="flex items-center justify-center" key={path}>
              <Link href={path}>
                <span className="sr-only">{label}</span>
                <Image
                  src={icon}
                  width={width}
                  alt={`${label} アイコン`}
                  className={className}
                />
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
