# taller-copilot-02

Proyecto con backend en FastAPI (JWT) y frontend en React para autenticación.

## Estructura

```text
backend/
├── app/
│   └── main.py
├── Dockerfile
├── poetry.lock
└── pyproject.toml
frontend/
├── src/
│   ├── App.jsx
│   └── index.css
└── package.json
DESIGN.md
docker-compose.yml
```

## Backend (FastAPI + JWT)

### Funcionalidades

- `POST /token`: recibe `username` y `password`, y devuelve JWT.
- `POST /refresh`: recibe un token válido y devuelve uno nuevo.

Credenciales por defecto:

- `username`: `admin`
- `password`: `admin123`

### Uso local con Poetry

1. Instalar Poetry:
   ```bash
   pip install poetry
   ```
2. Instalar dependencias:
   ```bash
   cd backend
   poetry install
   ```
3. Definir secreto JWT:
   ```bash
   export JWT_SECRET_KEY="tu-secreto-super-seguro-de-32-caracteres"
   ```
4. Ejecutar backend:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

Backend disponible en: `http://localhost:8000`

## Frontend (React + Vite)

### Funcionalidades

- Página de login (`/login`).
- Página de bienvenida (`/welcome`).
- Inicio de sesión consumiendo `POST /token` del backend.
- Token guardado en `sessionStorage`.
- Acceso protegido: si no hay sesión activa, no se permite ingresar a `/welcome`.
- Estilos basados en el estándar definido en `DESIGN.md`.

### Uso local

1. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. (Opcional) Configurar URL del backend:
   ```bash
   export VITE_API_BASE_URL="http://localhost:8000"
   ```
3. Ejecutar frontend:
   ```bash
   npm run dev
   ```

Frontend disponible en: `http://localhost:5173`

### Flujo de uso

1. Iniciar backend.
2. Iniciar frontend.
3. Ir a `http://localhost:5173/login`.
4. Iniciar sesión con `admin / admin123`.
5. Al autenticarse, se redirige a `http://localhost:5173/welcome`.
6. Usar “Cerrar sesión” para invalidar la sesión del navegador.

## Docker (backend)

Desde la raíz del proyecto:

```bash
export JWT_SECRET_KEY="tu-secreto-super-seguro-de-32-caracteres"
docker compose up --build
```
