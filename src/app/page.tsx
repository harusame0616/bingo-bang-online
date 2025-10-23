import { CreateBingoRoomButton } from "./create-bingo-room-button";

const features = [
	{
		title: "ビンゴカードの自動生成",
		description: (
			<>
				<div>
					ビンゴカードを生成し、名前をつけて誰のカードなのか管理できます。
				</div>
				<div>現状では1ゲーム最大で 30 枚まで生成できます。</div>
			</>
		),
	},
	{
		title: "番号の抽選",
		description: (
			<>
				<div>番号を抽選することができます。</div>
				<div>
					抽選済みの番号も表示されるのでひと目で抽選済みの番号がわかります。
				</div>
			</>
		),
	},
	{
		title: "ビンゴカードのビンゴチェック",
		description: (
			<>
				<div>ビンゴカードがビンゴしているか自動で確認できます。</div>
				<div>ビンゴしているかどうかのチェックが不要になります。</div>
			</>
		),
	},
	{
		title: "閲覧専用のビンゴカード一覧ページ",
		description: (
			<>
				<div>
					ビンゴゲームの URL
					を知られることなく閲覧専用のビンゴカード一覧ページを共有できます。
				</div>
				<div>
					対象者にビンゴカードの一覧を共有することで、各ユーザーが自分のビンゴカードを確認できます。
				</div>
			</>
		),
	},
	{
		title: "閲覧専用の抽選番号ページ",
		description: (
			<>
				<div>
					ビンゴゲームの URL
					を知られることなく閲覧専用の抽選番号を表示するページを共有できます。
				</div>
				<div>
					専用の画面に表示したり、URL
					をシェアすることで各ユーザーが自分のビンゴカードと抽選番号を確認できます。
				</div>
			</>
		),
	},
];

export default function Home() {
	return (
		<article className="h-full overflow-y-auto p-4">
			<div className="my-12 text-center break-keep">
				<span className="font-black">インストール不要・登録不要・無料</span>
				<wbr />
				<span className="ml-1 text-sm">でビンゴを開催できるサービスです。</span>
			</div>
			<div className="mb-12 w-full flex flex-col items-center">
				<CreateBingoRoomButton />
				<div className="block text-center mt-4">
					新しくゲームを開始する際の注意
				</div>
				<ul className="mx-auto max-w-screen-sm font-bold text-muted-foreground text-sm list-disc list-inside p-1">
					<li>
						ボタンをクリックするとビンゴゲーム管理 URL が発行されます。
						お気に入りに登録してご利用ください。
					</li>
					<li>
						URL
						が流出すると他の人がビンゴゲームの管理（抽選やカードの生成)が行えてしまうのでご注意ください。
					</li>
				</ul>
			</div>
			<section>
				<h2 className="mb-2 text-center text-2xl font-black break-keep">
					<span className="mr-1">BINGO BANG ONLINE</span>
					<wbr />
					でできること
				</h2>
				<ul className="mx-auto mb-8 flex max-w-screen-sm flex-col gap-y-4">
					{features.map((feature, i) => (
						<li key={feature.title} aria-labelledby={`feature-${i}`}>
							<div className="font-black" id={`feature-${i}`}>
								{feature.title}
							</div>
							<div className="mt-1 text-xs text-muted-foreground">
								{feature.description}
							</div>
						</li>
					))}
				</ul>
				<div className="mx-auto max-w-screen-sm ">
					その他続々と機能を追加予定です。
				</div>
			</section>
		</article>
	);
}
