/* eslint-disable no-unused-vars */
const WebSocket = require('ws');
const Categoria = require('@/models/Categoria.js');

// Controller para manipular as operações CRUD relacionadas aos categorias
const categoriaController = {
  // Retorna todos os categorias
  async getAll(req, res) {
    try {
      const categorias = await Categoria.find();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cria um novo categoria
  async create(req, res) {
    const { idUsuario, idEvento, descricao, idade, regra, valorInscricao, qtdAtletasBateria, qtdAtletas } = req.body;
    try {
      
      const categoria  = await this.createRegistro(idUsuario, idEvento, descricao, idade, regra, valorInscricao, qtdAtletasBateria, qtdAtletas);

      res.status(201).json(categoria);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },      
  async createRegistro(idUsuario, idEvento, descricao, idade, regra, valorInscricao, qtdAtletasBateria, qtdAtletas) {
    try {
      const categoria = new Categoria({
        idUsuario         ,
        idEvento          ,
        descricao         ,
        idade             ,
        regra             ,
        valorInscricao    ,
        qtdAtletasBateria ,
        qtdAtletas
      });
      await categoria.save();

      return categoria;
      
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async atualizarCategoria(req, res) {

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

      // Consulte categorias com base no filtro construído
      const categorias = await Categoria.find(filtro);

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
};

module.exports = categoriaController;