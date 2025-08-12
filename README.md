# 🥩 Vulkan Assistant - Sistema de Gestión para Distribuidora

**Sistema integral de gestión desarrollado para optimizar las operaciones de una distribuidora de carne y productos alimenticios.**

Este proyecto nace de la necesidad de automatizar y digitalizar los procesos manuales de una distribuidora tradicional, proporcionando herramientas modernas para la gestión de inventario, clientes, pedidos y facturación.

---

## 🎯 ¿De qué se trata el proyecto?

Vulkan Assistant es una solución completa que transforma la gestión tradicional de una distribuidora de alimentos en un sistema digital eficiente. El sistema permite:

### 📋 Funcionalidades Principales

- **📊 Gestión de Inventario Inteligente**: Control de stock por cajas individuales con peso específico, fechas de entrada y estado (fresco/congelado)
- **📈 Procesamiento de Listas de Precios**: Carga masiva de productos y precios desde archivos Excel con validación automática
- **👥 Administración de Clientes**: Registro completo con datos fiscales (CUIT, condición IVA) y contacto
- **🛒 Gestión de Pedidos**: Creación y seguimiento de pedidos con asignación automática de cajas de stock
- **💰 Sistema de Facturación**: Generación automática de facturas con control de estados de pago
- **📊 Reportes y Analytics**: Visualización de ventas, productos más vendidos y análisis de stock

### 🏗️ Arquitectura del Sistema

El proyecto está dividido en dos aplicaciones principales:

- **Frontend (Next.js)**: Interfaz web moderna y responsive con componentes reutilizables
- **Backend (Express + Prisma)**: API RESTful con base de datos PostgreSQL para gestión de datos

---

## 👨‍💻 Sobre el Desarrollador

**Desarrollado por Bautista Gorchs**

Soy un desarrollador full-stack apasionado por crear soluciones tecnológicas que resuelvan problemas reales del mundo empresarial. Este proyecto representa mi enfoque en:

- 🎨 **Diseño UX/UI intuitivo** para usuarios no técnicos
- ⚡ **Optimización de procesos** empresariales través de la tecnología
- 🔧 **Arquitectura escalable** con tecnologías modernas
- 📱 **Desarrollo full-stack** desde la base de datos hasta la interfaz de usuario

_Especializado en React, Node.js, TypeScript y bases de datos relacionales._

---

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 15** - Framework de React con SSR/SSG
- **TypeScript** - Tipado estático para mayor robustez
- **Sass/SCSS** - Estilos modulares y mantenibles
- **Axios** - Cliente HTTP para consumo de APIs

### Backend

- **Express.js** - Framework web minimalista y flexible
- **Prisma ORM** - Mapeo objeto-relacional moderno
- **PostgreSQL** - Base de datos relacional robusta
- **TypeScript** - Desarrollo backend tipado
- **XLSX** - Procesamiento de archivos Excel

---

## ⚡ Información Útil para Desarrollo

### 🗄️ Comandos de Base de Datos (Prisma)

Cada vez que hagas cambios en la base de datos, ejecuta estos comandos en orden:

```bash
# 1. Navegar al directorio del backend
cd vulkan-assistant-backend

# 2. Generar migración después de modificar schema.prisma
npx prisma migrate dev --name nombre_descriptivo_del_cambio

# 3. Regenerar el cliente de Prisma
npx prisma generate

# 4. (Opcional) Reiniciar el servidor de desarrollo
npm run dev
```

### 🔧 Comandos Adicionales Útiles

```bash
# Ver estado actual de la base de datos
npx prisma db push

# Abrir Prisma Studio (interfaz visual de la DB)
npx prisma studio

# Reset completo de la base de datos (¡CUIDADO!)
npx prisma migrate reset

# Seed de datos de prueba (si existe)
npx prisma db seed
```

### 🏃‍♂️ Desarrollo Local

```bash
# Terminal 1: Backend
cd vulkan-assistant-backend
npm install
npm run dev  # Puerto por defecto: 3001

# Terminal 2: Frontend
cd vulkan-assistant-frontend
npm install
npm run dev  # Puerto por defecto: 3000
```

---

## 📁 Estructura del Proyecto

```
vulkan-assistant/
├── vulkan-assistant-backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Esquema de base de datos
│   │   └── migrations/            # Historial de migraciones
│   ├── src/
│   │   ├── routes/               # Endpoints de la API
│   │   ├── lib/                  # Utilidades y configuración
│   │   └── types/                # Definiciones TypeScript
│   └── package.json
│
└── vulkan-assistant-frontend/
    ├── src/
    │   ├── app/                  # App Router de Next.js
    │   ├── components/           # Componentes reutilizables
    │   └── lib/                  # Utilidades del cliente
    └── package.json
```

---

## 🚀 Próximas Mejoras

- [ ] Sistema de autenticación y roles de usuario
- [ ] Notificaciones automáticas por email/WhatsApp
- [ ] Dashboard analítico avanzado
- [ ] Exportación de reportes en PDF/Excel
- [ ] App móvil para gestión de entregas
- [ ] Integración con sistemas contables externos

---

## 📝 Notas de Desarrollo

- La base de datos utiliza PostgreSQL con Prisma como ORM
- Todos los precios se manejan como Float en la base de datos
- Las cajas tienen peso individual y pueden ser marcadas como congeladas
- El sistema mantiene un historial de precios por producto
- Estados de facturación: `PENDING`, `CHEQUE`, `PAID`

---

_Proyecto desarrollado con ❤️ para optimizar la gestión empresarial a través de la tecnología_
