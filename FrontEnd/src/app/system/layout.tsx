"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
// use <img> for avatars to preserve animated GIFs
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import ButtonLogoff from "@/components/system/ButtonLogoff";
import WelcomeModal from "@/components/system/WelcomeModal";
import { useUser } from "@/contexts/UserContext";
import { 
  LayoutDashboard, 
  Printer, 
  Users, 
  Monitor, 
  Clock, 
  Wifi,
  ChevronDown,
  Home,
  LogOut 
} from "lucide-react";

/* ===================== TYPES ===================== */

type Props = {
  children: ReactNode;
};

/* ===================== ANIMATIONS ===================== */

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: -12,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -12,
    filter: "blur(4px)",
    transition: {
      duration: 0.2,
    },
  },
};

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1 },
  }),
};

/* ===================== COMPONENT ===================== */

export default function Layout({ children }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Mostrar modal de boas-vindas apenas uma vez na sessão
  useEffect(() => {
    if (user && !hasSeenWelcome) {
      const welcomeShown = sessionStorage.getItem("welcomeShown");
      if (!welcomeShown) {
        setShowWelcome(true);
        sessionStorage.setItem("welcomeShown", "true");
        setHasSeenWelcome(true);
      }
    }
  }, [user, hasSeenWelcome]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigationItems = [
    { 
      label: "Home", 
      href: "/system/home", 
      icon: Home 
    },
    { 
      label: "Computadores", 
      href: "/system/gerenciadordetelas", 
      icon: Monitor 
    },
    { 
      label: "Impressoras", 
      href: "/system/gerenciadordeimpressora", 
      icon: Printer 
    },
    { 
      label: "Usuários", 
      href: "/system/gerenciadordeusuarios", 
      icon: Users 
    },
  ];

  const dropdownItems = [
    { 
      label: "Gerenciar Perfil", 
      href: "/system/gerenciadordeusuarios", 
      icon: Users 
    },
    { 
      label: "Computadores", 
      href: "/system/gerenciadordetelas", 
      icon: Monitor 
    },
    { 
      label: "Impressoras", 
      href: "/system/gerenciadordeimpressora", 
      icon: Printer 
    },
    { 
      label: "Máquina na Rede", 
      href: "/system/telademanutencao", 
      icon: Wifi 
    },
    { 
      label: "Histórico", 
      href: "/system/historicodoscomputadores", 
      icon: Clock 
    },
  ];

  const displayName = user?.displayName || user?.user_name || user?.name || "Usuário";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 shadow-2xl border-b border-blue-600/30 backdrop-blur-sm">
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/system/home"
            className="flex items-center gap-3 text-2xl font-extrabold text-white tracking-wide hover:text-blue-200 transition-colors duration-300 group"
          >
            <div className="p-2 bg-white/10 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <span className="leading-tight">
              <span className="block">Gerenciamento</span>
              <span className="block text-sm font-medium text-white/90">de Computadores</span>
            </span>
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.li 
                  key={item.href}
                  custom={idx}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative group"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 group/link"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-blue-300 to-indigo-300 transition-all group-hover/link:w-full" />
                </motion.li>
              );
            })}
          </ul>

          {/* Avatar & Dropdown */}
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 group"
            >
                <div className="relative">
                <img
                  src={
                    user?.path_img
                      ? (user.path_img.startsWith("http") ? user.path_img : `/api/uploads?path=${encodeURIComponent(user.path_img)}`)
                      : "/images/default.jpg"
                  }
                  width={36}
                  height={36}
                  alt="Perfil"
                  className="rounded-full object-cover border-2 border-white/30"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-blue-200">
                  {user?.email ? user.email.split("@")[0] : "Usuário"}
                </p>
              </div>

              <ChevronDown 
                className={`w-4 h-4 text-blue-200 transition-transform duration-300 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            {/* ===================== DROPDOWN ===================== */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-4 w-72 rounded-2xl bg-gradient-to-br from-white to-slate-50 text-slate-800 shadow-2xl ring-1 ring-slate-200 overflow-hidden"
                >
                  {/* User Info Card */}
                  <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b border-slate-200">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          user?.path_img
                            ? (user.path_img.startsWith("http") ? user.path_img : `/api/uploads?path=${encodeURIComponent(user.path_img)}`)
                            : "/images/default.jpg"
                        }
                        width={48}
                        height={48}
                        alt="Perfil"
                        className="rounded-full object-cover border-3 border-white/30"
                      />
                      <div>
                        <p className="font-bold text-lg">{displayName}</p>
                        <p className="text-sm text-blue-100">{user?.email || "sem@email.com"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="px-2 py-3 space-y-1">
                    <p className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Gerenciamento
                    </p>
                    {dropdownItems.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group/link"
                          >
                            <Icon className="w-5 h-5 text-blue-600 group-hover/link:scale-110 transition-transform" />
                            <span className="font-medium flex-1">{item.label}</span>
                            <div className="w-2 h-2 rounded-full bg-blue-400 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-200 px-2 py-3">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <ButtonLogoff />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>

      {/* ===================== CONTENT ===================== */}
      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-6 overflow-auto"
      >
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-screen">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-500 rounded-full"
              />
            </div>
          ) : (
            children
          )}
        </div>
      </motion.main>

      {/* ===================== WELCOME MODAL ===================== */}
      <AnimatePresence>
        {showWelcome && user && (
          <WelcomeModal
            userName={user.displayName || user.user_name || user.name || "Usuário"}
            userEmail={user.email || ""}
            userImage={user.path_img}
            onClose={() => setShowWelcome(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
