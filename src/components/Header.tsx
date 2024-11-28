import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'
import Link from 'next/link'

const Header = () => {
  return (
    <div>
        <div className='flex justify-between items-center gap-4 max-w-5xl mx-auto mt-7'>
            <p className='font-bold'>
                <Link href={'/dashboard'} className='text-lg'>
                ZenPay Invoice
                </Link>
            </p>
            <div>
            <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
            </div>
        </div>
    </div>
  )
}

export default Header
