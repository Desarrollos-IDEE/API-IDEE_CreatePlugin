<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>API-IDEE</strong> <small>🔌 IDEE.plugin.{{archetype.plugin.name}}</small></h1>

# Descripción

Plugin básico para crear otros plugins

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **{{archetype.plugin.id}}.ol.min.js**
- **{{archetype.plugin.id}}.ol.min.css**

```html
<link
  href="https://componentes.idee.es/api-idee/plugins/{{archetype.plugin.id}}/{{archetype.plugin.id}}.ol.min.css"
  rel="stylesheet"
/>
<script
  type="text/javascript"
  src="https://componentes.idee.es/api-idee/plugins/{{archetype.plugin.id}}/{{archetype.plugin.id}}.ol.min.js"
></script>
```

# Uso del histórico de versiones

Existe un histórico de versiones de todos los plugins de API-IDEE en [api-idee-legacy](https://github.com/Desarrollos-IDEE/API-IDEE/tree/develop/api-idee-legacy/plugins) para hacer uso de versiones anteriores.
Ejemplo:

```html
<link
  href="https://componentes.idee.es/api-idee/plugins/{{archetype.plugin.id}}/{{archetype.plugin.id}}-1.0.0.ol.min.css"
  rel="stylesheet"
/>
<script
  type="text/javascript"
  src="https://componentes.idee.es/api-idee/plugins/{{archetype.plugin.id}}/{{archetype.plugin.id}}-1.0.0.ol.min.js"
></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Indica si el plugin viene colapsado de entrada (true/false). Por defecto: true.
- **collapsible**: Indica si el plugin puede abrirse y cerrarse (true) o si permanece siempre abierto (false). Por defecto: true.
- **tooltip**. Información emergente para mostrar en el tooltip del plugin (se muestra al dejar el ratón encima del plugin como información). Por defecto: 'Plantilla plugin'
- **draggable**. Indica si el plugin puede arrastrarse.

# API-REST

```javascript
URL_API?{{archetype.plugin.id}}=position*collapsed*collapsible*tooltip*draggable
```

<table>
  <tr>
    <th>Parámetros</th>
    <th>Opciones/Descripción</th>
    <th>Disponibilidad</th>
  </tr>
  <tr>
    <td>position</td>
    <td>TR/TL/BR/BL</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>collapsed</td>
    <td>true/false</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>collapsible</td>
    <td>true/false</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>tooltip</td>
    <td>Valor a usar para mostrar en el tooltip del plugin</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>isDraggable</td>
    <td>true/ alse</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
</table>

### Ejemplos de uso API-REST

```
https://componentes.idee.es/api-idee/?{{archetype.plugin.id}}=TR*true*true*PluginBase*false
```

```
https://componentes.idee.es/api-idee/?{{archetype.plugin.id}}=TR*true*true
```

(Omitir los últimos parámetros usa valores por defecto.)

### Ejemplos de uso API-REST en Base64

Ejemplo del constructor:

```javascript
{
    "position": "TL",
    "collapsed": true,
    "collapsible": true,
    "tooltip": "Plantilla",
    "isDraggable": true
}
```

URL de ejemplo con ese JSON codificado en Base64:

```
https://componentes.idee.es/api-idee/?{{archetype.plugin.id}}=base64=ewogICAgInBvc2l0aW9uIjogIlRMIiwKICAgICJjb2xsYXBzZWQiOiB0cnVlLAogICAgImNvbGxhcHNpYmxlIjogdHJ1ZSwKICAgICJ0b29sdGlwIjogIlBsYW50aWxsYSIsCiAgICAiaXNEcmFnZ2FibGUiOiB0cnVlCn0=
```

# Ejemplo de uso

```javascript
const mp = new IDEE.plugin.{{archetype.plugin.name}}({
  position: 'TR',
});

map.addPlugin(mp);
```

# 👨‍💻 Desarrollo

Para el stack de desarrollo de este componente se ha utilizado

- NodeJS Version: 14.16
- NPM Version: 6.14.11
- Entorno Windows.

## 📐 Configuración del stack de desarrollo / _Work setup_

### 🐑 Clonar el repositorio / _Cloning repository_

Para descargar el repositorio en otro equipo lo clonamos:

```bash
git clone [URL del repositorio]
```

### 1️⃣ Instalación de dependencias / _Install Dependencies_

```bash
npm i
```

### 2️⃣ Arranque del servidor de desarrollo / _Run Application_

```bash
npm run start
```

## 📂 Estructura del código / _Code scaffolding_

```any
/
├── src 📦                  # Código fuente
├── task 📁                 # EndPoints
├── test 📁                 # Testing
├── webpack-config 📁       # Webpack configs
└── ...
```

## 📌 Metodologías y pautas de desarrollo / _Methodologies and Guidelines_

Metodologías y herramientas usadas en el proyecto para garantizar el Quality Assurance Code (QAC)

- ESLint
  - [NPM ESLint](https://www.npmjs.com/package/eslint) \
  - [NPM ESLint | Airbnb](https://www.npmjs.com/package/eslint-config-airbnb)

## ⛽️ Revisión e instalación de dependencias / _Review and Update Dependencies_

Para la revisión y actualización de las dependencias de los paquetes npm es necesario instalar de manera global el paquete/ módulo "npm-check-updates".

```bash
# Install and Run
$npm i -g npm-check-updates
$ncu
```
