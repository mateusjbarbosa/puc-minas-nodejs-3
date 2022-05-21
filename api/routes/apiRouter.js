const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const knex = require('../../knex')
const { checkToken, isAdmin } = require('../auth')

const apiRouter = express.Router()

const endpoint = '/'

apiRouter.post(endpoint + 'seguranca/register', (req, res) => {
  knex('usuario')
    .insert({
      nome: req.body.nome,
      login: req.body.login,
      senha: bcrypt.hashSync(req.body.senha, 8),
      email: req.body.email
    }, ['id'])
    .then((result) => {
      const usuario = result[0]
      res.status(200).json({ id: usuario.id })
    })
    .catch(err => {
      res.status(500).json({ message: 'Erro ao registrar usuario - ' + err.message })
    })
})

apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
  knex
    .select('*').from('usuario').where({ login: req.body.login })
    .then(usuarios => {
      if (usuarios.length) {
        const usuario = usuarios[0]
        const checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha)
        if (checkSenha) {
          const tokenJWT = jwt.sign({ id: usuario.id },
            process.env.SECRET_KEY, {
              expiresIn: 3600
            })

          res.status(200).json({
            id: usuario.id,
            login: usuario.login,
            nome: usuario.nome,
            roles: usuario.roles,
            token: tokenJWT
          })
          return
        }
      }

      res.status(200).json({ message: 'Login ou senha incorretos' })
    })
    .catch(err => {
      res.status(500).json({ message: 'Erro ao verificar login - ' + err.message })
    })
})

apiRouter.get(endpoint + 'produtos', checkToken, (req, res) => {
  knex.select('*').from('produto')
    .then(produtos => res.status(200).json(produtos))
    .catch(err => {
      res.status(500).json({ message: 'Erro ao recuperar produtos - ' + err.message })
    })
})

apiRouter.get(endpoint + 'produtos/:id', checkToken, (req, res) => {
  const id = req.params.id
  knex.select('*').from('produto').where('id', id)
    .then(produto => res.status(200).json(produto))
    .catch(err => {
      res.status(500).json({ message: 'Erro ao recuperar produto - ' + err.message })
    })
})
apiRouter.post(endpoint + 'produtos', checkToken, isAdmin, (req, res) => {
  const produto = req.body
  knex('produto').insert(produto)
    .then(() => res.status(201).json(produto))
    .catch(err => {
      res.status(500).json({ message: 'Erro ao inserir produto - ' + err.message })
    })
})
apiRouter.put(endpoint + 'produtos/:id', checkToken, isAdmin, (req, res) => {
  const id = req.params.id
  const produto = req.body
  knex('produto').where('id', id).update(produto)
    .then(() => res.status(200).json(produto))
    .catch(err => {
      res.status(500).json({ message: 'Erro ao atualizar produto - ' + err.message })
    })
})
apiRouter.delete(endpoint + 'produtos/:id', checkToken, isAdmin, (req, res) => {
  const id = req.params.id
  knex('produto').where('id', id).del()
    .then(() => res.status(204).json({}))
    .catch(err => {
      res.status(500).json({ message: 'Erro ao excluir produto - ' + err.message })
    })
})

module.exports = apiRouter
