import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 border-t border-gray-700">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Scholar Connect. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition">
            Contact
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
