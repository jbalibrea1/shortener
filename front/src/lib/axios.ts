import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  withCredentials: true // importante para cookies httpOnly
});

// Elimina el interceptor que usa getSession (solo funciona en cliente)
// En vez de usar un interceptor global, pasa el token manualmente en cada llamada desde el cliente

// Interceptor para refrescar el token si expira (opcional, solo si usas refresh token en backend)
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // Intenta refrescar el token (si tienes endpoint de refresh)
//         const { data } = await axios.get('api/auth/refresh-token', {
//           withCredentials: true
//         });
//         if (data.accessToken) {
//           originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error('Refresh token expired, logging out...');
//         signOut();
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
