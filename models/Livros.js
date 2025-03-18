const db = require('./db')

const Livros = db.sequelize.define('livros', {
    titulo: {
        type: db.Sequelize.STRING
    },
    autor: {
        type: db.Sequelize.STRING
    },
    editora: {
        type: db.Sequelize.STRING
    },
    genero: {
        type: db.Sequelize.STRING
    },
    anoPublicacao: {
        type: db.Sequelize.INTEGER
    },
    preco: {
        type: db.Sequelize.FLOAT
    },
    disponivel: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: true
    }
})

// Sincroniza o modelo com o banco de dados
Livros.sync({ force: true }).then(() => {
    console.log('Tabela Livros criada com sucesso!')
}).catch(err => {
    console.error('Erro ao criar tabela Livros:', err)
})

module.exports = Livros

