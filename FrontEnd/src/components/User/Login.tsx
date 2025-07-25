import  { useState } from 'react'

const defaultForm=
        {
            email:    '',
            password: ''
        }
export function LoginForm() {
    const [formData, setFormData] = useState(defaultForm)

    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'Age' ? parseInt(value) : value
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:8081/api/auth/login_check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || 'Unknown error')
            }

            const data = await res.json()
            setMessage(data.message)
            setError(null)
            setFormData(defaultForm)
        } catch (e) {
            setError(e.message)
            setMessage(null)
        }
    }

    return (

            <>
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center font-bold text-gray-900">Sign
                            in to
                            your account</h2>

                        <form onSubmit={handleSubmit} method="POST" className="space-y-10">
                            <div className="mt-10">
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email
                                    address</label>

                                <div className="mt-2">
                                    <input id="email"
                                           name="email"
                                           value={formData.email}
                                           onChange={handleChange}
                                           required
                                           type="email"
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
                                <div className="mt-2">
                                    <input type='password'
                                           name="password"
                                           value={formData.password}
                                           onChange={handleChange}
                                           placeholder="Beagle"
                                           maxLength={64}
                                           id="password"
                                           required
                                           autoComplete="current-password"
                                           className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                                </div>
                            </div>
                            <div>
                                <button type="submit"
                                        className="flex mt-2 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                                            in
                                </button>
                            </div>
                            {message && <p className="mt-10 text-center text-sm/6 text-gray-500">{message}</p>}
                            {error && <p className="mt-10 text-center text-sm/6 text-gray-500">Error: {error}</p>}
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-500">
                            Não tens conta?
                            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500"> Experimenta durante 14 dias</a>
                        </p>
                    </div>
                </div>
            </>
    )
}
