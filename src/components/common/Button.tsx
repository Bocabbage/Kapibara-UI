interface ButtonProps {
  text: string;
  onClick: () => void;
}

export const KButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <>
      <button
        className="
				justify-center
				rounded bg-groovyfunk-4
				px-4 font-worksans-bold text-sm
				text-white shadow-sm
				hover:bg-guavaguava-5
				focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};
