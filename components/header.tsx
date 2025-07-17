'use client';

import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HeaderComponent() {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <Brain className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold">ResumeBolt</span>
                        </Link>
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <ThemeToggle />
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                            onClick={() => {
                                const menu = document.getElementById('mobile-menu');
                                if (menu) menu.classList.toggle('hidden');
                            }}
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="/#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                        <a href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
                        <a href="/#security" className="text-sm font-medium hover:text-primary transition-colors">Security</a>
                        <Link href="/privacy" className="text-sm font-medium hover:text-primary transition-colors">Privacy</Link>
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <SignedIn>
                            <div className="flex items-center space-x-4">
                                <UserButton />
                                <Link href='/dashboard'><Button size="sm">Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className="flex items-center space-x-4">
                                <Link href='/sign-in'><Button variant="ghost" size="sm">Sign In</Button></Link>
                                <Link href='/sign-up'><Button size="sm">Get Started</Button></Link>
                            </div>
                        </SignedOut>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            <div className="md:hidden hidden" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
                    <a href="/#features" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors">Features</a>
                    <a href="/#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors">How It Works</a>
                    <a href="/#security" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors">Security</a>
                    <Link href="/privacy" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors">Privacy</Link>
                    <div className="mt-2 space-y-2">
                        <SignedIn>
                            <div className='flex flex-col space-y-2'>
                            <Link href='/dashboard'><Button size="sm" className="justify-between">Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                            <SignOutButton />
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className='flex flex-col space-y-2'>
                            <Link href='/sign-in'><Button variant="ghost" size="sm">Sign In</Button></Link>
                            <Link href='/sign-up'><Button size="sm">Get Started</Button></Link>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </header>
    );
}