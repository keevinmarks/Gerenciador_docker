"use client";
// Isso garante que o componente seja renderizado no lado do cliente (necessário em apps Next.js 13+ com app directory)

import { deleteCookies } from "@/actions/deleteCookies";
import { useUser } from "@/contexts/UserContext";


const ButtonLogoff = () => {
  const { clearUserCache } = useUser();
    
  /**
   * Função chamada quando o usuário clica no botão.
   * Responsável por apagar os cookies (encerrando a sessão do usuário).
   */
  const handleLogoff = async () => {
    try {
      // Limpe o cache do usuário
      clearUserCache();
      
      // Limpe o sessionStorage de boas-vindas
      sessionStorage.removeItem("welcomeShown");
      
      await deleteCookies(); // Chama a ação que limpa os cookies
      // Redirecionar após logout (opcional)
      // window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao tentar sair:", error);
    }
  };

  return (
    <button
      onClick={handleLogoff}
      className="w-full bg-gradient-to-r from-red-500 to-red-600
                 hover:from-red-600 hover:to-red-700 
                 text-white font-semibold py-2 px-6 
                 rounded-xl shadow-md 
                 hover:shadow-lg 
                 transition-all duration-200 
                 active:scale-95"
    >
      🚪 Sair
    </button>
  );
};

export default ButtonLogoff;
