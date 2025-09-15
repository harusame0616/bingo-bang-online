export default async function Layout({ children }: LayoutProps<"/views">) {
	return (
		<div className="grow overflow-y-auto [scrollbar-gutter:stable] p-4">
			{children}
		</div>
	);
}
