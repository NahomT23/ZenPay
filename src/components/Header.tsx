// import {
//     ClerkProvider,
//     SignInButton,
//     SignedIn,
//     SignedOut,
//     UserButton
//   } from '@clerk/nextjs'
// import Link from 'next/link'

// const Header = () => {
//   return (
//     <div>
//         <div className='flex justify-between items-center gap-4 max-w-5xl mx-auto mt-7'>
//             <p className='font-bold'>
//                 <Link href={'/dashboard'} className='text-lg'>
//                 ZenPay Invoice
//                 </Link>
//             </p>
//             <div>
//             <SignedOut>
//             <SignInButton />
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Header



import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="w-full bg-white shadow py-4 px-6">
      <div className="flex flex-wrap justify-between items-center max-w-5xl mx-auto">
        <p className="text-lg font-bold">
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            ZenPay Invoice
          </Link>
        </p>
        <div className="mt-4 md:mt-0 flex items-center">
          <Button>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
