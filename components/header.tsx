import { Button } from '@/components/ui/button';
import { Brain, ArrowRight,} from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
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
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="/#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                        <a href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
                        <a href="/#security" className="text-sm font-medium hover:text-primary transition-colors">Security</a>
                        <Link href="/privacy" className="text-sm font-medium hover:text-primary transition-colors">Privacy</Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <SignedIn>
                            <div className="flex items-center space-x-4">
                                <UserButton />
                                <Link href='/dashboard'><Button size="sm">Dasboard <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
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
        </header>
    );
}