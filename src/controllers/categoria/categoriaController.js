/* eslint-disable no-unused-vars */
const WebSocket = require('ws');
const Categoria = require('../../models/Categoria.js');
const bateriaController = require('../bateria/bateriaController');
const Atleta = require('../../models/Atleta.js');
const DataUtil = require('../../utils/DataUtil.js');

// Controller para manipular as operações CRUD relacionadas aos categorias
const categoriaController = {
  // Retorna todos os categorias
  async getAll(req, res) {
    try {
      let categorias = await Categoria.find();
      categorias.forEach((categoria) =>{
         const atletas = Atleta.getAll().filter(filter=>categoria.idade<=filter.idadeAno);
         categoria.atletas=atletas
      })
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Cria um novo categoria pela api
  async createRegistro(
    idUsuario, 
    idEvento, 
    descricao, 
    idade, 
    regra, 
    valorInscricao, 
    qtdAtletasBateria, 
    qtdAtletas,        
    qtdOndaSurfada, 
    tempoBateria,
    altetas,
    sexo,
    cores)  {
    try {
      const categoria = new Categoria({
        idUsuario:idUsuario         ,
        idEvento:idEvento          ,
        descricao:descricao         ,
        idade:idade             ,
        regra :regra             ,
        valorInscricao:valorInscricao    ,
        qtdAtletasBateria:qtdAtletasBateria ,
        qtdAtletas:qtdAtletas,
        qtdOndaSurfada:qtdOndaSurfada, 
        tempoBateria:tempoBateria,
        atletas:[],
        sexo:sexo,
        cores:cores
      });
      const novaCategoria = await categoria.save();

      //await bateriaController.gerarBaterias(novaCategoria.idEvento, novaCategoria._id, novaCategoria.qtdAtletasBateria, novaCategoria.qtdAtletas);

      return novaCategoria;
      
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // Cria um novo categoria pelo browser
  async create(req, res) {
    const { idUsuario, idEvento, descricao, idade, regra, valorInscricao, qtdAtletasBateria, qtdAtletas, qtdOndaSurfada, tempoBateria, sexo, doisSexo, cores } = req.body;
    try {
      const valor = String(valorInscricao).replaceAll('.','').replace(',','.');
      const categoria = new Categoria({
        idUsuario:idUsuario         ,
        idEvento:idEvento          ,
        descricao:descricao         ,
        idade:idade             ,
        regra :regra             ,
        valorInscricao:valor    ,
        qtdAtletasBateria:qtdAtletasBateria ,
        qtdAtletas:qtdAtletas,
        qtdOndaSurfada:qtdOndaSurfada, 
        tempoBateria:tempoBateria,
        atletas:[],
        sexo:sexo,
        cores:cores
      });
      const novaCategoria = await categoria.save();
      if (doisSexo) {
        await new Categoria({
          idUsuario:idUsuario         ,
          idEvento:idEvento          ,
          descricao:descricao         ,
          idade:idade             ,
          regra :regra             ,
          valorInscricao:valor    ,
          qtdAtletasBateria:qtdAtletasBateria ,
          qtdAtletas:qtdAtletas,
          qtdOndaSurfada:qtdOndaSurfada, 
          tempoBateria:tempoBateria,
          atletas:[],
          sexo:sexo==='Masculino'?'Feminino':'Masculino',
          cores:cores
        }).save();
      }
      //await bateriaController.gerarBaterias(novaCategoria.idEvento, novaCategoria._id, novaCategoria.qtdAtletasBateria, novaCategoria.qtdAtletas);

      res.status(201).json(novaCategoria);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }, 

  async atualizar(req, res) {

    const { id } = req.params;
    const novosDadosCategoria = req.body; // Novos dados do categoria a serem atualizados

    try {

      // Verifique se o categoria com o ID fornecido existe
      const categoriaExistente = await Categoria.findById(id);

      if (!categoriaExistente) {
        return res.status(404).json({ error: "Categoria não encontrado." });
      }
      // Atualize o categoria com os novos dados
      await Categoria.findByIdAndUpdate(id, novosDadosCategoria);

      // Retorna o categoria atualizado como resposta
      const categoriaAtualizado = await Categoria.findById(id);
      res.json(categoriaAtualizado);
    } catch (error) {
      // Retorna um erro em caso de falha na atualização
      res.status(500).json({ error: "Erro ao atualizar categoria." });
    }
  },
  // Retorna um Categoria por atributo
  async getByAttribute(req, res) {
    const atributos = req.params.atributos.split("/");

    try {
      // Construa um objeto de filtro com base nos atributos fornecidos
      const filtro = {};
      atributos.forEach((atributo) => {
        const [chave, valor] = atributo.split("=");
        filtro[chave] = valor;
      });
      const opcaoOrdenacao = { descricao: 1 };
      // Consulte categorias com base no filtro construído
      let categorias = await Categoria.find(filtro).sort(opcaoOrdenacao);
      const atletas =  await Atleta.find();

      const ATE         = 'Até';
      const APARTIR     = 'A partir de';      
      const OPEN_AMADOR = 'Open Amador';
      const OPEN_PRO    = 'Open Pro';

      categorias.forEach((categoria)  =>{
        let selecionado = [];
        atletas.filter(filter=>filter.sexo=categoria.sexo).forEach(atleta=>{
          DataUtil.calcularIdade(atleta);
          if ((atleta.idadeAno <= categoria.idade) && categoria.regra == ATE && atleta.idEvento==categoria.idEvento) {
              selecionado.push(atleta);
          } else if ((atleta.idadeAno >= categoria.idade) && categoria.regra == APARTIR && atleta.idEvento==categoria.idEvento) {
              selecionado.push(atleta);
          } else if (categoria.regra == OPEN_AMADOR && atleta.idEvento==categoria.idEvento && atleta.profissional!=true) {
              selecionado.push(atleta);
          } else if (categoria.regra == OPEN_PRO && atleta.idEvento==categoria.idEvento && atleta.profissional==true) {
              selecionado.push(atleta);
          }
        });
        categoria.atletas=selecionado
        //atletas.filter(filter=>(categoria.idade<=filter.idadeAno && filter.idEvento==categoria.idEvento))
     })
      // Retorna os categorias encontrados como resposta
      res.json(categorias);
    } catch (error) {
      // Retorna um erro em caso de falha na consulta
      res.status(500).json({ error: "Erro ao buscar categorias." });
    }
  },
  // Remove um Categoria
  async remove(req, res) {
    const { id } = req.params;
    try {
      await Categoria.findByIdAndDelete(id);
      res.json({ success: true, message: "Categoria removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async get(req, res) {
    const { id } = req.params;
    try {
      const categoria = await Categoria.findById(id);
      if (categoria) {
        res.json(categoria);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Categoria não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
}
categoriaController.removeRegisters = async function(atributo, valor) {

  const filtro = { [atributo]: valor };

  // Remover registros que correspondem ao filtro
  await Categoria.deleteMany(filtro)
    .then((result) => {
      console.log(`${result.deletedCount} registros removidos`);
    })
    .catch((err) => {
      console.error("Erro ao remover registros:", err);
    });
};
module.exports = categoriaController;