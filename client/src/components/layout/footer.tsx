import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Elevated</h3>
            <p className="text-gray-400">Empowering learners worldwide with high-quality education and cutting-edge technology.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Courses</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Web Development</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Data Science</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Mobile Development</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Cloud Computing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Community</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">support@elevated.com</li>
              <li className="text-gray-400">+1 (555) 123-4567</li>
              <li className="text-gray-400">123 Learning St, Education City</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-center">© {new Date().getFullYear()} Elevated. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
