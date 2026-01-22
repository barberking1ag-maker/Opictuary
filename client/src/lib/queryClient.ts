import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiBaseUrl, isNativeApp } from "@/config/api";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get fetch options based on platform
// Native apps need different CORS handling than web
function getFetchOptions(additionalHeaders?: Record<string, string>): RequestInit {
  const baseOptions: RequestInit = {
    headers: {
      ...additionalHeaders,
    },
  };
  
  // For native apps, we don't use credentials: "include" as CORS works differently
  // Native apps bypass CORS restrictions but still need proper headers
  if (isNativeApp()) {
    return {
      ...baseOptions,
      mode: 'cors',
    };
  }
  
  // For web, include credentials for session cookies
  return {
    ...baseOptions,
    credentials: "include",
  };
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fetchOptions = getFetchOptions(
    data ? { "Content-Type": "application/json" } : undefined
  );
  
  const res = await fetch(`${getApiBaseUrl()}${url}`, {
    ...fetchOptions,
    method,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const fetchOptions = getFetchOptions();
    
    const res = await fetch(`${getApiBaseUrl()}${queryKey.join("/")}`, fetchOptions);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
