# M.plugin.{{archetype.plugin.name}}

## Api.json

INTEGRACIÓN DE PARÁMETROS EN API REST

OPCIONES:  
1. Nuevo parámetro en la API REST normalmente porque requiera parámetros de configuración.
Example: <url_api_core>?printermap=[params]

2. Nuevo valor para el parámetro plugins, el plugin no requiere configuración
Example: <url_api_core>?plugins=measurebar,vectors


### Plugin sin parámetros

```
{
   "url": {
      "name": "nombre_plugin"
   },
   "constructor": "M.plugin.nombre_plugin"
}
```
### Plugin con parámetros

```
{
   "url": {
      "name": "geosearch",
      "separator": "*"
   },
   "constructor": "M.plugin.Geosearch",
   "parameters": [{
      "type": "object",
      "properties": [{
         "type": "simple",
         "name": "url",
         "position": 0
      }, {
         "type": "simple",
         "name": "core",
         "position": 1
      }, {
         "type": "simple",
         "name": "handler",
         "position": 2
      }]
   }]
}
```
