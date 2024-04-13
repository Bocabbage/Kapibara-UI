interface ButtonProps {
  text: string;
  onClick: () => void;
}

export const KButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <>
      <button
        className="
				bg-zinc-600 
				text-white hover:bg-slate-400 m-2 
				justify-center rounded px-3 py-1.5
				text-sm font-bold leading-6 
				shadow-sm 
				focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};
