const express = require('express')
const cors = require('cors')
const app = express()
const conn = require('./db/conn')

app.use(express.json())

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

app.use(express.static('public'))

//rotas
const UserRoutes = require('./routes/UserRoutes')
const TarefaRoutes = require('./routes/TarefaRoutes')
const DepartamentoRoutes = require('./routes/DepartamentoRoutes')
const ComentariosRoutes = require('./routes/ComentariosRoutes')
const ArquiveRoutes = require('./routes/ArquiveRoutes')
app.use('/users', UserRoutes)
app.use('/tarefa', TarefaRoutes)
app.use('/departamento', DepartamentoRoutes)
app.use('/comentario', ComentariosRoutes)
app.use('/arquive', ArquiveRoutes)

conn
    .sync()
    .then(() => {
        app.listen(8000)
    })
    .catch((err) => console.log(err))