const express = require('express'); //importa o express
const cors = require('cors');

const app = express();
var cache = null;

app.use(express.json()); //funçao para reconhecer json
app.use(cors());

//retorna todos os cursos
app.get('/list', async (req, res) =>{
    try {
        const resposta = await fetch('http://localhost:3000/list');
        const dados = await resposta.json();
        return res.json(dados);
      } catch (erro) {
        console.error('Erro ao fazer a requisição:', erro.message);
        return res.status(500).json({ error: 'Erro ao obter dados do servidor' });
    }
});

//adicionar
app.get('/insert', async (req, res) =>{
    // console.log("vasco");
    
    // Use req.query para acessar os parâmetros da query string
    const { sigla, nome, url } = req.body;
    
    var confPost = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            'sigla': sigla,
            'nome': nome,
            'url': url
        })
    };

    try {
        // console.log("oi");
        const response = await fetch('http://localhost:3000/insert', confPost);
        
        const responseData = await response.json();
        // console.log(responseData);

        if (response.status === 200) {
            cache = null; // cache recebe null pq a cache ta desatualizada
            res.statusCode = 200;
            return res.end(JSON.stringify({ msg: 'sucesso!' }));
        } else {
            res.statusCode = 400;
            return res.end(JSON.stringify({ msg: 'Falha!', error: responseData.error }));
        }
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ msg: 'Erro interno no servidor' }));
    }
});

//deletar
app.get('/delete/:index', async (req, res) => {
    const { index } = req.params; // Obtém o índice a partir dos parâmetros de rota
    const { sigla } = req.body; // Obtém a sigla dos parâmetros de consulta

    var confPatch = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            'sigla': sigla
        })
    };

    try {
        console.log("oi");
        const response = await fetch(`http://localhost:3000/delete/${index}`, confPatch);

        const responseData = await response.json();
        console.log(responseData);

        if (response.ok) {
            cache = null;
            res.status(200).json({ msg: 'Retirado com sucesso!' });
        } else {
            res.status(400).json({ msg: 'Falha!', error: responseData.error });
        }
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        res.status(500).json({ msg: 'Erro interno no servidor' });
    }
});



app.listen(3001);
console.log("Servidor rodando na porta 3001!")