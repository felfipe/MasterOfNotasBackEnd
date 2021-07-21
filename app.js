const express = require('express')
require("dotenv-safe").config()
const app = express()
const cors = require('cors')
const port = 3000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1 style="color : blue;"> MasterOfNotas Back-End! <\h1>')
})

require('./routes/login')(app)
require('./routes/signup')(app)

// ---------------- Rotas professor ---------------- //
require('./routes/professor/listar-alunos')(app)
require('./routes/professor/listar-disciplinas')(app)
require('./routes/professor/criar-disciplina')(app)
require('./routes/professor/criar-questao')(app)
require('./routes/professor/criar-enquete')(app)
require('./routes/professor/atualizar-disciplina')(app)
require('./routes/professor/set-alunos-disciplina')(app)
require('./routes/professor/iniciar-enquete')(app)
require('./routes/professor/encerrar-enquete')(app)
require('./routes/professor/listar-disciplina')(app)
require('./routes/professor/deletar-disciplina')(app)
require('./routes/professor/listar-enquetes')(app)

// ---------------- Rotas aluno ---------------- //
require('./routes/aluno/listar-disciplinas')(app)
require('./routes/aluno/listar-enquetes-disponiveis')(app)
require('./routes/aluno/listar-questoes')(app)
require('./routes/aluno/responder-enquete')(app)
require('./routes/aluno/listar-enquete-by-id')(app)

app.listen(port, () => {
  require('./db-index')
  console.log(`Ouvindo na porta ${port}`)
})