export default function ContentHeader({ title }: { title: string }) {
	return (
		<header className="w-full flex justify-between items-center bg-(var(--content-background))  py-4 mb-4 z-10 cts-content-header">
			<h1 className={`text-2xl font-semibold text-(var(--foreground))`}>{title}</h1>
		</header>
	);
}