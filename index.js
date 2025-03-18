const express = require("express");
const app = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require("path")
const { Op } = require('sequelize');
const Usuarios = require('./models/Usuarios');
const Livros = require("./models/Livros");

// Config
    // Template Engine
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            }
        }))
        app.set('view engine', 'handlebars')
    // Body Parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
    // Style
        app.use(express.static(path.join(__dirname,"style")))
//Rotas

app.get('/', function(req, res){
    res.render('login')
})

app.get('/cadastro', function(req, res){
    res.render('cadastro')
})

app.get('/livraria', function(req, res){
    Livros.findAll({order: [['id', 'DESC']]}).then(function(livros){
        res.render('livraria', { livros: livros})
    })
})

app.get('/editarLivro/:id', function(req, res){
    const bookId = req.params.id

    Livros.findByPk(bookId).then(function(livro){
        if(livro){
            res.render('editarLivro', {livro: livro})
        } else {
            res.status(404).send('Livro não encontrado')
        }
    }).catch(function(erro){
        res.status(500).send('Livro não encontrado.')
    })
})

app.get('/buscarLivros', function(req, res) {
    const query = req.query.q;

    Livros.findAll({
        where: {
            [Op.or]: [
                { titulo: { [Op.like]: `%${query}%` } },
                { autor: { [Op.like]: `%${query}%` } },
                { genero: { [Op.like]: `%${query}%` } },
                { editora: { [Op.like]: `%${query}%` } },
                { anoPublicacao: { [Op.like]: `%${query}%` } },
                { preco: { [Op.like]: `%${query}%` } }
            ]
        }
    }).then(function(livros) {
        res.render('livraria', { livros: livros });
    }).catch(function(err) {
        console.error('Erro ao buscar livros:', err);
        res.render('error', { message: 'Erro ao buscar livros.' });
    });
});

app.get('/logout', function(req, res){
    res.redirect('/')
})

app.post('/cadastrar', function(req, res){
    username = req.body.newUsername
    password = req.body.newPassword
    confirmPassword = req.body.confirmPassword
    
    if(password !== confirmPassword){
        return res.render('cadastro', {message: 'As senhas não coincidem. '})
    }

    Usuarios.create({
        username: username,
        password: password
    }).then(function(){
        res.redirect('/')
    }).catch(function(erro){
        res.send("Usuário não cadastrado. "+erro)
    })
})

app.post('/logar', function(req, res){
    username = req.body.username
    password = req.body.password
    
    Usuarios.findOne({where: {username, password}}).then(function(usuario){
        if(usuario){
            res.redirect('/livraria')
        } else {
            res.render('login', {message: 'Usuário ou senha incorretos.'})
        }
    }).catch(function(erro){
        res.render('login', {message: "Erro ao tentar fazer login. "+ erro.message})
    })
})

app.post('/cadLivros', function (req, res) {
    title = req.body.title
    author = req.body.author
    genre = req.body.genre
    pub = req.body.pub
    year = req.body.year
    price = req.body.price
    available = req.body.available === 'on'

    Livros.create({
        titulo: title,
        autor: author,
        genero: genre,
        editora: pub,
        anoPublicacao: year,
        preco: price,
        disponivel: available
    }).then(function(){
        res.redirect('livraria')
    }).catch(function(erro){
        res.render('livraria', {message: "Não foi possível criar o livro. "+ erro.message})
    })
})

app.post('/atualizarLivro/:id', function (req, res) {
    bookId = req.params.id;
    title = req.body.title
    author = req.body.author
    genre = req.body.genre
    pub = req.body.pub
    year = req.body.year
    price = req.body.price
    available = req.body.available === 'on'

    Livros.update({
        titulo: title,
        autor: author,
        genero: genre,
        editora: pub,
        anoPublicacao: year,
        preco: price,
        disponivel: available
    }, {
        where: { id: bookId }
    }).then(function (rowsUpdated) {
        if (rowsUpdated[0] > 0) {
            res.redirect('/livraria');
        } else {
            res.status(404).send('Livro não encontrado');
        }
    }).catch(function (err) {
        console.error('Erro ao atualizar livro:', err);
        res.status(500).send('Erro ao atualizar livro');
    });
});

app.post('/deletarLivro/:id', function(req, res) {
    const bookId = req.params.id;

    Livros.destroy({ where: { id: bookId } })
        .then(function(deleted) {
            if (deleted) {
                res.redirect('/livraria');
            } else {
                res.status(404).send('Livro não encontrado');
            }
        })
        .catch(function(err) {
            console.error('Erro ao deletar livro:', err);
            res.status(500).send('Erro ao deletar livro');
        });
});


app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081")
});