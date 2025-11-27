export function DemoInfoCard({ title, description, highlight }) {
	return (
		<div className="flex flex-col gap-4 text-left p-10 border-2 border-[#E5E5E7]">
			<h2 className="font-bold text-2xl text-[#333333] w-full">{title}</h2>
			<p className='whitespace-pre-line w-full text-regular text-lg text-[#666666]'><span className="font-bold">{highlight}</span>{description}</p>
		</div>
	)
}
