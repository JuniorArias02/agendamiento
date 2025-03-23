import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	return (
		<div className="w-full flex items-center justify-center h-full">
			<div className="flex flex-col items-center justify-center  p-5">
				<h1 className="montserrat-bold text-5xl text-white text-custom-marron-1">Agenda tu cita</h1>
				<input
					type="button"
					value="Continuar"
					className="btn-continuar bg-custom-beige-2 text-white mt-15 font-bold py-2 px-6 cursor-pointer transition duration-300"
					onClick={() => navigate("/agenda")} 
				/>
			</div>
		</div>
	);
}

