

interface ButtonProps {
	text: string,
	onClick: () => void
}

export const Button: React.FC<ButtonProps> = ({text, onClick}) => {
    return <>
			<button className="
				m-2 
				justify-center rounded bg-zinc-600 
				px-3 py-1.5 text-sm leading-6
				text-white shadow-sm hover:bg-slate-400 
				focus-visible:outline 
				focus-visible:outline-2 focus-visible:outline-offset-2 font-bold"
				onClick={onClick}
			>
				{text}
			</button>
    </>
}