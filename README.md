# TUTORÍAS CON EXPERTOS

DESCRIPCIÓN
Plataforma donde estudiantes de programación realizan consultas concretas a expertos en cada
tecnología. Las preguntas están disponibles para todos los usuarios, las respuestas sólo para los
usuarios registrados.

USUARIO ANÓNIMO# TUTORÍAS CON EXPERTOS

## DESCRIPCIÓN

Plataforma donde estudiantes de programación realizan consultas concretas a expertos en cada tecnología. Las preguntas están disponibles para todos los usuarios, las respuestas sólo para los usuarios registrados.

_USUARIO ANÓNIMO_

- Visualizar la landing

  - Búsqueda por:
    - Nombre
    - Tipo de tecnología/lenguaje
    - Fecha de la consulta
    - Tiene respuesta (o no)

- Login
- Registro (le llega email de registro), se registra como estudiante o como experto en una
  tecnología/lenguaje.

_USUARIOS REGISTRADOS_

(hacen preguntas nuevas, responden o visualizan las respuestas):

- Visualizar la landing

  - Búsqueda por:
    - Nombre
    - Tipo de tecnología/lenguaje
    - Fecha de la consulta
    - Tiene respuesta (o no)

- Gestión del perfil (cambio de datos)
- Enviar la consulta (etiquetando el lenguaje/tecnología) y un usuario experto en esa
  tecnología/lenguaje puede enviar una respuesta.

- Rating de respuestas (después de que contesten). Todos los usuarios pueden dejar un
  rating de una respuesta.

Bonus funcionalidades:
usuario admin.

## ENDPOINTS

### USERS

---

- [x] ⭕️🔒️💀️ **POST - /users/** - Crear el usuario

- [x] ⭕️🔒️💀️ **POST - /users/validate/:RegistrationCode** - Validar el usuario

- [x] ⭕️ **POST - /users/login** - Hará el login de un usuario y
      devolverá el TOKEN

- [x] ⭕️🔒️💀️ **PUT - /users/:id** - Editar un usuario | Token y Solo el
      propio usuario

#### Bonus:

- [ ] ⭕️🔒️💀️ **DELETE - /users/:id/** - borra un usuario | Token obligatorio y mismo usuario
  
- [ ] ⭕️🔒️💀️ **PUT - /users/:id/password** - Editar la contraseña de un usuario | Solo el propio usuario

- [ ] ⭕️🔒️💀️ **POST - /users/:id/photos** - añade una imagen a una entrada | Token obligatorio y mismo usuario.

- [ ] ⭕️🔒️💀️ **DELETE - /users/:id/photos/:photoID** - borra una imagen de una entrada | Token obligatorio y mismo usuario

- [ ] ⭕️ **POST /users/recover-password**

- [ ] ⭕️🔒️💀️ **POST /users/reset-password**

- [ ] ⭕️🔒️💀️ **get /users/** - mostrar usuario

### QUESTIONS

---

- [x] ⭕️ **GET - /questions** - JSON con lista todas las entradas y buscar entradas | Sin token - GET - /questions?name=nombre&category=categoria&date=fecha&answer=true

- [x] ⭕️ **GET - /questions/:id** - JSON que muestra información de una entrada | Sin token

- [x] ⭕️🔒️ **POST - /questions** - crea una entrada | Token obligatorio

- [x] ⭕️🔒️💀️ **PUT - /questions/:id** - edita una entrada | Token obligatorio y mismo usuario.

- [x] ⭕️🔒️💀️ **DELETE - /questions/:id** - borra una entrada | Token obligatorio y mismo usuario.

#### Bonus:

- [ ] ⭕️🔒️💀️ **POST - /questions/:id/photos** - añade una imagen a una entrada | Token obligatorio y mismo usuario.

- [ ] ⭕️🔒️💀️ **DELETE - /questions/:id/photos/:photoID** - borra una imagen de una entrada | Token obligatorio y mismo usuario.

### ANSWERS


- [x] ⭕️🔒️ ****POST - /answers** - crea una respuesta | Token obligatorio y
      solo si es especialis**ta

- [ ] ⭕️🔒️💀️ **POST - /answers/:id/votes** - vota una respuesta | Token
      obligatorio pero cada usuario solo puede votar una vez y las
      entradas no pueden ser votadas por el usuario que las creó.

- [x] ⭕️🔒️💀️ **PUT - /answers/:id** - edita una
      respuesta | Token obligatorio y mismo usuario.

- [x] ⭕️🔒️💀️ **DELETE - /answers/:id** - borra una respuesta | Token
      obligatorio y mismo usuario.

#### Bonus:

- [ ] ⭕️ **GET - /answers/:id** - JSON que muestra información de una
      respuesta | Sin token.

- [ ] ⭕️🔒️💀️ **POST - /answers/:id/photos** - añade una imagen a una
      respuesta | Token obligatorio y mismo usuario (o admin).

- [ ] ⭕️🔒️💀️ **DELETE - /answers/:id/photos/:photoID** - borra una imagen
      de una respuesta | Token obligatorio y mismo usuario.
