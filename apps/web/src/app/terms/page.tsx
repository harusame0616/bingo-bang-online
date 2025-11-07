import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "利用規約 - BINGO BANG ONLINE",
	description: "BINGO BANG ONLINEの利用規約ページです。",
};

export default function TermsPage() {
	return (
		<article className="h-full overflow-y-auto p-4">
			<div className="mx-auto max-w-(--breakpoint-md) py-8">
				<h1 className="mb-8 text-center text-3xl font-black">利用規約</h1>

				<div className="mb-8 text-sm text-muted-foreground">
					<p>
						この利用規約（以下「本規約」といいます）は、BINGO BANG
						ONLINE（以下「本サービス」といいます）の利用条件を定めるものです。本サービスをご利用いただく前に、必ずお読みください。
					</p>
				</div>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第1条（適用）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							本規約は、本サービスの提供条件及び本サービスの利用に関する運営者とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されます。
						</li>
						<li>
							ユーザーは、本サービスを利用することにより、本規約に同意したものとみなされます。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第2条（定義）</h2>
					<p className="mb-2 text-sm">本規約において使用する用語の定義は、以下のとおりとします。</p>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>「運営者」とは、◯◯を指します。</li>
						<li>「ユーザー」とは、本サービスを利用するすべての方を指します。</li>
						<li>
							「本サービス」とは、運営者が提供するビンゴゲーム管理サービス「BINGO
							BANG ONLINE」を指します。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第3条（本サービスの内容）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							本サービスは、ビンゴカードの生成、番号の抽選、ビンゴチェックなどのビンゴゲーム開催をサポートする機能を提供します。
						</li>
						<li>
							本サービスは無料で提供されます。ただし、通信費等はユーザーの負担とします。
						</li>
						<li>
							本サービスの内容は、運営者の判断により、予告なく変更、追加、廃止することができるものとします。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第4条（禁止事項）</h2>
					<p className="mb-2 text-sm">ユーザーは、本サービスの利用にあたり、以下の行為をしてはならないものとします。</p>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>法令または公序良俗に違反する行為</li>
						<li>犯罪行為に関連する行為</li>
						<li>運営者、他のユーザー、または第三者の権利を侵害する行為</li>
						<li>運営者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
						<li>本サービスの運営を妨害するおそれのある行為</li>
						<li>不正アクセスをし、またはこれを試みる行為</li>
						<li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
						<li>不正な目的を持って本サービスを利用する行為</li>
						<li>本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
						<li>他のユーザーに成りすます行為</li>
						<li>運営者が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
						<li>本サービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
						<li>その他、運営者が不適切と判断する行為</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第5条（本サービスの停止等）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							運営者は、以下のいずれかに該当する場合には、ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができるものとします。
							<ol className="ml-6 list-[lower-alpha] space-y-1 mt-2">
								<li>本サービスに係るコンピューター・システムの点検または保守作業を緊急に行う場合</li>
								<li>コンピューター、通信回線等の障害、誤操作、過度なアクセスの集中、不正アクセス、ハッキング等により本サービスの運営ができなくなった場合</li>
								<li>地震、落雷、火災、風水害、停電、天災地変などの不可抗力により本サービスの運営ができなくなった場合</li>
								<li>その他、運営者が停止または中断を必要と判断した場合</li>
							</ol>
						</li>
						<li>運営者は、本条に基づき運営者が行った措置に基づきユーザーに生じた損害について一切の責任を負いません。</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第6条（保証の否認および免責）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
						</li>
						<li>
							運営者は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
						</li>
						<li>
							前項ただし、本サービスに関する運営者とユーザーとの間の契約が消費者契約法に定める消費者契約となる場合、本項は適用されません。
						</li>
						<li>
							前項但し書に定める場合であっても、運営者は、運営者の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（運営者またはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。
						</li>
						<li>
							運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第7条（サービス内容の変更、終了）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							運営者は、ユーザーに通知することなく、本サービスの内容を変更し、または本サービスの提供を終了することができるものとします。
						</li>
						<li>
							運営者は、本条に基づき運営者が行った措置に基づきユーザーに生じた損害について一切の責任を負いません。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第8条（利用規約の変更）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>
							運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
						</li>
						<li>
							変更後の本規約は、本サービス上に掲載された時点で効力を生じるものとします。
						</li>
						<li>
							本規約の変更後に本サービスを利用したユーザーは、変更後の本規約に同意したものとみなします。
						</li>
					</ol>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第9条（個人情報の取扱い）</h2>
					<p className="text-sm">
						本サービスにおける個人情報の取扱いについては、
						<Link href="/privacy" className="text-primary underline hover:text-primary/80">
							プライバシーポリシー
						</Link>
						をご確認ください。
					</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第10条（通知または連絡）</h2>
					<p className="text-sm">
						ユーザーと運営者との間の通知または連絡は、運営者の定める方法によって行うものとします。
					</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第11条（権利義務の譲渡の禁止）</h2>
					<p className="text-sm">
						ユーザーは、運営者の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
					</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-xl font-bold">第12条（準拠法・裁判管轄）</h2>
					<ol className="ml-6 list-decimal space-y-2 text-sm">
						<li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
						<li>
							本サービスに関して紛争が生じた場合には、◯◯を管轄する裁判所を専属的合意管轄とします。
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
