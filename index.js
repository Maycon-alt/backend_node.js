const express = require('express'); //importa o express
const fs = require('fs'); //fs para operações no arquivo .json

const server = express();

server.use(express.json()); //funçao para reconhecer json

const lerData = fs.readFileSync('cursos.json');
const data = JSON.parse(lerData); //converter a strig json lida em um objeto no javascript
// const cursos = data.universidades;
// console.log(cursos);

//retorna todos os cursos
server.get('/list', (req, res) =>{
    return res.json(data.universidades);
});

//criar novo curso
server.post('/insert', (req,res) =>{
    const { sigla, nome, url } = req.body;
    // console.log(req)
    // Adiciona uma nova universidade
    data.universidades.push({ sigla, nome, url });
    const jsonString = JSON.stringify(data); //converte de objeto para string .json
    fs.writeFileSync('cursos.json', jsonString); //escreve no arquivo
    // console.log("ok")
    return res.json(jsonString);
});

//deletar um curso
server.delete('/delete/:index', (req, res) => {
    const { index } = req.params;
    
    data.universidades.splice(index, 1);
    const jsonString = JSON.stringify(data);
    fs.writeFileSync('cursos.json', jsonString);
    console.log("ok")
    return res.json(jsonString);
    // return res.json({ message: "O curso foi removido" });
});


server.listen(3000);