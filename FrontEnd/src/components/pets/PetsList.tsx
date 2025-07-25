// src/pages/pets/PetsList.tsx
import { useEffect, useState } from 'react'
import type { Pet } from '../../types/Pets'

export function PetsList() {
    const [pets, setPets] = useState<Pet[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('http://localhost:3000/api/v1/pets')
                .then(r => {
                    if (!r.ok) throw new Error(r.statusText)
                    return r.json()
                })
                .then((data: { pets: Pet[] }) => {
                    setPets(data.pets)
                    setLoading(false)
                })
                .catch(e => {
                    setError(e.message)
                    setLoading(false)
                })
    }, [])

    if (loading) return <p>Loading…</p>
    if (error) return <p>Error: {error}</p>

    return (
            <div className="-my-2 py-32  overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
                <div className="align-middle inline-block min-w-full shadow overflow-hidden shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg">
                    <table className="min-w-full">
                        <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Created
                                at
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Name</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Species</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Breed</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Gender</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Size
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                        </tr>
                        </thead>
                        <tbody >
                        {pets.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm leading-5 text-gray-800">{new Date(p.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                        <div className="text-sm leading-5 text-blue-900">{p.Name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{p.Species}</td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{p.Breed}</td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                        <span aria-hidden
                                              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                        <span className="relative text-xs">{p.Gender}</span>
                                    </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-blue-900 text-sm leading-5">{p.Size}
                                    </td>
                                </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
    )
}
