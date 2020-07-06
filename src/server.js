//#region Passos para iniciar o servidor Node.Js

// 1- Instalar o Node Package Manager - NPM -> npm install npm@latest -g
// Criar pasta package.json
// 2- Instalar o Express -> npm install express --save
// 3- Instalar o Nodemon -> npm install -g nodemon
// 4- Instalar o Nunjucks -> npm install nunjucks
// 5- Instalar o DataBase - No caso aqui será instalado o SQLite -> npm install sqlite3
//#endregion

const express = require("express");
const server = express();

//Pegar o banco de dados
const db = require("./database/db");

//Configurar pasta publica
server.use(express.static("public"));

//Habilitar o uso do Req.body
server.use(express.urlencoded({extended: true}));

//Habilitar ao backend receber Json
server.use(express.json());

//Utilizando template engine - para poder editar htmls
const nunjucks = require("nunjucks");
nunjucks.configure("src/views",{
    express: server,
    noCache: true
});

server.get("/", function(req, res){
    db.all(`SELECT * FROM db_cards order by status asc`, function(error, rows){
        return res.render("index.html",{ cards: rows });
    });   
});

//#region Métodos post para atualizar DB

//#region Método post para cadastrar novos cards
server.post('/add-new-card',function(req,res){
   const query = `INSERT INTO db_cards (
                        status,
                        colorTag,
                        content
                    ) VALUES (?,?,?);`;
    const values = [
        req.body.opt,
        req.body.status,
        req.body.context
    ];
    //Depois de inserir retorna sucesso/erro
    function afterInsertData(error){
        if (error){
            return console.log(error);
        }
        console.log("Cadastrado com sucesso!");
        console.log(this);
    }

    db.run(query, values, afterInsertData);
    res.end();
});
//#endregion

//#region Método post para atualizar status de cards existentes
server.post('/update-status-card',function(req,res){
    const query = `UPDATE db_cards SET status = ? where id = ? ;`;
    const values = [req.body.opt, req.body.idOfDraggedCard];

     //Depois de inserir retorna sucesso/erro
    function afterInsertData(error){
        if (error){
            return console.log(error);
        }
        console.log("Cadastrado com sucesso!");
        console.log(this);
    }
 
    db.run(query, values, afterInsertData);
    res.end();
 });
//#endregion

//#region Método post para deletar card
server.post('/delete-card',function(req,res){
    const query = `DELETE FROM db_cards WHERE id = ? ;`;
    const values = [req.body.idOfDraggedCard];

     //Depois de inserir retorna sucesso/erro
    function afterInsertData(error){
        if (error){
            return console.log(error);
        }
        console.log("Excluido com sucesso!");
        console.log(this);
    }
 
    db.run(query, values, afterInsertData);
    res.end();
 });
//#endregion

//#endregion

//Ligar o servidor
server.listen(3000);