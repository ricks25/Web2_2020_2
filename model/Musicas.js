const MongoClient = require('mongodb').MongoClient;

module.exports = class Musicas {
    static async find(nomeMusica) {
        let resultado;
        const conn  = await MongoClient.connect('mongodb://localhost:27017/web2');
        const db = conn.db();
        resultado = await db.collection('musicas').find({ title: new RegExp('^' + nomeMusica) }).toArray();
        conn.close();
        return resultado;
    }

    static async insert(musica){
        const conn  = await MongoClient.connect('mongodb://localhost:27017/web2');
        const db = conn.db();
        db.collection('musicas').insertOne({title: musica.title, band: musica.band});
        conn.close();
    }
}