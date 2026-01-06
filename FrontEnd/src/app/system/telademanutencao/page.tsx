import Link from "next/link";

export default function EmDesenvolvimento() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-600 via-indigo-700 to-purple-800 text-white px-6 py-12">
      <div className="relative max-w-4xl w-full">

        {/* efeitos de fundo */}
        <div className="absolute -left-20 -top-16 w-48 h-48 rounded-full bg-white/6 blur-3xl animate-pulse" />
        <div className="absolute -right-24 -bottom-16 w-64 h-64 rounded-full bg-white/4 blur-2xl opacity-60" />

        <div className="relative bg-gradient-to-tr from-white/6 to-white/4 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl">

          {/* header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-28 h-28 rounded-xl bg-white/8 flex items-center justify-center">
              <svg
                className="w-14 h-14 text-white/90 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M12 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 20v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4.93 4.93l1.41 1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M17.66 17.66l1.41 1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4.93 19.07l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Estamos em manutenção
              </h1>
              <p className="mt-2 text-white/80 max-w-xl">
                Estamos aprimorando a aplicação para oferecer uma experiência ainda melhor.
                Obrigado pela paciência — já voltamos com mais funcionalidades e melhorias de performance.
              </p>
            </div>
          </div>

          {/* cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white/6 border border-white/8">
              <h3 className="font-semibold">Melhorias de UI</h3>
              <p className="mt-1 text-sm text-white/70">
                Refatorando telas e otimizando fluxos.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white/6 border border-white/8">
              <h3 className="font-semibold">Estabilidade</h3>
              <p className="mt-1 text-sm text-white/70">
                Correções e testes para reduzir erros.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white/6 border border-white/8">
              <h3 className="font-semibold">Upload e backups</h3>
              <p className="mt-1 text-sm text-white/70">
                Gerenciamento seguro de arquivos.
              </p>
            </div>
          </div>

          {/* ações */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <a
                href="https://github.com/keevinmarks/Gerenciador_docker.git"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-white/90 transition text-center"
              >
                Git Kevin
              </a>

              <a
                href="https://github.com/sychr12/Gerenciador_docker.git"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-white/90 transition text-center"
              >
                Git sychr
              </a>

              <button className="px-5 py-2 rounded-lg border border-white/20 hover:bg-white/6 transition">
                Quero ser notificado
              </button>
            </div>

            <Link href="/" className="text-sm text-white/70 hover:underline">
              Voltar para o início
            </Link>
          </div>

          {/* footer */}
          <div className="mt-6 border-t border-white/6 pt-4 text-center text-sm text-white/60">
            © {new Date().getFullYear()} • Todos os direitos reservados
          </div>

        </div>
      </div>
    </div>
  );
}
