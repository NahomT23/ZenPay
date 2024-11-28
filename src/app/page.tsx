
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="flex flex-col justify-center items-center h-screen text-center max-w-5xl mx-auto">
//       <h1 className="text-5xl font-bold mb-6">
//         PayZen
//       </h1>
//       <p>
//         <Button asChild>
//           <Link href="/dashboard">
//             SignIn
//           </Link>
//         </Button>
//       </p>
//     </main>
//   );
// }


import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mt-20 flex flex-col justify-center items-center h-screen text-center max-w-5xl mx-auto px-4">
      <h1 className="mt-10 text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
        Welcome to PayZen
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl">
        Simplify your invoicing and payments with PayZen – your trusted platform for managing finances effortlessly. 
        Stay organized, save time, and focus on growing your business.
      </p>
      

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard">
            Get Started
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="#features">
            Learn More
          </Link>
        </Button>
      </div>

      <section
        id="features"
        className="mt-20 text-left w-full px-4 space-y-12"
      >
        <h2 className="text-4xl font-semibold text-gray-800">Why Choose PayZen?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold text-blue-600">Effortless Invoicing</h3>
            <p className="text-gray-600 mt-2">
              Create and manage invoices in just a few clicks with our intuitive interface.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold text-green-600">Secure Payments</h3>
            <p className="text-gray-600 mt-2">
              Accept payments securely with robust encryption and trusted integrations.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold text-yellow-600">Real-Time Analytics</h3>
            <p className="text-gray-600 mt-2">
              Gain insights into your business performance with detailed analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-gray-600 text-sm">
        © {new Date().getFullYear()} PayZen. All rights reserved.
      </footer>
    </main>
  );
}
