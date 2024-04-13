/* eslint-disable no-unused-vars */
const WebSocket = require('ws');
const Evento = require('../../models/Evento.js');
const categoriaController = require('../categoria/categoriaController.js');
const usuarioController = require('../usuario/usuarioController.js');
const atletaController = require('../atleta/atletaController.js');
const bateriaController = require('../bateria/bateriaController.js');


// Controller para manipular as operações CRUD relacionadas aos eventos
const eventoController = {
  // Retorna todos os eventos
  async getAll(req, res) {
    try {
      const eventos = await Evento.find();
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cria um novo evento
  async create(req, res) {
    const {idUsuario, evento, local, dataInicio, dataFinal, status } = req.body;
    
    const categorias = [    
        {idEvento:null,descricao:'Até 6',idade:6,regra:'Até',valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Até 8',idade:8,regra:'Até',valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Até 10',idade:10,regra:'Até',valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Até 12',idade:12,regra:'Até',valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Até 14',idade:14,regra:'Até',valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Até 16',idade:16,regra:'Até',valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Até 18',idade:18,regra:'Até',valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Open Amador',idade:0,regra:'Até',        valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Open Pro',   idade:0,regra:'Open Pro',   valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Master',     idade:35,regra:'Master',    valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'GraMaster',  idade:40,regra:'GraMaster', valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Karruna',    idade:50,regra:'Karruna',   valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16},
        {idEvento:null,descricao:'Legend',     idade:50,regra:'Legend',    valorInscricao:50,qtdAtletasBateria:4,qtdAtletas:16}
    ];

    const usuariosJuizes = [
        {nome:'JUIZ PRINCIPAL'  ,login:'JP01' ,email:'juizprincipal@nsl.com'    ,telefone:'81988888888' ,tipo:'JUIZ' ,perfil:'JUIZ PRINCIPAL' ,senha:'010101' ,ativo: true},
        {nome:'PRIMEIRO JUIZ'   ,login:'J001' ,email:'primeirojuiz@nsl.com'     ,telefone:'81988888888' ,tipo:'JUIZ' ,perfil:'JUIZ'           ,senha:'010102' ,ativo: true},
        {nome:'SEGUNDO JUIZ'    ,login:'J002' ,email:'segundojuiz@nsl.com'      ,telefone:'81988888888' ,tipo:'JUIZ' ,perfil:'JUIZ'            ,senha:'010103' ,ativo: true},
        {nome:'TERCEIRO JUIZ'   ,login:'J003' ,email:'terceirojuiz@nsl.com'     ,telefone:'81988888888' ,tipo:'JUIZ' ,perfil:'JUIZ'            ,senha:'010104' ,ativo: true},
        {nome:'QUARTO JUIZ'     ,login:'J004' ,email:'quartojuiz@nsl.com'       ,telefone:'81988888888' ,tipo:'JUIZ' ,perfil:'JUIZ'            ,senha:'010105' ,ativo: true},
    ];

    const atletas = [
        {idEvento:null,nome:'LEONADO MATEUS'   ,apelidio:'LEONADO MATEUS',   email:'LEONADOMATEUS@nsl.com.br'    ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2010',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:101,rankEstadual:200,idadeAno:0},
        {idEvento:null,nome:'MIGUEL GOMES'     ,apelidio:'MIGUEL GOMES',     email:'MIGUELGOMES@nsl.com.br'      ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:10, rankEstadual:200,idadeAno:0}, 
        {idEvento:null,nome:'HEITOR GOMES'     ,apelidio:'HEITOR GOMES',     email:'HEITORGOMES@nsl.com.br'      ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:159,rankEstadual:211,idadeAno:0}, 
        {idEvento:null,nome:'GABRIEL MEDEIROS' ,apelidio:'GABRIEL MEDEIROS', email:'GABRIELMEDEIROS@nsl.com.br'  ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:102,rankEstadual:200,idadeAno:0}, 
        {idEvento:null,nome:'GABRIEL CIPRIANO' ,apelidio:'GABRIEL CIPRIANO', email:'GABRIELCIPRIANO@nsl.com.br'  ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'MACEIO',uf:'AL',rankNordestino:103,rankEstadual:120,idadeAno:0},
        {idEvento:null,nome:'SHAR BOY'         ,apelidio:'SHAR BOY',         email:'SHARBOY@nsl.com.br'          ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:104,rankEstadual:201,idadeAno:0}, 
        {idEvento:null,nome:'DAVI BRASIL'      ,apelidio:'DAVI BRASIL',      email:'DAVIBRASIL@nsl.com.br'       ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:98, rankEstadual:300,idadeAno:0}, 
        {idEvento:null,nome:'GABRIEL BRASIL'   ,apelidio:'GABRIEL BRASIL',   email:'GABRIELBRASIL@nsl.com.br'    ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:25, rankEstadual:250,idadeAno:0},  
        {idEvento:null,nome:'JONAS GABRIEL'    ,apelidio:'JONAS GABRIEL',    email:'JONASGABRIEL@nsl.com.br'     ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:122,rankEstadual:200,idadeAno:0},
        {idEvento:null,nome:'NICOLAS CLAUDINO' ,apelidio:'NICOLAS CLAUDINO', email:'NICOLASCLAUDINO@nsl.com.br'  ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:131,rankEstadual:99 ,idadeAno:0}, 
        {idEvento:null,nome:'NICOLAS MIGUEL'   ,apelidio:'NICOLAS MIGUEL',   email:'NICOLASMIGUEL@nsl.com.br'    ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'MACEIO',uf:'AL',rankNordestino:102,rankEstadual:111,idadeAno:0}, 
        {idEvento:null,nome:'ALESSANDRO FELLIX',apelidio:'ALESSANDRO FELLIX',email:'ALESSANDROFELLIX@nsl.com.br' ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:103,rankEstadual:98 ,idadeAno:0}, 
        {idEvento:null,nome:'PAULIINHO EDC'    ,apelidio:'PAULIINHO EDC',    email:'PAULIINHEDC@nsl.com.br'      ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:111,rankEstadual:99 ,idadeAno:0},
        {idEvento:null,nome:'NICOLAS DANIEL'   ,apelidio:'NICOLAS DANIEL',   email:'NICOLASDANIEL@nsl.com.br'    ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'MACEIO',uf:'AL',rankNordestino:121,rankEstadual:80 ,idadeAno:0}, 
        {idEvento:null,nome:'CAUÃ LUCIO XAVIER',apelidio:'CAUÃ LUCIO XAVIER',email:'CAUALUCIOXAVIER@nsl.com.br'  ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'MACEIO',uf:'AL',rankNordestino:131,rankEstadual:0  ,idadeAno:0}, 
        {idEvento:null,nome:'IURY ROCHA'       ,apelidio:'IURY ROCHA',       email:'IURYROCHA@nsl.com.br'        ,telefone:'81988888888',cpf:'621.374.924-11',dataNascimento:'10/03/2014',cep:'50900-120',endereco:'RUA DO SURF',numero:'10',complemento:'',bairro:'VIBER',cidade:'RECIFE',uf:'PE',rankNordestino:100,rankEstadual:0  ,idadeAno:0},  
    ]; 

    try {
      const evt = new Evento({
        idUsuario, 
        evento, 
        local, 
        dataInicio, 
        dataFinal, 
        status
      });
      const novoEvento = await evt.save();
      
      categorias.forEach(categoria => {
        categoriaController.createRegistro(novoEvento.idUsuario,        
                                           novoEvento._id,         
                                           categoria.descricao,        
                                           categoria.idade,            
                                           categoria.regra,            
                                           categoria.valorInscricao,   
                                           categoria.qtdAtletasBateria,
                                           categoria.qtdAtletas       )
      });
      
      usuariosJuizes.forEach(juiz => {
        usuarioController.createRegister(
          novoEvento._id,
          juiz.nome,
          juiz.login,
          juiz.email,
          juiz.telefone,
          juiz.tipo,
          juiz.senha,
          juiz.ativo);
      });

      atletas.forEach(atleta => {
        atletaController.createRegister(
          novoEvento._id,
          atleta.nome,
          atleta.apelidio,
          atleta.email,
          atleta.telefone,
          atleta.cpf,
          atleta.dataNascimento,
          atleta.cep,
          atleta.endereco,
          atleta.numero,
          atleta.complemento,
          atleta.bairro,
          atleta.cidade,
          atleta.uf,
          atleta.rankNordestino,
          atleta.rankEstadual,
          atleta.idadeAno
        );
      });

      res.status(201).json(novoEvento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async atualizarEvento(req, res) {

    const { id } = req.params;
    const novosDadosEvento = req.body; // Novos dados do evento a serem atualizados

    try {

      // Verifique se o evento com o ID fornecido existe
      const eventoExistente = await Evento.findById(id);

      if (!eventoExistente) {
        return res.status(404).json({ error: "Evento não encontrado." });
      }

      // Atualize o evento com os novos dados
      await Evento.findByIdAndUpdate(id, novosDadosEvento);

      // Retorna o evento atualizado como resposta
      const eventoAtualizado = await Evento.findById(id);
      res.json(eventoAtualizado);
    } catch (error) {
      // Retorna um erro em caso de falha na atualização
      res.status(500).json({ error: "Erro ao atualizar evento." });
    }
  },
  // Retorna um Evento por atributo
  async getByAttribute(req, res) {
    const atributos = req.params.atributos.split("/");

    try {
      // Construa um objeto de filtro com base nos atributos fornecidos
      const filtro = {};
      atributos.forEach((atributo) => {
        const [chave, valor] = atributo.split('=');
        filtro[chave] = valor;
      });

      // Consulte eventos com base no filtro construído
      const eventos = await Evento.find(filtro);

      // Retorna os eventos encontrados como resposta
      res.json(eventos);
    } catch (error) {
      // Retorna um erro em caso de falha na consulta
      res.status(500).json({ error: "Erro ao buscar eventos." });
    }
  },


  // Remove um Evento
  async remove(req, res) {
    const { id } = req.params;
    try {
      await Evento.findByIdAndDelete(id);
      await categoriaController.removeRegisters('idEvento',id);
      await bateriaController.removeRegisters('idEvento',id);
      await atletaController.removeRegisters('idEvento',id);
      await usuarioController.removeRegisters('idEvento',id);
      res.json({ success: true, message: "Evento removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = eventoController;