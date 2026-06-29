import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      
      <main className="pt-16"> {/* push content below navbar */}
        {children}
      </main>

      <Footer />
    </>
  );
};

export default Layout;