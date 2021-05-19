const MongoClient = require('mongodb').MongoClient;

module.exports = class Users {
    static async login(username, senha) {
        let resultado;
        const conn  = await MongoClient.connect('mongodb://localhost:27017/web2');
        const db = conn.db();
        resultado = await db.collection('users').find({username: username, senha: senha}).toArray();
        conn.close();
        return resultado.length;
    }

    static async cadastro(username, senha){
        const conn  = await MongoClient.connect('mongodb://localhost:27017/web2');
        const db = conn.db();
        let res = await db.collection('users').find({username: username}).toArray();
        if(res.length === 0){
            db.collection('users').insertOne({username: username, senha: senha});   
        }
        conn.close();
    }

    static async isAdm(username, senha){
        const conn  = await MongoClient.connect('mongodb://localhost:27017/web2');
        const db = conn.db();
        let res = await db.collection('users').find({username: username, senha: senha, admin : 1}).toArray();
        if(res.length > 0){
            return true;
        }
        return false;
    }
}