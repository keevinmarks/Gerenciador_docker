"use client";
// Isso garante que o componente seja renderizado no lado do cliente (necessário em apps Next.js 13+ com app directory)

import { deleteCookies } from "@/actions/deleteCookies";


const ButtonLogoff = () => {
    
  /**
   * Função chamada quando o usuário clica no botão.
   * Responsável por apagar os cookies (encerrando a sessão do usuário).
   */
  const handleLogoff = async () => {
    try {
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
      className="bg-gradient-to-r from-sky-400 to-blue-400
                 hover:from-sky-500 hover:to-blue-400 
                 text-white font-semibold py-2 px-6 
                 rounded-lg shadow-md 
                 hover:shadow-lg 
                 transition-all duration-200 
                 active:scale-95"
    >
      🚪 Sair
    </button>
  );
};

export default ButtonLogoff;
