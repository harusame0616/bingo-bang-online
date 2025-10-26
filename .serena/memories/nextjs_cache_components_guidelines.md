# Next.js 16 Cache Components 実装ガイド

Next.js 16 の Cache Component 機能を実装する際の完全なリファレンスです。

## 目次

1. [概要](#概要)
   - 主要な機能
   - コードスタイル
2. [基本原則](#基本原則)
3. [セットアップ](#セットアップ)
4. [実装パターン](#実装パターン)
   - パターン1: Container/Presenter パターン
   - パターン1-2: リスト表示（削除タグの使い方）
   - パターン2: データ取得関数
   - パターン3: Server Action
5. [チェックリスト](#チェックリスト)
6. [よくある間違い](#よくある間違い)
7. [まとめ](#まとめ)

---

## 概要

Cache Components は Next.js 16 で導入された機能で、コンポーネントレベルでキャッシュを制御できます。

### 主要な機能

- `"use cache"`: コンポーネントや関数をキャッシュ対象にする
- `cacheLife()`: キャッシュの有効期限を設定
- `cacheTag()`: キャッシュを識別するタグを設定
- `updateTag()`: タグを使ってキャッシュを無効化
- `cache()`: 同時リクエストの dedupe 処理

### コードスタイル

`"use cache"`、`cacheLife(...)`、`cacheTag(...)` が連続する場合は、空行を入れずにまとめて記述します。

```typescript
// ✅ 正しい
async function Container() {
	"use cache";
	cacheLife("permanent");
	cacheTag(CACHE_TAGS.resource(id));

	// 他の処理
}

// ❌ 間違い
async function Container() {
	"use cache";
	cacheLife("permanent");

	cacheTag(CACHE_TAGS.resource(id));  // 不要な空行

	// 他の処理
}
```

**例外:** 変数宣言などが間に入る場合は、論理的なブロック分けとして空行を入れます。

```typescript
async function Container({ id }: { id: Promise<string> }) {
	"use cache";
	cacheLife("permanent");

	const resolvedId = await id;  // 変数宣言

	cacheTag(CACHE_TAGS.resource(resolvedId));

	// 他の処理
}
```

---

## 基本原則

### キャッシュ戦略の選択

#### ✅ `cacheLife("permanent")` を使用する場合

**データ操作を完全に管理できる場合**

- 自分のコードでデータを作成・更新・削除
- Server Action で `updateTag` を使ってキャッシュ無効化
- 時間ではなくデータ更新時にのみキャッシュ更新

**実装例:**

```typescript
async function _getPosts(userId: string) {
	"use cache";
	cacheLife("permanent");
	cacheTag(CACHE_TAGS.posts(userId));

	return await db.posts.findMany({ where: { userId } });
}

// データ更新時
export async function updatePostAction(id: string, data: PostData) {
	const post = await db.posts.update({ where: { id }, data });
	updateTag(CACHE_TAGS.posts(post.userId)); // キャッシュ無効化
}
```

#### ✅ 時間ベースの `cacheLife` を使用する場合

**データ操作を管理できない場合**

- 外部API（天気、為替レート、ニュース等）
- 他システムがデータ更新（管理画面、バッチ処理等）
- 一定期間での更新で十分な要件

**実装例:**

```typescript
async function _getWeather(city: string) {
	"use cache";
	cacheLife("hours");  // 1時間ごとに自動更新（updateTag 不要）

	return await fetch(`https://api.weather.com/${city}`);
}
```

---

## セットアップ

### 1. next.config.js の設定

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: true,
	cacheLife: {
		permanent: {
			stale: 60 * 60 * 24 * 365,      // 1年
			revalidate: 60 * 60 * 24 * 365,
			expire: 60 * 60 * 24 * 365,
		},
	},
};

module.exports = nextConfig;
```

### 2. キャッシュタグの定義

`src/lib/cache-tags.ts`:

```typescript
export const CACHE_TAGS = {
	// データ更新時のキャッシュ無効化用タグ
	// posts(id) が更新されたら、このタグのキャッシュを無効化
	posts: (id: string) => `post-${id}`,
	users: (id: string) => `user-${id}`,

	// データ削除時のキャッシュ無効化用タグ
	// posts(id) が削除されたら、このタグのキャッシュを無効化
	postDelete: (id: string) => `post-delete-${id}`,
	userDelete: (id: string) => `user-delete-${id}`,
} as const;
```

**タグの目的と使い分け:**

タグは「どのデータが更新されたか」を表し、「どのキャッシュを無効化すべきか」を判断するための識別子です。

- **通常タグ（`posts(id)` 等）**: データの内容が更新された場合
  - 例: 投稿のタイトルや本文が変更された
  - このタグがついたキャッシュ: その投稿の詳細ページ、投稿を含むリスト等

- **削除タグ（`postDelete(id)` 等）**: データそのものが削除された場合
  - 例: 投稿が削除された
  - このタグがついたキャッシュ: その投稿に依存する全てのページ（詳細ページ、リスト等）

**キャッシュに両方のタグをつける理由:**
- 通常タグ: データ更新時にキャッシュを更新
- 削除タグ: データ削除時にキャッシュを無効化（データがないのにキャッシュが残るのを防ぐ）

---

## 実装パターン

### パターン1: Container/Presenter パターン

**使用場面:** ページコンポーネントでデータ取得とキャッシュ制御を行う

```typescript
// page.tsx
import { Suspense } from "react";

export default function Page({ params }: PageProps) {
	// params は Promise のまま渡す
	const id = params.then(p => p.id);

	return (
		<Suspense fallback={<Loading />}>
			<PostContainer postId={id} />
		</Suspense>
	);
}

// Container: データ取得とキャッシュ制御
async function PostContainer({ postId }: { postId: Promise<string> }) {
	"use cache";                      // 1. キャッシュ有効化
	cacheLife("permanent");            // 2. キャッシュ期限設定

	const id = await postId;          // 3. Promise を resolve
	cacheTag(                         // 4. キャッシュタグ設定
		CACHE_TAGS.posts(id),
		CACHE_TAGS.postDelete(id),
	);

	const post = await getPost(id);   // 5. データ取得

	return <PostPresenter post={post} />; // 6. Presenter に渡す
}

// Presenter: 表示のみ
function PostPresenter({ post }: { post: Post }) {
	return (
		<div>
			<h1>{post.title}</h1>
			<p>{post.content}</p>
		</div>
	);
}

function Loading() {
	return <div>Loading...</div>;
}
```

**重要なポイント:**
1. `params` は Promise のまま Container に渡す
2. Container を `Suspense` で囲む
3. Container で Promise を await する
4. データ更新用タグと削除用タグの両方を設定

### パターン1-2: リスト表示（削除タグの使い方）

**使用場面:** 複数のリソースを表示するリスト

```typescript
// page.tsx
import { Suspense } from "react";

export default function PostListPage({ params }: PageProps) {
	const userId = params.then(p => p.userId);

	return (
		<Suspense fallback={<Loading />}>
			<PostListContainer userId={userId} />
		</Suspense>
	);
}

// Container: リスト表示
async function PostListContainer({ userId }: { userId: Promise<string> }) {
	"use cache";
	cacheLife("permanent");

	const id = await userId;
	const posts = await getPosts(id);
	// リスト表示には削除タグを設定
	// いずれかの投稿が削除されたら、このリストのキャッシュも無効化される
	cacheTag(
		CACHE_TAGS.posts(id),
		...posts.map(post => CACHE_TAGS.postDelete(post.id)), // 各投稿の削除タグ
	);

	return <PostListPresenter posts={posts} />;
}

function PostListPresenter({ posts }: { posts: Post[] }) {
	return (
		<ul>
			{posts.map(post => (
				<li key={post.id}>
					<h2>{post.title}</h2>
				</li>
			))}
		</ul>
	);
}
```

**重要なポイント:**
1. リスト表示では各リソースの削除タグを全て設定
2. いずれかのリソースが削除されたら、リスト全体のキャッシュが無効化される
3. スプレッド演算子（`...`）を使って複数のタグを展開

### パターン2: データ取得関数

**使用場面:** 複数箇所で使い回すデータ取得ロジック

```typescript
// get-post.ts
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { notFound } from "next/navigation";

async function _getPost(id: string) {
	"use cache";                      // 1. キャッシュ有効化
	cacheLife("permanent");            // 2. キャッシュ期限設定
	cacheTag(                         // 3. キャッシュタグ設定
		CACHE_TAGS.posts(id),
		CACHE_TAGS.postDelete(id),
	);

	const post = await db.posts.findUnique({ // 4. データ取得
		where: { id }
	});

	if (!post) {                      // 5. データがない場合
		notFound();                   // 404 エラー
	}

	return post;
}

// cache() で同時リクエストを dedupe
export const getPost = cache(_getPost);
```

**重要なポイント:**
1. 内部関数（`_getPost`）に `"use cache"` を適用
2. `cache()` でラップしてエクスポート
   - 同時に複数箇所から呼び出される可能性がある場合の dedupe 対策
   - 例: 同じページで複数のコンポーネントが同じデータを取得する場合
3. データがない場合は `notFound()` を呼ぶ
4. データ更新用タグと削除用タグの両方を設定

### パターン3: Server Action

**使用場面:** データの作成・更新・削除

```typescript
// actions.ts
"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

// データ作成
export async function createPostAction(data: PostData) {
	const post = await db.posts.create({ data });

	// 関連するキャッシュを無効化
	updateTag(CACHE_TAGS.posts(post.userId));
}

// データ更新
export async function updatePostAction(id: string, data: PostData) {
	const post = await db.posts.update({
		where: { id },
		data
	});

	// 該当リソースのキャッシュを無効化
	updateTag(CACHE_TAGS.posts(id));
}

// データ削除
export async function deletePostAction(id: string) {
	await db.posts.delete({ where: { id } });

	// 削除タグで関連キャッシュを一括無効化
	// このタグを設定している全てのキャッシュが無効化される
	// （詳細ページ、リスト表示など）
	updateTag(CACHE_TAGS.postDelete(id));
}
```

**重要なポイント:**
1. `updateTag` を使用（`revalidatePath` は使わない）
2. 削除時は削除タグを無効化するだけで、そのタグを設定している全てのキャッシュ（詳細ページ、リスト表示など）が自動的に無効化される
3. Server Action 側でリスト表示を個別に無効化する必要はない（リスト側で削除タグを設定しておく）

---

## チェックリスト

### ✅ Container の実装確認

```typescript
async function Container({ id }: { id: Promise<string> }) {
	"use cache";                      // ✅ キャッシュ有効化
	cacheLife("permanent");            // ✅ キャッシュ期限設定

	const resolvedId = await id;      // ✅ Promise を resolve
	cacheTag(                         // ✅ キャッシュタグ設定
		CACHE_TAGS.resource(resolvedId),       // データ更新用タグ
		CACHE_TAGS.resourceDelete(resolvedId), // 削除用タグ
	);

	const data = await getResource(resolvedId); // ✅ データ取得
	return <Presenter data={data} />;           // ✅ Presenter に渡す
}
```

**確認項目:**
- [ ] `"use cache"` を追加
- [ ] `cacheLife("permanent")` を設定
- [ ] Promise を await してから使用
- [ ] `cacheTag()` でデータ更新用タグを設定
- [ ] `cacheTag()` で削除用タグも設定

### ✅ データ取得関数の実装確認

```typescript
async function _getResource(id: string) {
	"use cache";                      // ✅ キャッシュ有効化
	cacheLife("permanent");            // ✅ キャッシュ期限設定
	cacheTag(                         // ✅ キャッシュタグ設定
		CACHE_TAGS.resource(id),
		CACHE_TAGS.resourceDelete(id),
	);

	const data = await fetchData(id);

	if (!data) {                      // ✅ データなしの場合
		notFound();
	}

	return data;
}

export const getResource = cache(_getResource); // ✅ cache() でラップ
```

**確認項目:**
- [ ] `"use cache"` を追加
- [ ] `cacheLife("permanent")` を設定
- [ ] `cacheTag()` でタグを設定
- [ ] データがない場合 `notFound()` を呼ぶ
- [ ] `cache()` でラップしてエクスポート（複数箇所から同時に呼ばれる可能性がある場合）

### ✅ Server Action の実装確認

```typescript
// 更新
export async function updateAction(id: string, data: Data) {
	await db.update({ where: { id }, data });
	updateTag(CACHE_TAGS.resource(id)); // ✅ updateTag を使用
}

// 削除
export async function deleteAction(id: string) {
	await db.delete({ where: { id } });
	updateTag(CACHE_TAGS.resourceDelete(id)); // ✅ 削除タグ
}
```

**確認項目:**
- [ ] `updateTag()` を使用（`revalidatePath` は使わない）
- [ ] 削除時は削除タグを無効化
- [ ] 必要に応じて複数のタグを無効化

### ✅ ページの実装確認

```typescript
export default function Page({ params }: PageProps) {
	const id = params.then(p => p.id); // ✅ Promise のまま

	return (
		<Suspense fallback={<Loading />}> {/* ✅ Suspense で囲む */}
			<Container id={id} />
		</Suspense>
	);
}
```

**確認項目:**
- [ ] `params` は Promise のまま渡す
- [ ] Container を `Suspense` で囲む
- [ ] `fallback` を設定

---

## よくある間違い

### ❌ 間違い1: "use cache" を忘れる

```typescript
// ❌ キャッシュされない
async function Container({ id }: { id: Promise<string> }) {
	const resolvedId = await id;
	const data = await getData(resolvedId);
	return <Presenter data={data} />;
}

// ✅ キャッシュされる
async function Container({ id }: { id: Promise<string> }) {
	"use cache";
	cacheLife("permanent");

	const resolvedId = await id;
	cacheTag(CACHE_TAGS.resource(resolvedId));

	const data = await getData(resolvedId);
	return <Presenter data={data} />;
}
```

### ❌ 間違い2: cacheTag を設定しない

```typescript
// ❌ updateTag で無効化できない
async function Container({ id }: { id: Promise<string> }) {
	"use cache";
	cacheLife("permanent");

	const data = await getData(id);
	return <Presenter data={data} />;
}

// ✅ タグで無効化できる
async function Container({ id }: { id: Promise<string> }) {
	"use cache";
	cacheLife("permanent");

	const resolvedId = await id;
	cacheTag(
		CACHE_TAGS.resource(resolvedId),
		CACHE_TAGS.resourceDelete(resolvedId),
	);

	const data = await getData(resolvedId);
	return <Presenter data={data} />;
}
```

### ❌ 間違い3: 削除用タグを設定しない

```typescript
// ❌ データが削除されたときにキャッシュが残り続ける
cacheTag(CACHE_TAGS.resource(id));

// ✅ データ削除時にもキャッシュが無効化される
cacheTag(
	CACHE_TAGS.resource(id),        // データ更新時に無効化
	CACHE_TAGS.resourceDelete(id),  // データ削除時に無効化
);
```

### ❌ 間違い4: revalidatePath を使用

```typescript
// ❌ Cache Components では revalidatePath は使わない
export async function updateAction(id: string, data: Data) {
	await db.update({ where: { id }, data });
	revalidatePath(`/posts/${id}`);
}

// ✅ updateTag を使用
export async function updateAction(id: string, data: Data) {
	await db.update({ where: { id }, data });
	updateTag(CACHE_TAGS.posts(id));
}
```

### ❌ 間違い5: cache() でラップしない

```typescript
// ❌ 同時リクエストが dedupe されない
// 同じページで複数箇所から呼ばれた場合、それぞれDBアクセスが発生
async function _getResource(id: string) {
	"use cache";
	cacheLife("permanent");
	return await db.resource.findUnique({ where: { id } });
}
export const getResource = _getResource;

// ✅ 同時リクエストが dedupe される
// 同じページで複数箇所から呼ばれても、1回のDBアクセスで済む
async function _getResource(id: string) {
	"use cache";
	cacheLife("permanent");
	return await db.resource.findUnique({ where: { id } });
}
export const getResource = cache(_getResource);
```

### ❌ 間違い6: Suspense で囲まない

```typescript
// ❌ エラーになる可能性
export default function Page({ params }: PageProps) {
	const id = params.then(p => p.id);
	return <Container id={id} />;
}

// ✅ Suspense で囲む
export default function Page({ params }: PageProps) {
	const id = params.then(p => p.id);
	return (
		<Suspense fallback={<Loading />}>
			<Container id={id} />
		</Suspense>
	);
}
```

### ❌ 間違い7: リスト表示で削除タグを設定しない

```typescript
// ❌ リソースが削除されてもリストのキャッシュが残る
async function PostListContainer({ userId }: { userId: Promise<string> }) {
	"use cache";
	cacheLife("permanent");

	const id = await userId;
	const posts = await getPosts(id);
	// データ更新用タグのみ設定
	cacheTag(CACHE_TAGS.posts(id));

	return <PostListPresenter posts={posts} />;
}

// ✅ リソースが削除されたらリストのキャッシュも無効化される
async function PostListContainer({ userId }: { userId: Promise<string> }) {
	"use cache";
	cacheLife("permanent");

	const id = await userId;
	const posts = await getPosts(id);
	// 各投稿の削除タグも設定
	cacheTag(
		CACHE_TAGS.posts(id),
		...posts.map(post => CACHE_TAGS.postDelete(post.id)),
	);

	return <PostListPresenter posts={posts} />;
}
```

### ❌ 間違い8: params を await してから渡す

```typescript
// ❌ Page コンポーネントで await するとエラー
export default async function Page({ params }: PageProps) {
	"use cache";
	const { id } = await params; // エラー！
	return <Container id={id} />;
}

// ✅ Promise のまま渡して Container で await
export default function Page({ params }: PageProps) {
	const id = params.then(p => p.id);
	return (
		<Suspense fallback={<Loading />}>
			<Container id={id} />
		</Suspense>
	);
}

async function Container({ id }: { id: Promise<string> }) {
	"use cache";
	cacheLife("permanent");

	const resolvedId = await id; // ここで await
	// ...
}
```

---

## まとめ

### 必須の設定

1. **next.config.js**: `cacheComponents: true` と `cacheLife` 設定
2. **cache-tags.ts**: タグの一元管理（データ更新用 + 削除用）
3. **Container**: `"use cache"` + `cacheLife` + `cacheTag`（データ更新用 + 削除用）
4. **データ取得関数**: `"use cache"` + `cacheLife` + `cacheTag` + `cache()`
5. **Server Action**: `updateTag`（`revalidatePath` 不可）

### キャッシュ戦略の選択

| 条件 | 戦略 | 無効化方法 |
|------|------|-----------|
| データ操作を完全に管理 | `cacheLife("permanent")` | `updateTag` |
| 外部データや管理不可 | `cacheLife("hours")` 等 | 自動（時間経過） |

### 実装の流れ

1. **セットアップ**
   - next.config.js 設定
   - cache-tags.ts 作成

2. **データ取得関数実装**
   - `"use cache"` + `cacheLife` + `cacheTag`
   - `cache()` でラップ

3. **Container 実装**
   - `"use cache"` + `cacheLife` + `cacheTag`
   - Promise を await
   - Presenter に渡す

4. **ページ実装**
   - params は Promise のまま
   - Suspense で Container を囲む

5. **Server Action 実装**
   - データ更新後 `updateTag` 呼び出し
   - 削除時は削除タグで一括無効化

### 重要なポイント

- **必ず2つのタグ**: データ更新用タグ + 削除用タグ（データ更新と削除の両方で適切にキャッシュを無効化するため）
- **Promise の扱い**: params は Promise のまま渡して Container で await
- **Suspense**: Container は必ず Suspense で囲む
- **updateTag**: revalidatePath ではなく updateTag を使う
- **cache()**: 同時に複数箇所から呼び出される可能性があるデータ取得関数は cache() でラップ（dedupe 対策）
- **notFound()**: データがない場合は notFound() を呼ぶ
