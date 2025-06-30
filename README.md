# Vulkan Assistant Frontend

Sistema de Gestión para Distribuidora de Alimentos – Frontend

Este proyecto es la interfaz web de un sistema personalizado de gestión para una distribuidora de carne. Permite automatizar y simplificar tareas operativas clave, integrándose con un backend propio y servicios externos.

## Funcionalidades principales

- **Subida y procesamiento de listas de precios en Excel**
- **Ingreso y visualización de pedidos de clientes**
- **Generación de facturas en PDF**
- **Visualización de reportes** (ventas por cliente, productos más vendidos, stock bajo)
- **Control manual de cobranzas**
- **Visualización de archivos cargados** (integración con S3)

## Tecnologías utilizadas

- [Next.js](https://nextjs.org/) (React)
- [Tailwind CSS](https://tailwindcss.com/)
- Consumo de APIs RESTful
- Integración con Amazon S3

---

## Requisitos previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- Acceso a las variables de entorno necesarias (ver sección correspondiente)
- Acceso a las APIs del backend y credenciales de S3

---

## Instalación y ejecución local

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/vulkan-assistant-frontend.git
   cd vulkan-assistant-frontend
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env.local` en la raíz del proyecto con las variables necesarias (ver sección Variables de entorno).

4. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Estructura del proyecto

```
vulkan-assistant-frontend/
├── components/        # Componentes reutilizables de React
├── pages/             # Rutas y vistas principales (Next.js)
├── public/            # Recursos estáticos
├── styles/            # Archivos de estilos (Tailwind config, etc.)
├── utils/             # Funciones utilitarias y helpers
├── ...                # Otros directorios y archivos de configuración
```

---

## Scripts npm

- `npm run dev` – Ejecuta la app en modo desarrollo
- `npm run build` – Compila la app para producción
- `npm run start` – Inicia la app en modo producción
- `npm run lint` – Ejecuta el linter

---

## Variables de entorno necesarias

Crear un archivo `.env.local` con las siguientes variables (ejemplo):

```env
NEXT_PUBLIC_API_URL=https://api.tu-backend.com
NEXT_PUBLIC_S3_BUCKET_URL=https://s3.amazonaws.com/tu-bucket
# Otras variables necesarias para autenticación, etc.
```

Consultar con el equipo de backend por valores y detalles adicionales.

---

## Capturas de pantalla

> _Próximamente: aquí se incluirán capturas de las principales pantallas del sistema._

---

## Futuras mejoras

- Gestión de usuarios y permisos
- Notificaciones automáticas por email/WhatsApp
- Dashboard personalizable
- Integración con sistemas contables externos
- Mejoras de accesibilidad y experiencia de usuario

---

## Licencia

Este proyecto es privado y de uso exclusivo para la distribuidora. Para consultas, contactar al equipo de desarrollo.
