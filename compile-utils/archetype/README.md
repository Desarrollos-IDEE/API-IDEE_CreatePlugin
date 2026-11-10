<p align="center">
  <img src="https://api-idee.juntadeandalucia.es/estaticos/imagenes/logos/API_IDEE/API_2/API_2.svg" height="152" />
</p>
<h1 align="center"><strong>API IDEE</strong> <small>🔌 IDEE.plugin.{{archetype.plugin.name}}</small></h1>

# Descripción

Plugin básico (plantilla) para crear otros plugins externos sobre API-IDEE v2 con SidePanel.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:
Para uso de implementación OpenLayers:

- **{{archetype.plugin.id}}.ol.min.js**
- **{{archetype.plugin.id}}.ol.min.css**

Para uso de implementación Cesium:

- **{{archetype.plugin.id}}.cesium.min.js**
- **{{archetype.plugin.id}}.cesium.min.css**

# Uso del histórico de versiones

Existe un histórico de versiones de todos los plugins en el directorio `legacy/` de cada plugin.
Es recomendable fijar las versiones para evitar errores inesperados.

Ejemplo con el plugin {{archetype.plugin.name}}, implementación OpenLayers y versión 2.0.0:

- {{archetype.plugin.id}}-2.0.0.ol.min.css
- {{archetype.plugin.id}}-2.0.0.ol.min.js

# Parámetros

| Parámetro | Tipo | Por defecto | Descripción |
| ----------- | ------ | ------------- | ------------- |
| `position` | `left` \| `right` | `right` | Barra de herramientas donde se muestra el botón del plugin |
| `collapsed` | `boolean` | `true` | Indica si el panel aparece colapsado al inicio |
| `order` | `number` | — | Orden del botón/panel entre controles y plugins |
| `tooltip` | `string` | `Plantilla plugin` | Texto al pasar el ratón sobre el botón |

# API-REST

```javascript
URL_API?{{archetype.plugin.id}}=position*collapsed*order*tooltip
```

<table>
    <tr>
        <th>Parámetros</th>
        <th>Opciones/Descripción</th>
        <th>Disponibilidad</th>
    </tr>
    <tr>
        <td>position</td>
        <td>left / right</td>
        <td>Base64 ✔️ | Separador ✔️</td>
    </tr>
    <tr>
        <td>collapsed</td>
        <td>true / false</td>
        <td>Base64 ✔️ | Separador ✔️</td>
    </tr>
    <tr>
        <td>order</td>
        <td>number</td>
        <td>Base64 ✔️ | Separador ✔️</td>
    </tr>
    <tr>
        <td>tooltip</td>
        <td>string</td>
        <td>Base64 ✔️ | Separador ✔️</td>
    </tr>
</table>

### Ejemplos de uso API-REST

```
https://api-idee.juntadeandalucia.es/api-idee?{{archetype.plugin.id}}=right*true*0*Plantilla
```

### Ejemplo de uso API-REST en base64

```javascript
IDEE.utils.encodeBase64({
  position: 'right',
  collapsed: true,
  order: 0,
  tooltip: 'Plantilla plugin',
});
```

# Ejemplo de uso

```javascript
const mp = new IDEE.plugin.{{archetype.plugin.name}}({
  position: 'right',
  collapsed: true,
  order: 0,
  tooltip: 'Plantilla plugin',
});

map.addPlugin(mp);
```

# 👨‍💻 Desarrollo

Para el stack de desarrollo de este componente se ha utilizado

- NodeJS Versión: 16 o superior
- NPM Versión: 8.19.4 o superior

## 📐 Configuración del stack de desarrollo / *Work setup*

### 🐑 Clonar el repositorio / *Cloning repository*

```bash
git clone [URL del repositorio]
```

### 1️⃣ Instalación de dependencias / *Install Dependencies*

```bash
npm i
```

### 2️⃣ Arranque del servidor de desarrollo / *Run Application*

```bash
npm run start:ol
npm run start:cesium
```

## 📂 Estructura del código / *Code scaffolding*

```any
/
├── src 📦                  # Código fuente
├── legacy 📁               # Histórico de versiones
├── task 📁                 # EndPoints
├── test 📁                 # Testing
├── webpack-config 📁       # Webpack configs
└── ...
```

## 📌 Metodologías y pautas de desarrollo / *Methodologies and Guidelines*

Metodologías y herramientas usadas en el proyecto para garantizar el Quality Assurance Code (QAC)

- ESLint
  - [NPM ESLint](https://www.npmjs.com/package/eslint) \
  - [NPM ESLint | Airbnb](https://www.npmjs.com/package/eslint-config-airbnb)

## ⛽️ Revisión e instalación de dependencias / *Review and Update Dependencies*

Para la revisión y actualización de las dependencias de los paquetes npm es necesario instalar de manera global el paquete/ módulo "npm-check-updates".

```bash
# Install and Run
$npm i -g npm-check-updates
$ncu
```

## Tabla de compatibilidad de versiones

[Consulta el api resourcePlugin](https://api-idee.juntadeandalucia.es/api-idee/api/actions/resourcesPlugins?name={{archetype.plugin.id}})
