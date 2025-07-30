import React from "react";

function NotFound() {
    return (
            <>

                <div className="flex w-full justify-center max-w-md">
                    <img src="/images/illustrations/404.svg" alt="404"/>
                </div>
                <div className="text-center xl:max-w-4xl">
                    <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">Pagina não encontrada</h1>
                    <p className="mb-5 text-base font-normal text-gray-500 md:text-lg dark:text-gray-400">Oops!
                        Parece que seguiste o link errado, se achas que é um problema nosso, por favor contacta-nos.</p>
                    <button type="submit"
                            className="flex mt-2 text-center inline-flex rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Voltar ao meu dashboard
                    </button>
                </div>
            </>
    )
            ;
}

export default NotFound;
