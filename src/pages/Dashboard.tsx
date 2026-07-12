import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 break-words max-w-full">
        Welcome {session?.user.email}
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}