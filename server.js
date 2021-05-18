let http = require('http'),
    path = require('path'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    app = express(),
    Musicas = require('./model/Musicas'),
    User = require('./model/Users');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', function (req, res, next) {
    if(req.cookies && req.cookies.login) {
        res.render('cadastroMusica');
        return ;
    }
    res.redirect('login');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/busca', async (req, res) => {
    const musicas = await Musicas.find(req.query.busca);
    res.render('paginaDeBusca', { musicas: musicas})
})

app.get('/cadastro', (req, res) => {
    res.render('cadastroMusica');
})

app.post('/cadastro', async (req, res) => {
    const musica = {
        title: req.body.title,
        band: req.body.band
    }
    Musicas.insert(musica);
    res.end();
})

app.post('/login', async (req, res) => {
    let username = req.body.username,
        senha = req.body.senha,
        login = await User.login(username, senha);
    if(login > 0) {
        res.cookie('login', username);
        res.redirect('/');
        return ;
    }else{
        res.status(403);
        res.write('<h1>Não foi possivel entrar!</h1>');
        res.end();
    }
})

app.get('/cadastroUser', (req, res) => {
    res.render('cadastroUsuario');
})

app.post('/cadastroUser', async (req, res) => {
    await User.cadastro(req.body.username, req.body.senha);
    res.redirect('/login');
})

app.listen(3000);