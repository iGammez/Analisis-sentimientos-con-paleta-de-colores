document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const galleryBtn = document.getElementById('gallery-btn');
    const textInput = document.getElementById('text-input');
    const paletteContainer = document.getElementById('palette-container');
    const galleryContainer = document.getElementById('gallery-container');
    const galleryGrid = document.getElementById('gallery-grid');

    // URL fija del backend
    const API_URL = 'http://localhost:8000';

    // Función para mostrar mensajes de estado
    const showStatus = (message, isError = false) => {
        paletteContainer.innerHTML = `
            <div class="${isError ? 'error' : 'loading'}" style="
                width: 100%; 
                text-align: center; 
                padding-top: 40vh; 
                font-size: 1.5rem; 
                color: ${isError ? '#dc3545' : '#555'};
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            ">
                <div>${message}</div>
            </div>
        `;
    };

    // Función para mostrar información detallada de la paleta
    const showPaletteInfo = (data) => {
        const info = data.emotion_details;
        const infoHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                max-width: 400px;
                z-index: 1000;
                animation: slideUp 0.5s ease;
            ">
                <h4 style="margin: 0 0 10px 0; color: #333;">
                    ${info.emotion || 'Emoción'} 
                    <span style="font-size: 0.8em; color: #666;">(${(data.confidence * 100).toFixed(1)}% confianza)</span>
                </h4>
                <p style="margin: 5px 0; color: #555; font-size: 0.9em;">
                    <strong>Temperatura:</strong> ${info.temperature || 'neutral'} | 
                    <strong>Armonía:</strong> ${info.harmony || 'básica'}
                </p>
                <p style="margin: 5px 0; color: #666; font-style: italic; font-size: 0.85em;">
                    "${info.description || 'Paleta generada dinámicamente'}"
                </p>
                ${info.color_meanings && info.color_meanings.length > 0 ? 
                    `<div style="margin-top: 10px;">
                        <small style="color: #888;">Significados: ${info.color_meanings.join(', ')}</small>
                    </div>` : ''
                }
                <button onclick="this.parentElement.remove()" style="
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #999;
                ">&times;</button>
            </div>
        `;
        
        // Remover info anterior si existe
        const existingInfo = document.querySelector('.palette-info');
        if (existingInfo) existingInfo.remove();
        
        // Agregar nueva info
        const infoElement = document.createElement('div');
        infoElement.className = 'palette-info';
        infoElement.innerHTML = infoHTML;
        document.body.appendChild(infoElement);
        
        // Remover automáticamente después de 10 segundos
        setTimeout(() => {
            if (infoElement.parentElement) {
                infoElement.remove();
            }
        }, 10000);
    };

    const generatePalette = async () => {
        const userText = textInput.value.trim();
        if (!userText) {
            alert('Por favor, escribe algo para analizar.');
            textInput.focus();
            return;
        }

        showStatus('🎨 Analizando emociones y generando paleta avanzada...');
        
        try {
            console.log('Enviando petición a:', `${API_URL}/analyze`);
            
            const response = await fetch(`${API_URL}/analyze`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    text: userText, 
                    method: "enhanced" 
                })
            });

            console.log('Respuesta recibida:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Error HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);
            
            // Limpiar contenedor
            paletteContainer.innerHTML = '';
            
            // Crear paleta con animaciones
            if (data.colors && Array.isArray(data.colors)) {
                data.colors.forEach((color, index) => {
                    const colorSwatch = document.createElement('div');
                    colorSwatch.classList.add('color-swatch');
                    colorSwatch.style.backgroundColor = color;
                    colorSwatch.style.opacity = '0';
                    colorSwatch.style.transform = 'translateY(50px) scale(0.8)';
                    colorSwatch.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
                    colorSwatch.style.transitionDelay = `${index * 0.1}s`;
                    
                    // Información del color
                    const colorInfo = data.emotion_details?.color_meanings?.[index] || 'Color único';
                    colorSwatch.title = `${color} - ${colorInfo}`;
                    
                    // Agregar eventos para interactividad
                    colorSwatch.addEventListener('mouseenter', () => {
                        colorSwatch.style.transform = 'scale(1.05)';
                        colorSwatch.style.filter = 'brightness(1.1)';
                        colorSwatch.style.zIndex = '10';
                    });
                    
                    colorSwatch.addEventListener('mouseleave', () => {
                        colorSwatch.style.transform = 'scale(1)';
                        colorSwatch.style.filter = 'brightness(1)';
                        colorSwatch.style.zIndex = '1';
                    });
                    
                    // Copiar color al hacer clic
                    colorSwatch.addEventListener('click', () => {
                        navigator.clipboard.writeText(color).then(() => {
                            // Mostrar feedback visual
                            const feedback = document.createElement('div');
                            feedback.textContent = 'Copiado!';
                            feedback.style.cssText = `
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: rgba(0,0,0,0.8);
                                color: white;
                                padding: 5px 10px;
                                border-radius: 5px;
                                font-size: 12px;
                                z-index: 1000;
                                animation: fadeInOut 1s ease;
                            `;
                            colorSwatch.style.position = 'relative';
                            colorSwatch.appendChild(feedback);
                            setTimeout(() => feedback.remove(), 1000);
                        }).catch(() => {
                            console.log('No se pudo copiar al portapapeles');
                        });
                    });
                    
                    paletteContainer.appendChild(colorSwatch);
                    
                    // Animar entrada
                    setTimeout(() => {
                        colorSwatch.style.opacity = '1';
                        colorSwatch.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                });

                // Mostrar información detallada de la paleta
                setTimeout(() => {
                    showPaletteInfo(data);
                }, 1000);

            } else {
                throw new Error('No se recibieron colores válidos');
            }

            // Cargar galería
            loadGallery();
            
        } catch (error) {
            console.error("Error completo:", error);
            showStatus(`❌ Error: ${error.message}<br><br>
                <small style="font-size: 1rem;">
                Sugerencias:<br>
                1. Verifica que el backend esté funcionando en ${API_URL}<br>
                2. Abre ${API_URL}/docs para ver si la API responde<br>
                3. Revisa la consola del navegador (F12) para más detalles
                </small>`, true);
        }
    };

    const downloadPalette = () => {
        if (typeof html2canvas === 'undefined') {
            alert('La función de descarga no está disponible. Asegúrate de que html2canvas esté cargado.');
            return;
        }
        
        html2canvas(paletteContainer, {
            useCORS: true,
            scale: 2,
            backgroundColor: null
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `paleta_emocional_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(error => {
            console.error('Error al descargar:', error);
            alert('Error al generar la imagen para descarga');
        });
    };

    const loadGallery = async () => {
        try {
            const response = await fetch(`${API_URL}/gallery`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            galleryGrid.innerHTML = ''; 

            if (!data.palettes || data.palettes.length === 0) {
                galleryGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay paletas guardadas aún. ¡Crea tu primera paleta!</p>';
                return;
            }

            data.palettes.forEach((palette, index) => {
                const card = document.createElement('div');
                card.className = 'gallery-card';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = `all 0.3s ease`;
                card.style.transitionDelay = `${index * 0.05}s`;

                const miniPalette = document.createElement('div');
                miniPalette.className = 'mini-palette';
                
                const colors = palette.colors.split(',');
                colors.forEach(color => {
                    const colorDiv = document.createElement('div');
                    colorDiv.style.backgroundColor = color.trim();
                    colorDiv.style.flex = '1';
                    colorDiv.style.cursor = 'pointer';
                    colorDiv.title = color.trim();
                    
                    // Copiar color al hacer clic
                    colorDiv.addEventListener('click', (e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(color.trim()).then(() => {
                            colorDiv.style.transform = 'scale(1.1)';
                            setTimeout(() => {
                                colorDiv.style.transform = 'scale(1)';
                            }, 150);
                        });
                    });
                    
                    miniPalette.appendChild(colorDiv);
                });

                const text = document.createElement('p');
                text.textContent = `"${palette.input_text}"`;
                text.style.margin = '10px 0 5px 0';
                text.style.fontWeight = '500';
                text.style.lineHeight = '1.4';
                
                const emotion = document.createElement('small');
                emotion.innerHTML = `
                    <i style="color: #007bff;">🎨</i> ${palette.emotion_type || 'Emoción desconocida'} 
                    <span style="margin-left: 10px; color: #28a745;">
                        <i>📊</i> ${palette.analysis_method || 'método desconocido'}
                    </span>
                `;
                emotion.style.display = 'block';
                emotion.style.color = '#666';
                emotion.style.marginBottom = '8px';
                
                const confidence = document.createElement('small');
                const confScore = palette.confidence_score ? (palette.confidence_score * 100).toFixed(1) : 'N/A';
                confidence.innerHTML = `<i>🎯</i> Confianza: ${confScore}% | <i>⚡</i> Intensidad: ${palette.intensity || 'media'}`;
                confidence.style.display = 'block';
                confidence.style.color = '#888';
                confidence.style.marginBottom = '5px';
                
                const date = document.createElement('small');
                date.textContent = new Date(palette.created_at).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                date.style.color = '#999';
                date.style.fontSize = '0.75em';

                card.appendChild(miniPalette);
                card.appendChild(text);
                card.appendChild(emotion);
                card.appendChild(confidence);
                card.appendChild(date);
                
                // Hacer la tarjeta clickeable para regenerar esa paleta
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    textInput.value = palette.input_text;
                    generatePalette();
                    toggleGallery(); // Cerrar galería
                });
                
                galleryGrid.appendChild(card);

                // Animar entrada
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            });
        } catch (error) {
            console.error("Error al cargar la galería:", error);
            galleryGrid.innerHTML = '<p style="text-align: center; color: #dc3545; padding: 20px;">Error al cargar las paletas.</p>';
        }
    };
    
    const toggleGallery = () => {
        galleryContainer.classList.toggle('show');
        if (galleryContainer.classList.contains('show')) {
            loadGallery();
        }
    };

    // Event listeners
    if (generateBtn) generateBtn.addEventListener('click', generatePalette);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadPalette);
    if (galleryBtn) galleryBtn.addEventListener('click', toggleGallery);

    if (textInput) {
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generatePalette();
            }
        });
        
        // Autocompletar sugerencias
        const suggestions = [
            "Me siento muy feliz y emocionado",
            "Estoy un poco triste hoy",
            "Todo está tranquilo y en paz",
            "Siento mucha energía y motivación",
            "Me encuentro melancólico",
            "Estoy lleno de esperanza",
            "Me siento nostálgico",
            "Tengo mucha ansiedad",
            "Estoy en completa calma",
            "Me siento eufórico"
        ];
        
        textInput.addEventListener('focus', () => {
            if (!textInput.value) {
                textInput.placeholder = suggestions[Math.floor(Math.random() * suggestions.length)];
            }
        });
    }

    // Agregar estilos CSS para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
        
        .color-swatch {
            position: relative;
            overflow: hidden;
        }
        
        .gallery-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }
        
        .mini-palette div:hover {
            transform: scale(1.1);
            z-index: 10;
            position: relative;
        }
    `;
    document.head.appendChild(style);

    // Verificar conexión con el backend al cargar
    fetch(`${API_URL}/health`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'healthy') {
                console.log('✅ Conexión con backend exitosa:', data);
                showStatus('🎨 ¡Listo! Escribe algo para comenzar el análisis emocional');
                loadGallery();
            }
        })
        .catch(error => {
            console.error('❌ No se pudo conectar con el backend:', error);
            showStatus(`❌ No se puede conectar con el backend en ${API_URL}<br><br>
                <small>Verifica que el backend esté funcionando</small>`, true);
        });

    console.log('🚀 Frontend iniciado. API URL:', API_URL);
});