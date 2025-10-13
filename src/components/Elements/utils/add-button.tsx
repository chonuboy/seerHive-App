import Link from 'next/link';

export default function AddNewButton({title,url}:{title:string,url:string}) {
	return (
		<Link
			href={`/candidates/${url}`}
			className="bg-cyan-500 text-white px-4 py-1 rounded-md hover:bg-cyan-600 transition duration-200"
		>
			<span className="hidden md:block">{title}</span>{' '}
			<span className="md:hidden">+</span>
		</Link>
	);
}
