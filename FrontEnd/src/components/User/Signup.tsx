import {useState} from "react";

function SignUpForm() {

    const [formData, setFormData] = useState({email: '', password: '', confirmPassword: ''});
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setMessage(null);
            return;
        }

        try {
            const res = await fetch("http://localhost:8081/api/register", {
                method:  "POST",
                headers: {"Content-Type": "application/json"},
                body:    JSON.stringify({
                    email:    formData.email,
                    password: formData.password,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Unknown error");
            }

            const data = await res.json();
            setMessage(data.message);
            setError(null);
        } catch (e: unknown) {
            const errMsg = e instanceof Error ? e.message : "Unexpected error";
            setError(errMsg);
            setMessage(null);
        }
    }

    return (
            <div className=" min-h-full  px-6 py-12 lg:px-8 ">
                <div className="mx-auto sm:max-w-sm">
                    <h1 className="mt-2 text-center font-bold text-gray-900">
                        Cria a tua conta
                    </h1>

                    {/* You can show success or error messages here if needed */}
                    {message && <p className="mt-6 text-center text-sm/6 text-green-600">{message}</p>}
                    {error && <p className="mt-6 text-center text-sm/6 text-red-600">Error: {error}</p>}

                    <form onSubmit={handleSubmit} method="POST" className="space-y-10">
                        <div>
                            <label htmlFor="email"
                                   className="block text-sm/6 font-medium text-gray-900">O teu email</label>
                            <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    required
                                    placeholder="name@company.com"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block text-sm/6 font-medium text-gray-900">Password</label>
                            <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                        </div>
                        <div>
                            <label htmlFor="confirm-password"
                                   className="block text-sm/6 font-medium text-gray-900">Confirma a password</label>
                            <input
                                    type="password"
                                    name="confirm-password"
                                    id="confirm-password"
                                    placeholder="••••••••"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></input>
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                        id="terms"
                                        aria-describedby="terms"
                                        type="checkbox"
                                        required
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"></input>
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">Aceito os <a className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                           href="#">Termos e condições</a></label>
                            </div>
                        </div>
                        <button type="submit"
                                className="flex mt-2 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create
                            an account
                        </button>
                    </form>
                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Já tens uma conta??{' '}
                        <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Liga-te aqui</a>
                    </p>
                </div>
            </div>
    );
}

export default SignUpForm;
