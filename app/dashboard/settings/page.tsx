'use client'

import LoadingSpinner from "@/components/loading-spinner";
import { UserProfile, useUser } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import { useTheme } from "next-themes";


export default function UserPage() {
    const { theme } = useTheme();
    const { isLoaded } = useUser()

    if (!isLoaded) {
        return <LoadingSpinner />
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* <div
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences
                </p>
            </div> */}
            <UserProfile
                path="/dashboard/settings"
                appearance={{
                    baseTheme: theme === 'dark' ? dark : undefined,
                }} />
        </div>
    )
}