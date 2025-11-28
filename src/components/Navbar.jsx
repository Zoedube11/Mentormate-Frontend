import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoImg from "../assets/logo.png";
import Loader from "./Loader";

export default function Navbar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGetStarted = () => {
    if (isMobile) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/auth"); 
      }, 1200);
    } else {
      console.log("Desktop view: do nothing");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <nav className="w-full bg-white shadow-md flex justify-between items-center px-6 py-3 relative z-10">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img src={LogoImg} alt="Logo" className="h-16 mr-3" />
          </a>
        </div>

        
        {isMobile && (
          <div className="flex items-center space-x-3">
            {/* <button
              onClick={handleGetStarted}
              className="group relative overflow-hidden rounded-full border-2 border-[#074f8a] bg-[#074f8a] px-4 py-1 font-bold uppercase transition-all duration-200"
            >
              <span className="relative z-10 text-[#3cd9ed] transition-colors duration-200 group-hover:text-[#074f8a]">
                Get Started
              </span>
            </button> */}
          </div>
        )}
      </nav>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import LogoImg from "../assets/logo.png";

// export default function Navbar() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <nav className="w-full bg-white shadow-md flex justify-between items-center px-6 py-3 relative z-10">
//       <div className="flex items-center">
//         <a href="/" className="flex items-center">
//           <img src={LogoImg} alt="Logo" className="h-16 mr-3" />
//         </a>
//       </div>
//       {/* Removed Get Started button for both mobile & desktop */}
//     </nav>
//   );
// }


