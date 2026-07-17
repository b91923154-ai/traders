import { Link, useLocation } from "react-router-dom";
import { UserProfile } from "./ui/UserProfile";
import { MobileMenu } from "./MobileMenu";
import { isAdmin } from "../lib/admin";
import logoi from "../assets/logoi.png";

interface NavbarProps {
  session: any;
  handleLogout: () => void;
  isHome?: boolean;
}

export function Navbar({ session, handleLogout, isHome = false }: NavbarProps) {
  const location = useLocation();
  const getHref = (hash: string) => (isHome ? hash : `/${hash}`);

  const getLinkClass = (path: string) => {
    const isActive =
      location.pathname === path || (path === "/" && location.pathname === "/");
    return `text-sm font-medium transition-colors ${
      isActive ? "text-white" : "text-white/67 hover:text-white"
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] p-6 pt-8 pointer-events-auto">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 relative">
        <div className="flex items-center z-10">
          <a href={getHref("#home")} className="flex items-center">
            <img
              src={logoi}
              alt="T4 Trader"
              className="h-10 md:h-14 lg:h-16 w-auto object-contain transform origin-left"
            />
          </a>
        </div>

        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-10 bg-white/10 backdrop-blur-md border border-white/10 px-8 py-2 rounded-full shadow-lg z-10">
          <a href={getHref("#home")} className={getLinkClass("/")}>
            Home
          </a>
          <Link to="/course" className={getLinkClass("/course")}>
            Course
          </Link>
          {session && isAdmin(session.user?.email) && (
            <Link to="/dashboard" className={getLinkClass("/dashboard")}>
              Dashboard
            </Link>
          )}
          <a href={getHref("#team")} className={getLinkClass("/team")}>
            Team
          </a>
          <a href={getHref("#faq")} className={getLinkClass("/faq")}>
            FAQS
          </a>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4 z-10">
          {session ? (
            <UserProfile session={session} handleLogout={handleLogout} />
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-block text-xs font-medium bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 md:px-5 md:py-2 rounded-full text-white/80 hover:text-white transition-colors shadow-lg"
            >
              Register/Login
            </Link>
          )}

          <MobileMenu
            links={[
              { label: "Home", to: getHref("#home") },
              { label: "Course", to: "/course" },
              ...(session && isAdmin(session.user?.email)
                ? [{ label: "Dashboard", to: "/dashboard" }]
                : []),
              { label: "Team", to: getHref("#team") },
              { label: "FAQs", to: getHref("#faq") },
            ]}
          >
            {!session && (
              <Link
                to="/login"
                className="sm:hidden text-center text-sm font-medium bg-white/5 border border-white/10 px-4 py-3 rounded-full text-white/80 hover:text-white transition-colors"
              >
                Register/Login
              </Link>
            )}
          </MobileMenu>
        </div>
      </div>
    </nav>
  );
}
