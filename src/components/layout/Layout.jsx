import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="relative w-full h-screen flex flex-col ">
      {/* <div className="absolute w-full h-full bg-[url('/bg-wave-2.svg')] bg-cover bg-[position:bottom_140px] clip-[inset(43%_0_0_0)]"></div> */}
      {/* <img src="/public/bg-wave-3.svg" alt=""  className="absolute w-full -top-150 "/> */}
      <div className="relative ">
        {/* <Navbar /> */}
        <div className="absolute w-full h-screen z-1 overflow-hidden" >
          <img
            src="/bg-wave-2.svg"
            alt=""
            className="absolute w-full h-full object-cover -top-45 "
          />
          <div className="absolute w-full h-screen bg-custom-beige-1 top-150" ></div>
        </div>
        <main className="relative w-full h-screen z-10">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
