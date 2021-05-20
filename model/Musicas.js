const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb+srv://admin:<admin123>@projectweb.blqth.mongodb.net/web2?retryWrites=true&w=majority' ||'mongodb://localhost:27017/web2';

module.exports = class Musicas {
    static async find(nomeMusica) {
        let resultado;
        const conn  = await MongoClient.connect(mongoUrl);
        const db = conn.db();
        resultado = await db.collection('musicas').find({ title: new RegExp('^' + nomeMusica) }).toArray();
        conn.close();
        return resultado;
    }

    static async insert(musica){
        const conn  = await MongoClient.connect(mongoUrl);
        const db = conn.db();
        db.collection('musicas').insertOne({title: musica.title, band: musica.band});
        conn.close();
    }
}