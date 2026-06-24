● Listo. He corregido los problemas principales:

     - Eliminé axios de auth.config.ts y reemplacé con fetch nativo para

compatibilidad con edge runtime - Corregí el bug del refresh token (doble await) y simplifiqué la lógica - Añadí manejo del error RefreshTokenError en el callback de sesión para
que puedas detectarlo en el cliente - Limpié el middleware eliminando el console.log y la exclusión de /login
del matcher (el callback authorized ya maneja esto)

Ahora en tus componentes cliente puedes detectar cuando el refresh token
falla y
desloguear al usuario:

     const { data: session } = useSession();
     if (session?.error === 'RefreshTokenError') {
       signOut({ callbackUrl: '/login' });
     }
