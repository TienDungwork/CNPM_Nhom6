import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-8 text-gray-600">
          <Link to="/privacy" className="hover:text-[#00C78C] transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-[#00C78C] transition-colors">
            Terms
          </Link>
          <Link to="/contact" className="hover:text-[#00C78C] transition-colors">
            Contact
          </Link>
          <Link to="/about" className="hover:text-[#00C78C] transition-colors">
            About Us
          </Link>
        </div>
        <div className="text-center mt-4 text-gray-500">
          © 2025 HealthyColors. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
