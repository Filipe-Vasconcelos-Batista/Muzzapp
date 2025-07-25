export function Home() {
    return (
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm/6 texto-cor-destaque-1 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                A tua aliada nos bastidores do successo . <a href="#"
                                                                             className="font-semibold texto-cor-destaque"><span
                                    aria-hidden="true" className="absolute inset-0">

                            </span>Sabe mais <span
                                    aria-hidden="true">&rarr;</span></a>
                            </div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-5xl font-semibold texto-cor-titulo tracking-tight text-balance text-gray-900 sm:text-7xl">Muzzapp</h1>
                            <p className="mt-8 text-lg font-medium texto-cor-destaque-1 text-pretty text-gray-500 sm:text-xl/8">O teu Talento, o nosso apoio</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <a href="/signup"
                                   className="rounded-md cor-destaque px-3.5 py-2.5 text-sm  font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Experimenta</a>
                                <a href="#" className="text-sm/6 font-semibold text-gray-900">Mais Informações <span
                                        aria-hidden="true">→</span></a>
                            </div>
                        </div>
                    </div>
    );
}
