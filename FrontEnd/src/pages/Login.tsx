import {useEffect, useState} from 'react'
import { login } from '../utils/Auth.ts'
import Nav from "../components/Navigation/NavBar.tsx"; // adjust path as needed

export function LoginForm() {
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    useEffect(() => {
        const saved = localStorage.getItem('credentials')
        if (saved) {
            const { email, password } = JSON.parse(saved)
            setEmail(email)
            setPassword(password)
            setRememberMe(true)
        }
    }, [])
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            await login(email, password)
            setMessage('Login successful!')
            setError(null)

            if (rememberMe) {
                localStorage.setItem(
                        'credentials',
                        JSON.stringify({ email, password })
                )
            } else {
                localStorage.removeItem('credentials')
            }
        } catch (e) {
            setError(e.message || 'Login failed')
            setMessage(null)
        }
        const token = localStorage.getItem('authToken'); // or wherever you store it
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                console.log("✅ Decoded JWT Payload:");
                
                Object.entries(decoded).forEach(([key, value]) => {
                    console.log(`${key}:`, value);
                });
            } catch (err) {
                console.error("❌ Failed to decode JWT:", err);
            }
        }
    }

    return (

            <>
                <Nav/>
                <div className=" min-h-full  px-6 py-12 lg:px-8 ">
                    <div className="mx-auto sm:max-w-sm">
                        <h2 className="mt-2 text-center font-bold text-gray-900">Sign
                            in to
                            your account</h2>

                        <form onSubmit={handleSubmit} method="POST" className="space-y-10">
                            <div className="mt-10">
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email
                                    address</label>

                                <div className="mt-2">
                                    <input id="email"
                                           name="email"
                                           required
                                           type="email"
                                           value={email}
                                           onChange={(e) => setEmail(e.target.value)}
                                           className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password"
                                           className="block text-sm/6 font-medium text-gray-900">Password</label>
                                    <div className="text-sm">
                                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot
                                            password?</a>
                                    </div>
                                </div>
                                <div className="mt-2 relative">
                                    <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            maxLength={64}
                                            id="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                                    <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-3 flex items-center text-sm text-indigo-600 hover:underline"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex items-center h-5">
                                    <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={e => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"></input>
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="font-light texto-cor-destaque">Lembra-te de mim</label>
                                </div>
                            </div>
                            <div>
                                <button type="submit"
                                        className="flex mt-2 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login
                                </button>
                            </div>
                            {message && <p className="mt-10 text-center text-sm/6 text-gray-500">{message}</p>}
                            {error && <p className="mt-10 text-center text-sm/6 text-gray-500">Error: {error}</p>}
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-500">
                            Não tens conta?
                            <a href="/signup"
                               className="font-semibold text-indigo-600 hover:text-indigo-500"> Experimenta durante 14
                                dias</a>
                        </p>
                    </div>
                </div>
            </>
    )
}
