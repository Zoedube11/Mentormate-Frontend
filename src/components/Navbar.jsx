import LogoImg from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md flex justify-between items-center px-6 py-3">
      <div className="flex items-center">
        <a href="/" className="flex items-center">
          <img src={LogoImg} alt="Logo" className="h-16 mr-3" />
        </a>
      </div>

       <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg hidden group-hover:block">
            <div className="p-2 border-b">
              <div className="font-semibold">User Name</div>
              <div className="text-sm text-gray-600">user@example.com</div>
            </div>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>
          </div>
    </nav>
  );
}

