import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export interface MobileNavLink {
  label: string;
  to: string;
}

interface MobileMenuProps {
  links: MobileNavLink[];
  children?: React.ReactNode;
}

/**
 * Hamburger + slide-in drawer used on screens below the `lg` breakpoint,
 * where the desktop pill navigation (hidden lg:flex) is not rendered.
 */
export function MobileMenu({ links, children }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-[82%] max-w-xs bg-[#060f08] border-l border-white/10 z-[100] flex flex-col p-6 pt-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="text-2xl font-serif text-white tracking-wide flex items-start">
                  T<span className="text-base font-sans mt-0.5 ml-0.5">4</span>
                  Trader
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {links.map((link) =>
                  link.to.startsWith("#") ? (
                    <a
                      key={link.label}
                      href={link.to}
                      onClick={() => setOpen(false)}
                      className="text-xl font-serif text-white/90 hover:text-primary transition-colors py-2.5 border-b border-white/5"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="text-xl font-serif text-white/90 hover:text-primary transition-colors py-2.5 border-b border-white/5"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </nav>

              {children && (
                <div
                  className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3"
                  onClick={() => setOpen(false)}
                >
                  {children}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
