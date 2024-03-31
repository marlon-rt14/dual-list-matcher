# DUAL LIST MATCHER 💣

# Información ℹ️

En este proyecto se muestra cómo se puede conectar 2 elementos mediante una línea. Ésta línea puede ser guionada o una flecha. Del mismo modo la conexión podrá ser unidireccional o bidireccional.

# Ventajas 📈
Los componentes mostrados a continuación son exclusivos para trabajar siempre con 2 listas sin importar su tamaño, en las cuales se realizará un match o conexión. No obstante, los items pueden ser de cualquier tipo permitiendo asi renderizar cualquier elemento, ya sea que se trate de estructuras simples como un texto o complejas con imagenes, texto o multimedia.

Además al estar construido con Typescript. A nivel de programación,  estos datos son genéricos lo que resulta fácil conocer sus tipos de datos según la lista que enviemos. De esta forma podemos reusar tantas veces como deseemos nuestro componente con muchos datos diferentes y sin afectar su funcionamiento. Además de que nos ayuda el autocompletado. 

# Funcionamiento  🚀

La librería [react-xarrows](https://www.npmjs.com/package/react-xarrows) nos permitirá realizar un conexión o enlace entre 2 elementos. 

En este proyecto se puede apreciar 2 listas, permitiendo al usuario hacer el match a cualquier elemento sin importar si las listas están ordenadas o no. 

No importa el escenario en que el usuario realice el match, siempre va tener los resultados deseados. 

Para poder realizar esta conexión entre 2 elementos, la librería trabaja con 2 parámetros. 
1. El elemento A debe ser una referencia (`useRef()`)
2. El elemento B debe ser identificado por su id (string) 
```html
<div id='destiny'></div>
```

Para trabajar con listas, se crea una lista de **referencias** según el tamaño de la lista. Y se asigna cada referencia a cada elemento de la lista A. Del mismo modo los elementos de la lista B deben ser identificados por su ID. Una buena idea es usar el **id de cada objeto de la lista** o el index. 

Ejemplo lista B
```html
<div id='1'></div>
<div id=`item-${1}`></div>
```


## Restricciones 🔒

- Las listas que recibe como parámetros debe ser un Array de Objetos. Y cada objeto debe tener una propiedad llamada `id` de tipo `string`.

```js
const myList = {
  id: "string",
  // ...
};
```

## Tecnologías usadas 💡
✅ ReactJS

✅ ViteJS

✅ Typescript

✅ TailwindCSS

✅ react-xarrows


## Instalación 💽

1. Clonar el repositorio
2. Instalar las dependencias, puedes usar `npm` `yarn` `bun` o el de tu preferencia
3. Ecutar el proyecto y abrir en http://localhost:3000/

Puedes cambiar el puerto en el archivo `vite.config.ts`
