# 🎨 Análisis Emocional a Color

Sistema avanzado que convierte texto emocional en paletas de colores usando inteligencia artificial y teoría cromática.



## Características Principales

-  **Análisis de Sentimientos Avanzado**: Combina TextBlob, VADER y algoritmos híbridos
-  **Generación de Colores Inteligente**: 6 esquemas cromáticos basados en psicología del color
-  **Soporte Multiidioma**: Detección y traducción automática
-  **Base de Datos Optimizada**: SQLite con migración fácil a PostgreSQL/MySQL
-  **API REST Completa**: Documentación automática con Swagger
-  **Interfaz Moderna**: Responsive design con animaciones suaves
-  **Docker Ready**: Containerización completa para deployment
-  **Métricas de Rendimiento**: Sistema de monitoreo integrado

##  Casos de Uso

- **Terapia y Bienestar**: Visualización de estados emocionales para terapeutas
- **Diseño Creativo**: Generación de paletas basadas en conceptos emotivos
- **Marketing**: Análisis emocional de mensajes y campañas
- **Desarrollo Personal**: Herramienta de autoconocimiento emocional

##  Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │   Base de      │
│   (HTML/JS)     │◄──►│    (FastAPI)     │◄──►│   Datos        │
│                 │    │                  │    │   (SQLite)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                       ┌────────▼────────┐
                       │  Procesamiento  │
                       │     de IA       │
                       │ TextBlob+VADER  │
                       └─────────────────┘
```

##  Inicio Rápido

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/analisis-emocional-color.git
cd analisis-emocional-color

# Levantar servicios
docker-compose up --build

# Abrir en navegador
# Frontend: http://localhost:8080
# API: http://localhost:8000
# Documentación: http://localhost:8000/docs
```

### Opción 2: Instalación Manual

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend (nueva terminal)
cd frontend  
python -m http.server 8080
```

##  Estructura del Proyecto

```
analisis-emocional-color/
├── backend/                    # API y lógica de negocio
│   ├── main.py                # Endpoints FastAPI
│   ├── models.py              # Modelos de base de datos
│   ├── database.py            # Configuración de BD
│   ├── color_generator.py     # Generador avanzado de colores
│   ├── requirements.txt       # Dependencias Python
│   └── Dockerfile            # Imagen Docker backend
├── frontend/                  # Interfaz de usuario
│   ├── index.html            # Página principal
│   ├── script.js             # Lógica JavaScript
│   └── style.css             # Estilos CSS
├── data/                     # Base de datos
│   └── palettes.db          # SQLite database
├── test_rendimiento.py      # Pruebas de carga
├── visualizar_rendimiento.py # Gráficos de rendimiento
├── docker-compose.yml       # Orquestación de servicios
├── README.md                # Esta documentación
└── .gitignore               # Archivos ignorados
```

##  Pipeline de Procesamiento

El sistema procesa las emociones en 6 fases:

1. **Ingesta**: Validación y sanitización del texto
2. **Traducción**: Detección automática de idioma y traducción
3. **Análisis NLP**: Combinación de TextBlob y VADER con algoritmo híbrido
4. **Clasificación**: Mapeo a 7 categorías emocionales
5. **Generación**: Conversión a paletas usando teoría científica del color
6. **Persistencia**: Almacenamiento con metadatos completos

### Categorías Emocionales

| Emoción | Rango Polaridad | Colores Típicos | Esquema Cromático |
|---------|----------------|-----------------|-------------------|
| Euforia | > 0.6 | Amarillos, naranjas vibrantes | Complementario |
| Alegría | 0.3 a 0.6 | Naranjas cálidos, verdes | Triádico |
| Serenidad | 0.05 a 0.3 | Azules suaves, verdes agua | Análogo |
| Equilibrio | -0.05 a 0.05 | Espectro balanceado | Tetrádico |
| Melancolía | -0.3 a -0.05 | Azules grisáceos | Análogo |
| Tristeza | -0.6 a -0.3 | Azules profundos, violetas | Monocromático |
| Angustia | < -0.6 | Rojos oscuros, violetas intensos | Complementario dividido |

##  API Endpoints

### POST `/analyze`
Analiza texto y genera paleta de colores.

```json
{
  "text": "Me siento muy feliz hoy",
  "method": "hybrid"
}
```

**Respuesta:**
```json
{
  "colors": ["#f1c40f", "#e67e22", "#2ecc71", "#3498db", "#9b59b6"],
  "polarity": 0.875,
  "sentiment": "very positive",
  "confidence": 0.92,
  "emotion_details": {
    "emotion": "Euforia",
    "temperature": "warm",
    "harmony": "complementary",
    "description": "colores cálidos que abrazan el alma"
  }
}
```

### GET `/gallery`
Obtiene historial de paletas generadas.

### GET `/stats`
Estadísticas de uso del sistema.

### GET `/health`
Estado de salud de la API.

## 📊 Pruebas de Rendimiento

El sistema incluye herramientas completas de testing:

```bash
# Ejecutar pruebas de carga
python test_rendimiento.py

# Generar reportes visuales  
python visualizar_rendimiento.py
```

### Métricas de Rendimiento

- **Tiempo de respuesta promedio**: < 2 segundos
- **Precisión del análisis**: 85-90% 
- **Tasa de éxito**: > 99%
- **Concurrencia**: Hasta 50 requests simultáneas
- **Volumen de datos**: 2-1000 caracteres por análisis

##  Tecnologías Utilizadas

### Backend
- **Python 3.11+**: Lenguaje principal
- **FastAPI**: Framework web de alto rendimiento
- **SQLAlchemy**: ORM para base de datos
- **TextBlob**: Análisis de sentimientos tradicional
- **VADER**: Análisis optimizado para redes sociales
- **NumPy**: Cálculos matemáticos
- **Deep-Translator**: Traducción multiidioma

### Frontend  
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con animaciones
- **JavaScript ES6+**: Lógica asíncrona
- **Bootstrap 5**: Framework responsive

### Infrastructure
- **Docker**: Containerización
- **SQLite**: Base de datos (desarrollo)
- **Nginx**: Servidor web (producción)

##  Testing y Calidad

### Pruebas Implementadas
- **Pruebas de carga secuencial**: Rendimiento individual
- **Pruebas concurrentes**: Múltiples usuarios simultáneos  
- **Pruebas asíncronas**: Máximo throughput
- **Pruebas de volumen**: Diferentes tamaños de datos
- **Pruebas de estrés**: Límites del sistema

### Validaciones
- Sanitización de entrada
