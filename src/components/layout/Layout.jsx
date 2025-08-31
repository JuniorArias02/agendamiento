import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16 lg:pt-0 lg:ml-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;