//  import { useNavigate, useLocation } from "react-router-dom";
//  import { FiHome, FiQrCode } from "react-icons/fi";

//  export default function Header() {
//    const navigate = useNavigate();
//    const location = useLocation();
//    const isHome = location.pathname === "/";

//    return (
//      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 animate-fadeIn">
//        <div
//          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
//          onClick={() => navigate("/")}
//        >
//          <div className="p-2 bg-white/20 rounded-full">
//            <FiQrCode className="text-white text-xl" />
//          </div>
//          <h1 className="text-xl font-bold text-white">
//            QR PDF Generator
//            <span className="text-xs font-normal ml-2 opacity-80">
//              HR Portal
//            </span>
//          </h1>
//        </div>

//        <div className="flex gap-3">
//          <button
//            onClick={() => navigate("/")}
//            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
//              isHome
//                ? "bg-white text-blue-600 shadow-md"
//                : "bg-white/10 text-white hover:bg-white/20"
//            }`}
//          >
//            <FiHome />
//            <span>Home</span>
//          </button>

//          {/* Uncomment when needed */}
//          {/* <button
//           onClick={() => navigate("scan-qr")}
//           className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 flex items-center gap-2 transition-all"
//         >
//           <FiQrCode />
//           <span>Scan QR</span>
//         </button> */}
//        </div>

//        <style jsx>{`
//          @keyframes fadeIn {
//            from {
//              opacity: 0;
//              transform: translateY(-10px);
//            }
//            to {
//              opacity: 1;
//              transform: translateY(0);
//            }
//          }
//          .animate-fadeIn {
//            animation: fadeIn 0.3s ease-out forwards;
//          }
//        `}</style>
//      </header>
//    );
//  }