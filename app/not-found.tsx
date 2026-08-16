import React from "react";
import Link from "next/link";
import { Sparkles, Home, ArrowLeft, Heart, Gem, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-32 flex items-center justify-center min-h-[70vh]">
      <Container size="md" className="text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-900 border border-gold-500/40 text-gold-300 shadow-2xl mx-auto">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-gold-700 font-bold">
            404 — Page Not Found
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-900 leading-tight">
            The Page You Are Looking For Does Not Exist
          </h1>
          <p className="text-sm sm:text-base text-brand-700 max-w-md mx-auto leading-relaxed">
            The design or catalog item you are looking for may have been moved or updated. Explore our popular sections below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/">
            <Button variant="gold" size="lg" leftIcon={<Home className="w-5 h-5" />}>
              Back to Home
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="secondary" size="lg" leftIcon={<Heart className="w-5 h-5" />}>
              Mehendi Services
            </Button>
          </Link>
          <Link href="/jewellery">
            <Button variant="secondary" size="lg" leftIcon={<Gem className="w-5 h-5" />}>
              Rental Jewellery
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
