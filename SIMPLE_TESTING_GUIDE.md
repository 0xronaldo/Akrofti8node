# Akroft i8 Node - Testing Guide (Simplified)

## 🚀 Quick Start

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev
```

Abrir `http://localhost:3000`

## ✅ Tests Rápidos

### 1. Visual Design
- **✅ Logo**: Debe mostrar formas fluidas con gradiente azul-to-cyan
- **✅ Colores**: Fondo negro, gradientes azul (#1E3A8A) a cyan (#00FFFF)
- **✅ Fuente**: Orbitron para títulos, aspecto futurista y limpio
- **✅ Animaciones**: Medusas flotantes, logo pulsante, efectos hover suaves

### 2. Web3 Functionality
- **✅ MetaMask**: Click "Connect Wallet" → debe abrir MetaMask
- **✅ Estado conectado**: Muestra dirección truncada (0x1234...5678)
- **✅ Registro**: Llena email (opcional) → "Register with Wallet" → Tableland
- **✅ Demo Contract**: "Test Swap Contract" → Alert con detalles mock

### 3. Responsive
- **✅ Mobile**: Grid de features se convierte en 1 columna
- **✅ Desktop**: Grid de 4 columnas, medusas bien espaciadas
- **✅ Hover**: Efectos de escala y glow en tarjetas y botones

## 🎨 Design Validation

### Colores Akroft Logo
- **Azul profundo**: #1E3A8A (fondo del hero)
- **Azul medio**: #3B82F6 (acentos)
- **Cyan puro**: #00FFFF (highlights y efectos)
- **Negro**: #000000 (secciones principales)
- **Gris oscuro**: #111827 (secciones alternas)

### Estilo Minimalista (Grass-inspired)
- Diseño limpio sin saturación visual
- Espacios generosos entre elementos
- Tipografía clara y legible
- Efectos sutiles pero impactantes
- Focus en funcionalidad sobre decoración

## 🧪 Test Checklist

- [ ] App carga sin errores
- [ ] Logo se ve correcto con gradientes azul-cyan
- [ ] MetaMask conecta (requiere extensión instalada)
- [ ] Animaciones de medusas funcionan suavemente
- [ ] Responsive en móvil y desktop
- [ ] Tableland registration funciona
- [ ] Demo de smart contract muestra alert
- [ ] Todos los botones tienen hover effects
- [ ] Fuente Orbitron carga correctamente

## 🎯 Demo Flow

1. **Abrir** `localhost:3000`
2. **Mostrar** logo y gradientes del hero
3. **Conectar** MetaMask wallet
4. **Navegar** por features (4 tarjetas)
5. **Observar** animaciones de medusas
6. **Registrar** usuario (opcional email + wallet)
7. **Probar** demo de smart contract
8. **Click** "Enter Flow Editor"

## 🚀 Deploy Ready

```bash
# Build production
pnpm build

# Deploy en Vercel
# Conectar GitHub repo → Auto-deploy
```

**Estado:** ✅ Listo para hackathon con diseño simplificado, colores correctos del logo, y funcionalidades Web3 completas.