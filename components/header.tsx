"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { CurrencySelector } from "@/components/currency-selector";
import { getArabicText } from "@/lib/text-utils";
import {
  getUser as apiGetUser,
  logout as apiLogout,
  type StoredUser,
} from "@/lib/api";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);

  // Static typed navigation menu
  type MenuItem = {
    id: string;
    label: { ar: string; en: string };
    href: string;
  };
  const mainMenu: MenuItem[] = [
    { id: "home", label: { ar: "الصفحة الرئيسية", en: "Home" }, href: "/" },
    { id: "about", label: { ar: "من نحن", en: "About" }, href: "/about" },
    {
      id: "services",
      label: { ar: "خدماتنا", en: "Services" },
      href: "/services",
    },
    { id: "blog", label: { ar: "المدونة", en: "Blog" }, href: "/blog" },
    { id: "faq", label: { ar: "الأسئلة الشائعة", en: "FAQ" }, href: "/faq" },
    {
      id: "contact",
      label: { ar: "تواصل معنا", en: "Contact" },
      href: "/contact",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Disabled server-side tracking - no server required
    // Track page views locally or with analytics service if needed
    const path =
      pathname ||
      (typeof window !== "undefined" ? window.location.pathname : "/");
    // Page visit tracked
  }, [pathname]);

  useEffect(() => {
    setUser(apiGetUser());
  }, []);

  const handleLogout = () => {
    apiLogout();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[rgba(154,137,155,0.65)]   backdrop-blur-[15px] backdrop-saturate-[1.5] "
          : "z-[1000]"
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-24 items-center justify-between">
          {/* Logo - Right side for RTL with spacing from edge */}
          <div className="flex items-center mr-0 sm:mr-3 lg:mr-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/LOGO.png"
                alt="بصمة تصميم"
                width={120}
                height={120}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1 text-base">
              {mainMenu.map((item: MenuItem, idx: number, arr: MenuItem[]) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Link
                    href={item.href}
                    className="whitespace-nowrap font-bold text-[#7a4db3] hover:!text-[#4B2E83] transition-all duration-300 arabic-text px-2 xl:px-3 py-1.5 relative group hover:scale-105"
                  >
                    <span className="relative z-10 text-[#7a4db3]">
                      {getArabicText(item.label)}
                    </span>
                    <div className="absolute inset-0 bg-[#4B2E83]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                  </Link>
                  {idx < arr.length - 1 && (
                    <span className="text-muted-foreground">|</span>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Actions - Left side for RTL */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Currency Selector */}
            <div className="scale-90 origin-center">
              <CurrencySelector size="sm" />
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] hover:from-[#7a4db3] hover:to-[#4B2E83] font-bold arabic-text text-base px-4 py-2 h-auto shadow-lg hover:shadow-xl transition-all duration-300 "
            >
              <Link href="/order" className="text-white">
                <span className="text-white">اطلب خدمة</span>
              </Link>
            </Button>
            {!user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] hover:from-[#7a4db3] hover:to-[#4B2E83] font-bold arabic-text text-base px-4 py-2 h-auto shadow-lg hover:shadow-xl transition-all duration-300 "
                >
                  <Link href="/login" className="text-white">
                    <span className="text-white">تسجيل الدخول</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] hover:from-[#7a4db3] hover:to-[#4B2E83] font-bold arabic-text text-base px-4 py-2 h-auto shadow-lg hover:shadow-xl transition-all duration-300 "
                >
                  <Link href="/signup" className="text-white">
                    <span className="text-white">حساب جديد</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="arabic-text font-bold hover:bg-[#4B2E83]/10 !text-white"
                >
                  <Link href="/profile" style={{ color: "#fff !important" }}>
                    <span style={{ color: "#fff !important" }}>صفحتي</span>
                  </Link>
                </Button>
                <span className="text-md !text-[#7a4db3] arabic-text">
                  مرحبًا، {user.name?.split(" ")[0] || "مستخدم"}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] hover:from-[#7a4db3] hover:to-[#4B2E83] font-bold arabic-text text-base px-4 py-2 h-auto shadow-lg hover:shadow-xl transition-all duration-300 text-white"
                >
                  تسجيل الخروج
                </Button>
              </>
            )}
          </div>

          {/* Mobile Controls: Currency + Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="scale-90 origin-center">
              <CurrencySelector size="sm" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col gap-4 p-6">
              {mainMenu.map((item: MenuItem) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-lg font-bold text-[#7a4db3]  hover:!text-[#4B2E83] transition-all duration-300 arabic-text py-2 relative group hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10 text-[#7a4db3]">
                    {getArabicText(item.label)}
                  </span>
                  <div className="absolute inset-0 bg-[#4B2E83]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                </Link>
              ))}
              <Button
                asChild
                className="bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] hover:from-[#7a4db3] hover:to-[#4B2E83] font-bold arabic-text w-full text-lg py-3 h-auto mt-4 shadow-lg hover:shadow-xl transition-all duration-300 "
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/order" className="text-white">
                  <span className="text-white">اطلب خدمة</span>
                </Link>
              </Button>
              {!user ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    className="bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] hover:from-[#7a4db3] hover:to-[#4B2E83] font-bold arabic-text w-full text-lg py-3 h-auto mt-4 shadow-lg hover:shadow-xl transition-all duration-300 "
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/login" className="text-white">
                      <span className="text-white">تسجيل الدخول</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] hover:from-[#7a4db3] hover:to-[#4B2E83] font-bold arabic-text w-full text-lg py-3 h-auto mt-4 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/signup" className="text-white">
                      <span className="text-white">حساب جديد</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    className="bg-gradient-to-r from-[#4B2E83] to-[#7a4db3] hover:from-[#7a4db3] hover:to-[#4B2E83] font-bold arabic-text w-full text-lg py-3 h-auto mt-4 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#4B2E83]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/profile" className="text-white">
                      <span className="text-white">صفحتي</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="arabic-text font-bold  hover:!text-[#4B2E83] hover:bg-[#4B2E83]/10"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    تسجيل الخروج
                  </Button>
                </div>
              )}
              <div className="border-t pt-4 mt-4" />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
