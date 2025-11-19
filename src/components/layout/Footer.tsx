import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/numl-logo-official.png"
                alt="NUML Logo"
                className="w-10 h-10 object-contain rounded-full"
              />
              <span className="text-xl font-bold">Sports Hub</span>
            </div>
            <p className="text-gray-400">
              The ultimate sports platform for NUML university students.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/achievements" className="hover:text-white transition-colors">Achievements</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/sports-health" className="hover:text-white transition-colors">Sports & Health</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Teams</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Guidelines</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Facebook</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Twitter</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Instagram</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">LinkedIn</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 NUML Sports Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}