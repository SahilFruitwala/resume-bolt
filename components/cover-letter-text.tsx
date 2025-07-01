'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Briefcase, CheckCircle, File } from 'lucide-react';

interface CoverLetterInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function CoverLetterInput({ value, onChange }: CoverLetterInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const maxLength = 3000;
    const currentLength = value.length;
    const isValid = currentLength > 0 && currentLength <= maxLength;
    const isNearLimit = currentLength > maxLength * 0.8;

    const getCharacterCountColor = () => {
        if (currentLength > maxLength) return 'text-red-600';
        if (isNearLimit) return 'text-yellow-600';
        return 'text-gray-500';
    };

    const getStatusIcon = () => {
        if (currentLength === 0) return null;
        if (currentLength > maxLength) {
            return <AlertCircle className="h-4 w-4 text-red-600" />;
        }
        if (isValid) {
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        }
        return null;
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold flex items-center">
                    <File className="mr-2 h-6 w-6 text-primary" />
                    Enter Cover Letter Text
                </h2>
                {getStatusIcon()}
            </div>

            <div className="space-y-3">
                <div
                    className={`
        relative transition-all duration-200
        ${isFocused ? 'ring-2 ring-ring ring-opacity-50' : ''}
        `}
                >
                    <Textarea
                        placeholder="Paste the cover letter here"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`
          min-h-[300px] resize-none text-sm leading-relaxed
          ${currentLength > maxLength ? 'border-destructive focus:border-destructive' : ''}
        `}
                        maxLength={maxLength + 100}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className={`text-sm font-medium ${getCharacterCountColor()}`}>
                            {currentLength.toLocaleString()} / {maxLength.toLocaleString()} characters
                        </span>

                        {currentLength > 0 && (
                            <Badge
                                variant={isValid ? "default" : "destructive"}
                                className="text-xs"
                            >
                                {isValid ? 'Valid' : 'Too long'}
                            </Badge>
                        )}
                    </div>

                    {isNearLimit && currentLength <= maxLength && (
                        <span className="text-xs text-warning font-medium">
                            Approaching limit
                        </span>
                    )}

                    {currentLength > maxLength && (
                        <span className="text-xs text-destructive font-medium">
                            Exceeds limit by {(currentLength - maxLength).toLocaleString()} characters
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
}