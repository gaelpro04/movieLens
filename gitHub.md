
# Apuntes gitHub

Para iniciar un git en un proyecto local que aun no se ha subido es:

Existe una premisa que es:
>git comando donde que

dondoe el comando es que tipo de accion se realizara, mientras que el donde es de donde vienen los cambios (el repo en github) y el que es a que lugar mandaras los cambios. (una branch en el repo escogido)

Por lo tanto

git push origin master: mandars los nuevos cambios de origin que es tu repo local al branch master

>git init
>git add .
>git commit -m "Descripcion del commit"
>git remote add origin "link del repo creado.git"
>git push -u origin branch

Despeus de este proceso ya simplemente cada vez que se haga un cambio se sube.

Para subir:

>git add . o el archivo que se haya creado o modificado
>git commit -m "Descripcion del commit"
>git push origin branch

para traer:

git fetch origin  //descarga el contenido del repo en gitub pero no me traigas lo nuevo aun

git merge origin/branch //del contenido del repo en github en la rama branch combina lo nuevo con lo viejo y si hay conflictos los marcas