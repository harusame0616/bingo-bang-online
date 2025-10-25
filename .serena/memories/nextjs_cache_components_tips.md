# Next.js 16 Cache Components Tips

## 前提条件

- Next.js 16以降
- `next.config.js` に `cacheComponents: true` を設定

## 基本原則

### 1. `'use cache'` ディレクティブの配置

Layout/Page全体にキャッシュを適用する場合、**Layout/Page関数の先頭**に配置：

```typescript
export default function Layout({ children, params }: LayoutProps) {
  "use cache";
  
  // ...
}
```

### 2. `params` / `searchParams` の取り扱い（重要！）

❌ **間違い：Suspense境界外で直接await**
```typescript
export default async function Layout({ children, params }: LayoutProps) {
  "use cache";
  const { id } = await params; // ❌ エラー！
  
  return <div>...</div>;
}
```

✅ **正しい：Promiseのまま変換して子コンポーネントに渡す**
```typescript
export default function Layout({ children, params }: LayoutProps) {
  "use cache";
  const id = params.then(p => p.id); // ✅ Promiseのまま
  
  return (
    <Suspense fallback={<Skeleton />}>
      <Container id={id} />
    </Suspense>
  );
}

async function Container({ id }: { id: Promise<string> }) {
  const resolvedId = await id; // ✅ Suspense内でawait
  // ...
}
```

### 3. Suspense境界の配置

- `'use cache'` を持つasync関数は**必ずSuspense境界で囲む**
- Layout/Pageで`params`をPromiseとして渡し、子コンポーネント（Suspense内）でawait

```typescript
<Suspense fallback={<Skeleton />}>
  <AsyncContainer data={promiseData} />
</Suspense>
```

## キャッシュの仕組み

### キャッシュキー（公式ドキュメントより）

> "The cached entry is reused when serialized props remain consistent across instances."

- `'use cache'` が付いたコンポーネントは、**シリアライズされたpropsが一貫している場合**にキャッシュエントリが再利用される
- **`children` prop はキャッシュキーの一部にならない**（公式："non-serializable arguments like `children` are passed through without becoming part of the cache key"）
  - → 親コンポーネントがキャッシュされても、子コンポーネントは動的にレンダリング可能

**例：**
```typescript
// type="haircut" でキャッシュされ、同じ type の場合は再利用される
export async function Bookings({ type = 'haircut' }: BookingsProps) {
  'use cache'
  const data = await fetch(`/api/bookings?type=${encodeURIComponent(type)}`)
  return //...
}
```

### 動的データの渡し方

公式ドキュメントのパターン：

```typescript
// Page: 動的データを children として渡す
export default async function Page() {
  const uncachedData = await getData()
  return (
    <CacheComponent>
      <DynamicComponent data={uncachedData} />
    </CacheComponent>
  )
}

// キャッシュされるコンポーネント
async function CacheComponent({ children }: { children: ReactNode }) {
  'use cache'
  const cachedData = await fetch('/api/cached-data')
  return (
    <div>
      <PrerenderedComponent data={cachedData} />
      {children}
    </div>
  )
}
```

### cacheLife（オプション）

キャッシュの有効期限を制御（省略可能）：

```typescript
"use cache";
cacheLife("days");  // 数日間キャッシュ
// または
cacheLife("hours"); // 数時間キャッシュ
// または
cacheLife({ stale: 3600, revalidate: 900, expire: 86400 }); // カスタム
```

- デフォルトのキャッシュ動作で十分な場合は省略してOK

### cacheTag（オプション）

キャッシュの無効化タグを設定：

```typescript
"use cache";
cacheTag('my-tag');
```

- `revalidateTag('my-tag')` で特定のタグのキャッシュを無効化できる

## よくあるエラーと対処法

### エラー: "Uncached data was accessed outside of <Suspense>"

**原因：** Suspense境界外で`params`や動的データをawaitしている

**対処法：**
1. `params.then()` でPromiseのまま変換
2. 子コンポーネントでawait
3. 子コンポーネントをSuspenseで囲む

### エラー: "Route blocking"

**原因：** Layoutで直接`await params`を実行

**対処法：** 上記と同じ

## パターン例

### 基本パターン

```typescript
// Layout: 'use cache'を適用、paramsをPromiseとして渡す
export default function Layout({ children, params }: LayoutProps) {
  "use cache";
  
  const id = params.then(p => p.id);
  
  return (
    <div>
      {children}
      <Suspense fallback={<Skeleton />}>
        <DataContainer id={id} />
      </Suspense>
    </div>
  );
}

// Container: Promiseを受け取り、awaitして解決
async function DataContainer({ id }: { id: Promise<string> }) {
  const resolvedId = await id;
  const data = await fetchData(resolvedId);
  
  return <DataPresenter data={data} />;
}

// Presenter: 表示のみ
function DataPresenter({ data }: { data: Data }) {
  return <div>{data.name}</div>;
}

// Skeleton
function Skeleton() {
  return <div>Loading...</div>;
}
```

### Page全体をキャッシュ

```typescript
'use cache'

async function Users() {
  const users = await fetch('/api/users')
  // loop through users
}

export default function Page() {
  return (
    <main>
      <Users />
    </main>
  )
}
```

## まとめ

1. ✅ Layout/Pageに `"use cache"` を配置
2. ✅ `params` は `params.then()` でPromiseのまま変換
3. ✅ 子コンポーネントでPromiseをawait
4. ✅ async関数はSuspenseで囲む
5. ✅ `cacheLife` / `cacheTag` は必要に応じて使用（省略可能）
6. ✅ キャッシュキーは「シリアライズされたpropsが一貫している場合」に再利用される（公式）
7. ✅ `children` はキャッシュキーに含まれない（公式）
