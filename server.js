let http = require('http'),
    path = require('path'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    app = express(),
    Musicas = require('./model/Musicas'),
    User = require('./model/Users'),
    cors = require('cors');

app.use(cors());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'R2I5C0A5R1D9O99',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.get('/', function (req, res) {
    if(req.cookies && req.cookies.login && req.session && req.session.login && req.session.adm) {
        res.render('cadastroMusica');
        return ;
    }else{
        res.redirect('login');
    }
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/busca', async (req, res) => {
    if(req.cookies && req.cookies.login && req.session && req.session.login){
        const musicas = await Musicas.find(req.query.busca);
        res.render('paginaDeBusca', { musicas: musicas});
    }else{
        res.redirect('login');
    }
})

app.post('/cadastro', async (req, res) => {
    if(req.cookies && req.cookies.login && req.session && req.session.login && req.session.adm){
        const musica = {
            title: req.body.title,
            band: req.body.band
        }
        Musicas.insert(musica);
        res.render('cadastroMusica');
    }
})

app.post('/login', async (req, res) => {
    let username = req.body.username,
        senha = req.body.senha,
        login = await User.login(username, senha);
    if(login > 0) {
        res.cookie('login', username);
        req.session.login = username;
        if(await User.isAdm(username, senha)){
            req.session.adm = true;
            res.render('cadastroMusica');
        }else{
            res.redirect('/busca');
        }
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

app.listen(process.env.PORT || 3000);