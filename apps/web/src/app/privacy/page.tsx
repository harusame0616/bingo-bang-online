import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "プライバシーポリシー - BINGO BANG ONLINE",
	description: "BINGO BANG ONLINEのプライバシーポリシーページです。",
};

export default function PrivacyPage() {
	return (
		<article className="h-full overflow-y-auto p-4">
			<div className="mx-auto max-w-(--breakpoint-md) py-8">
				<h1 className="mb-8 text-center text-3xl font-black">プライバシーポリシー</h1>

				<div className="mb-8 text-sm text-muted-foreground">
					<p>
						BINGO BANG ONLINE（以下「本サービス」といいます）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
					</p>
				</div>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第1条（収集する情報）</h2>
					<p className="mb-2 text-sm">
						本サービスでは、以下の情報を収集することがあります。
					</p>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							<strong>アクセス情報</strong>
							<ul className="ml-6 list-disc space-y-1 mt-1">
								<li>IPアドレス</li>
								<li>ブラウザの種類</li>
								<li>デバイス情報</li>
								<li>アクセス日時</li>
								<li>参照元URL</li>
								<li>閲覧ページURL</li>
							</ul>
						</li>
						<li>
							<strong>Cookie等の技術を用いて収集する情報</strong>
							<ul className="ml-6 list-disc space-y-1 mt-1">
								<li>Google Analyticsによるアクセス解析情報</li>
								<li>◯◯</li>
							</ul>
						</li>
						<li>
							<strong>ユーザーが入力した情報</strong>
							<ul className="ml-6 list-disc space-y-1 mt-1">
								<li>ビンゴカードに設定する名前（ニックネーム等）</li>
								<li>◯◯</li>
							</ul>
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第2条（情報の利用目的）</h2>
					<p className="mb-2 text-sm">本サービスは、収集した情報を以下の目的で利用します。</p>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>本サービスの提供、維持、保護および改善のため</li>
						<li>本サービスの利用状況の分析およびサービス向上のため</li>
						<li>本サービスに関する問い合わせへの対応のため</li>
						<li>本サービスの利用規約に違反する行為への対応のため</li>
						<li>本サービスに関する規約、ポリシー等の変更の通知のため</li>
						<li>上記の利用目的に付随する目的</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第3条（個人情報の第三者提供）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							運営者は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
							<ol className="ml-6 list-[lower-alpha] space-y-1 mt-2">
								<li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
								<li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
								<li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
							</ol>
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第4条（Cookieおよび類似技術の使用）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							本サービスでは、サービスの利便性向上および利用状況の分析のため、Cookieおよび類似技術を使用しています。
						</li>
						<li>
							ユーザーは、ブラウザの設定によりCookieの受け取りを拒否することができます。ただし、Cookieを無効にした場合、本サービスの一部機能が正常に動作しない可能性があります。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第5条（Google Analyticsの使用）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							本サービスでは、サービスの利用状況を把握するため、Google
							Inc.が提供するアクセス解析ツール「Google Analytics」を使用しています。
						</li>
						<li>
							Google Analyticsは、Cookieを使用してユーザーのアクセス情報を収集します。この情報は匿名で収集されており、個人を特定するものではありません。
						</li>
						<li>
							Google Analyticsの利用規約およびプライバシーポリシーについては、Google
							Analyticsのサイトをご覧ください。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第6条（データの保存期間）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							本サービスで生成されたビンゴゲームのデータ（ビンゴカード、抽選番号等）は、◯◯期間保存されます。
						</li>
						<li>
							保存期間を経過したデータは、運営者によって削除されることがあります。
						</li>
						<li>
							アクセスログ等の情報は、◯◯期間保存されます。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第7条（個人情報の安全管理）</h2>
					<p className="text-sm">
						運営者は、個人情報の紛失、破壊、改ざんおよび漏洩などのリスクに対して、適切な安全管理措置を講じます。
					</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第8条（お問い合わせ）</h2>
					<p className="text-sm">
						本ポリシーに関するお問い合わせは、以下の連絡先までお願いいたします。
					</p>
					<div className="mt-2 ml-4 text-sm">
						<p>運営者：◯◯</p>
						<p>メールアドレス：◯◯</p>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第9条（プライバシーポリシーの変更）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							運営者は、必要に応じて、本ポリシーを変更することがあります。
						</li>
						<li>
							変更後のプライバシーポリシーは、本サービス上に掲載された時点で効力を生じるものとします。
						</li>
						<li>
							本ポリシーの変更後に本サービスを利用したユーザーは、変更後の本ポリシーに同意したものとみなします。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<p className="text-right text-sm text-muted-foreground">制定日：◯◯年◯◯月◯◯日</p>
					<p className="text-right text-sm text-muted-foreground">最終改定日：◯◯年◯◯月◯◯日</p>
				</section>

				<div className="mt-8 text-center">
					<Link href="/" className="text-primary underline hover:text-primary/80">
						トップページに戻る
					</Link>
				</div>
			</div>
		</article>
	);
}
