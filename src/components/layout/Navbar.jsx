
import {UserRound} from 'lucide-react';

 function Navbar() {
	return (
		<nav className="w-full h-18  flex items-center justify-end p-4 bg-custom-green-1 ">
			<div className="flex justify-center">
			<h1 className=" text-black text-2xl mr-4 montserrat-regular cursor-pointer">Junior Arias</h1>
			<UserRound size={30} className="mr-3 cursor-pointer" />
			</div>

		</nav>
	);

}	

export default Navbar;