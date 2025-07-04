import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message }: { message?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            {message && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Loading analysis details...
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
