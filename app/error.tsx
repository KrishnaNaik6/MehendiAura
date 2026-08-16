"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="py-20 sm:py-32 flex items-center justify-center min-h-[70vh]">
      <Container size="md" className="text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-600 shadow-xl mx-auto">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-red-700 font-bold">
            Unexpected System Error
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-900 leading-tight">
            Something Went Wrong
          </h1>
          <p className="text-sm text-brand-700 max-w-md mx-auto leading-relaxed">
            We encountered a temporary server error. Please click 'Try Again' or return to the home page.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button variant="gold" size="lg" onClick={() => reset()} leftIcon={<RefreshCw className="w-5 h-5" />}>
            Try Again
          </Button>
          <Link href="/">
            <Button variant="secondary" size="lg" leftIcon={<Home className="w-5 h-5" />}>
              Back to Home Page
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
