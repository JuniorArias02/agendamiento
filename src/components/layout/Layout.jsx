import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="relative w-full h-screen flex flex-col ">
      <div className="relative ">
        <Navbar />
        <div className="absolute w-full h-screen z-1 overflow-hidden" >
        </div>
        <main className="relative w-full h-screen z-10 pt-16">{children}</main>  
      </div>
    </div>
  );
};

export default Layout;