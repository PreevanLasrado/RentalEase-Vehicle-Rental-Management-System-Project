import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f0e6]">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="flex-1 pt-20">
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;