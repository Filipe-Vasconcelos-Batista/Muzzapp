import { ApiError } from './ApiError'

interface RequestOptions extends RequestInit{
    headers?: Record<string,string>
}
export async function apiRequest<T>(
        url: string,
        options: RequestOptions={}
):Promise<T>{
    const defaultHeaders={
        'Content-Type': 'application/json',
        ...options.headers,
    }
    const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
    }as RequestInit)

    let payload
    const contentType= response.headers.get('Content-Type') || ''
    if (contentType.includes('application/json')) {
        payload= await response.json()
    }else{
        payload= await response.text()
    }

    if (!response.ok){
        const message=payload?.message || response.statusText
        const errors = Array.isArray(payload?.errors)
                ? (payload.errors as string[])
                : undefined
        throw new ApiError(message, errors )
    }
    return payload as T
}
