# taller-copilot-02

## Backend con FastAPI + JWT

Se agregó una carpeta `backend/` con una API Web construida en **Python + FastAPI** y gestionada con **Poetry**.

### Funcionalidades

- `POST /token`: recibe `username` y `password`.
  - Credenciales válidas:
    - `username`: `admin`
    - `password`: `admin123`
  - Respuesta: token JWT con expiración de **300 segundos**.
- `POST /refresh`: recibe un token JWT válido y devuelve un nuevo token con 300 segundos de expiración.

### Estructura

```text
backend/
├── app/
│   └── main.py
├── Dockerfile
└── pyproject.toml
docker-compose.yml
```

### Uso local con Poetry

1. Instalar Poetry (si no lo tienes):
   ```bash
   pip install poetry
   ```
2. Instalar dependencias:
   ```bash
   cd backend
   poetry install
   ```
3. Ejecutar la API:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

La API quedará disponible en `http://localhost:8000`.

### Ejemplos de uso

Obtener token:

```bash
curl -X POST http://localhost:8000/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Refrescar token:

```bash
curl -X POST http://localhost:8000/refresh \
  -H "Content-Type: application/json" \
  -d '{"token":"<TOKEN_AQUI>"}'
```

### Uso con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Esto levanta el servicio en `http://localhost:8000`.