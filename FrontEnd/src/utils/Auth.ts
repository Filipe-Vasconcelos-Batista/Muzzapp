const API_URL = 'http://localhost:8081/api' // Update with your backend API

// 🔐 Login function
export async function login(email: string, password: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/login_check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        throw new Error('Login failed')
    }

    const { token } = await response.json()
    localStorage.setItem('authToken', token)
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No auth token found')

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`
    }

    return fetch(`${API_URL}${endpoint}`, { ...options, headers })
}

// 🚪 Logout function
export function logout(): void {
    localStorage.removeItem('authToken')
}

// 🕵️‍♂️ Check if user is logged in
export function isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken')
}
