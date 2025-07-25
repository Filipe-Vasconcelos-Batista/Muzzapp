import  { useState } from 'react'

const genderOptions = ['Male', 'Female', 'Unknown']
const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large']
const defaultForm=
        {
            Name:    '',
            Age:     2,
            Breed:   '',
            Species: '',
            Gender:  'Unknown',
            Size:    'Medium'
        }
export function CreatePetForm() {
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
            const res = await fetch('http://localhost:3000/api/v1/pets', {
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
        } catch (e: any) {
            setError(e.message)
            setMessage(null)
        }
    }

    return (
            <>
                    <form onSubmit={handleSubmit} className="space-y-12  py-32">
                        <div className="space-y-12 lg:px-8">
                            <div className="pb-12">
                                <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">Add your pet to our list</p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                    <div className="sm:col-span-2">
                                        <label htmlFor="name"
                                               className="block text-sm/6 font-medium text-gray-900">Name</label>
                                        <div className="mt-2">
                                            <input id="name"
                                                   name="Name"
                                                   value={formData.Name}
                                                   onChange={handleChange}
                                                   placeholder="Name"
                                                   required
                                                   minLength={3}
                                                   maxLength={50}
                                                   type="text"
                                                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="age"
                                               className="block text-sm/6 font-medium text-gray-900">Breed</label>
                                        <div className="mt-2">
                                            <input
                                                    name="Breed"
                                                    value={formData.Breed}
                                                    onChange={handleChange}
                                                    placeholder="Beagle"
                                                    required
                                                    maxLength={64}
                                                    id="age"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="size"
                                               className="block text-sm/6 font-medium text-gray-900">Size</label>
                                        <div className="mt-2">
                                            <select id="gender"
                                                    name="Size"
                                                    value={formData.Size}
                                                    onChange={handleChange}
                                                    required
                                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                                {sizeOptions.map(option => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 sm:col-start-1">
                                        <label htmlFor="city"
                                               className="block text-sm/6 font-medium text-gray-900">Age</label>
                                        <div className="mt-2">
                                            <input id="age"
                                                   name="Age"
                                                   type="number"
                                                   value={formData.Age}
                                                   onChange={handleChange}
                                                   placeholder="Age"
                                                   required
                                                   min={0}
                                                   max={50}
                                                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="species"
                                               className="block text-sm/6 font-medium text-gray-900">Species</label>
                                        <div className="mt-2">
                                            <input id="species"
                                                   name="Species"
                                                   value={formData.Species}
                                                   onChange={handleChange}
                                                   placeholder="Dog"
                                                   required
                                                   maxLength={64}
                                                   type="text"
                                                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="gender"
                                               className="block text-sm/6 font-medium text-gray-900">Gender</label>
                                        <div className="mt-2">
                                            <select id="gender"
                                                    name="Gender"
                                                    value={formData.Gender}
                                                    onChange={handleChange}
                                                    required
                                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                                {genderOptions.map(option => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center lg:px-8 justify-end gap-x-6">
                            <button type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create Pet</button>
                        </div>
                        {message && <p>{message}</p>}
                        {error && <p>Error: {error}</p>}
                    </form>
            </>
    )
}
