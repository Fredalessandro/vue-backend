/* eslint-disable no-unused-vars */
const WebSocket = require('ws');
const Evento = require('../../models/Evento.js');
const categoriaController = require('../categoria/categoriaController.js');
const { forEach } = require('core-js/core/array');
const { default: Constantes } = require('@/models/Constantes.js');

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
    const {idUsuario, nome, login, email, telefone, tipo, senha } = req.body;
    try {
      const evento = new Evento({
        idUsuario,
        nome,
        login,
        email,
        telefone,
        tipo,
        senha,
      });
      await evento.save();
      Constantes.
      forEach
      categoriaController.createRegistro

      res.status(201).json(evento);
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
        const [chave, valor] = atributo.split("=");
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
      res.json({ success: true, message: "Evento removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = eventoController;