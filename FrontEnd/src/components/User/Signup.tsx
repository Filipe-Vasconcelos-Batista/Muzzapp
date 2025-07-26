import React, { useState } from 'react'
import {Register} from '../../types/Register.ts'
import { ApiError } from '../../utils/ApiError'
import {login} from "../../utils/Auth.ts";

const initialRegister: Register = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
}
export default function SignUpForm() {
    const [register, setRegister] = useState<Register>(initialRegister)

    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    function handleChange(
            e: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value, type, checked } = e.target
        setRegister(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setMessage(null)
        setError(null)

        // Basic client-side validations
        if (register.password !== register.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (!register.agreeTerms) {
            setError('You must accept the terms and conditions')
            return
        }

        // Build payload matching backend JSON
        const payload = {
            email: register.email,
            firstName: register.firstName,
            lastName: register.lastName,
            phoneNumber: register.phoneNumber,
            plainPassword: register.password,
            agreeTerms: register.agreeTerms,
        }

        try {
            const res = await fetch(
                    'http://localhost:8081/api/register',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    })

            const errPayload= await res.json()

            if (!res.ok) {
                const message= errPayload?.message ?? res.statusText
                const errors= Array.isArray(errPayload.errors)
                ? (errPayload.errors as string[]):undefined
                throw new ApiError(message, errors)
            }

            setMessage(errPayload.message || 'Registration successful!')
            await login(register.email, register.password)
            setRegister(initialRegister)


        } catch (err: unknown) {
            if (err instanceof ApiError) {
                // prefer the errors array if present
                setError(
                        err.errors?.length
                                ? err.errors.join(', ')
                                : err.message
                )
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unknown error occurred')
            }
        }
    }

    return (
            <div className="min-h-full  px-6 py-12 lg:px-8">
                <div className="mx-auto sm:max-w-sm">
                    <h1 className="mt-2 text-center text-2xl font-bold text-gray-900">
                        Cria a tua conta
                    </h1>

                    {message && (
                            <p className="mt-4 text-center text-green-600">
                                {message}
                            </p>
                    )}
                    {error && (
                            <p className="mt-4 text-center text-red-600">
                                Error: {error}
                            </p>
                    )}

                    <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-6"
                            noValidate
                    >
                        {/* First & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                        htmlFor="firstName"
                                        className="block text-sm/6 font-medium text-gray-900"
                                >
                                    First Name
                                </label>
                                <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={register.firstName}
                                        onChange={handleChange}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            <div>
                                <label
                                        htmlFor="lastName"
                                        className="block text-sm/6 font-medium text-gray-900"
                                >
                                    Last Name
                                </label>
                                <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={register.lastName}
                                        onChange={handleChange}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label
                                    htmlFor="phoneNumber"
                                    className="block text-sm/6 font-medium text-gray-900"
                            >
                                Phone Number
                            </label>
                            <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    required
                                    pattern="^\+\d{7,15}$"
                                    placeholder="+352123456789"
                                    value={register.phoneNumber}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                    htmlFor="email"
                                    className="block text-sm/6 font-medium text-gray-900"
                            >
                                Email
                            </label>
                            <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={register.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>

                        {/* Password & Confirm */}
                        <div>
                            <label
                                    htmlFor="password"
                                    className="block text-sm/6 font-medium text-gray-900"
                            >
                                Password
                            </label>
                            <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={8}
                                    value={register.password}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                        <div>
                            <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm/6 font-medium text-gray-900"
                            >
                                Confirm Password
                            </label>
                            <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={8}
                                    value={register.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>

                        {/* Agree Terms */}
                        <div className="flex items-center">
                            <input
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    type="checkbox"
                                    checked={register.agreeTerms}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                                    htmlFor="agreeTerms"
                                    className="ml-2 block text-sm text-gray-700"
                            >
                                Aceito os{' '}
                                <a
                                        href="#"
                                        className="font-medium text-indigo-600 hover:underline"
                                >
                                    Termos e condições
                                </a>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                                type="submit"
                                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Create an account
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Já tens uma conta?{' '}
                        <a
                                href="/login"
                                className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Liga-te aqui
                        </a>
                    </p>
                </div>
            </div>
    )
}
