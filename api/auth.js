const jwt = require('jsonwebtoken')

const knex = require('../knex')

const checkToken = (req, res, next) => {
  const authToken = req.headers.authorization
  if (!authToken) {
    res.status(401).json({ message: 'Token de acesso requerida' })
  } else {
    const token = authToken.split(' ')[1]
    req.token = token
  }

  jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
    if (err) {
      res.status(401).json({ message: 'Acesso negado' })
      return
    }
    req.usuarioId = decodeToken.id
    next()
  })
}

const isAdmin = (req, res, next) => {
  knex
    .select('*').from('usuario').where({ id: req.usuarioId })
    .then((usuarios) => {
      if (usuarios.length) {
        const usuario = usuarios[0]
        const roles = usuario.roles.split(';')
        const adminRole = roles.find(i => i === 'ADMIN')
        if (adminRole === 'ADMIN') {
          next()
        } else {
          res.status(403).json({ message: 'Role de ADMIN requerida' })
        }
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Erro ao verificar roles de usuário - ' + err.message })
    })
}

module.exports = {
  checkToken,
  isAdmin
}
