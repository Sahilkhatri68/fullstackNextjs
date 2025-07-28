export default function AboutPage() {
  // About page component with project information
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">About This Project</h1>
      <ul className="list-disc list-inside space-y-3 text-lg text-gray-800">
        <li><span className="font-semibold text-blue-700">Project Setup:</span> Initialized with Next.js, TypeScript, Tailwind CSS, and ESLint for a modern full-stack environment.</li>
        <li><span className="font-semibold text-blue-700">Authentication:</span> Implemented secure login and registration using NextAuth, with JWT-based sessions and password hashing.</li>
        <li><span className="font-semibold text-blue-700">Google OAuth:</span> Integrated Google sign-in for easy third-party authentication.</li>
        <li><span className="font-semibold text-blue-700">Protected Routes:</span> Dashboard and other sensitive pages are accessible only to authenticated users.</li>
        <li><span className="font-semibold text-blue-700">Password Reset:</span> Users can request password reset links and securely update their passwords.</li>
        <li><span className="font-semibold text-blue-700">Responsive Navbar:</span> Clean, mobile-friendly navigation bar with hamburger menu for small screens.</li>
        <li><span className="font-semibold text-blue-700">Dashboard UI:</span> Professional dashboard with sample bar and line charts (Chart.js) and fake stock data cards.</li>
        <li><span className="font-semibold text-blue-700">Modern UI/UX:</span> Attractive, accessible design using Tailwind CSS and best practices for user experience.</li>
        <li><span className="font-semibold text-blue-700">MongoDB Integration:</span> User data and authentication stored securely in MongoDB.</li>
        <li><span className="font-semibold text-blue-700">API Routes:</span> RESTful API endpoints for authentication, registration, password reset, and more.</li>
      </ul>
      <p className="mt-8 text-center text-gray-500 text-sm">This project demonstrates a robust, production-ready full-stack application using Next.js 15.</p>
    </div>
  );
} 