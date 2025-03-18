const db = require('./db')

const Usuarios = db.sequelize.define('usuarios', {
    username: {
        type: db.Sequelize.STRING
    },
    password: {
        type: db.Sequelize.STRING
    }
})

// Sincroniza o modelo com o banco de dados
Usuarios.sync({ force: true }).then(() => {
    console.log('Tabela Usuarios criada com sucesso!')
}).catch(err => {
    console.error('Erro ao criar tabela Usuarios:', err)
})

module.exports = Usuarios