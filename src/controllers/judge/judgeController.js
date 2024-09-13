/* eslint-disable no-unused-vars */
//const WebSocket = require("ws");
const Judge = require("../../models/Judge.js");

// Controller para manipular as operações CRUD relacionadas aos judges
const judgeController = {
  // Retorna todos os judges
  async getAll(req, res) {
    try {
      const judges = await Judge.find();
      res.json(judges);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async create(req, res) {
    const {
      idUsuario,
      idEvento,
      nome,
      login,
      email,
      cpf,
      dataNascimento,
      sexo,
      perfil,
      telefone,
      tipo,
      senha,
      ativo,
    } = req.body;
    try {
      const judge = new Judge({
        idUsuario,
        idEvento,
        nome,
        login,
        email,
        cpf,
        dataNascimento,
        sexo,
        perfil,
        telefone,
        tipo,
        senha,
        ativo,
      });
      await judge.save();

      res.status(201).json(judge);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async createRegister(
    idUsuario,
    idEvento,
    nome,
    login,
    email,
    cpf,
    dataNascimento,
    sexo,
    telefone,
    tipo,
    perfil,
    senha,
    ativo
  ) {
    try {
      const judge = new Judge({
        idUsuario,
        idEvento,
        nome,
        login,
        email,
        cpf,
        dataNascimento,
        sexo,
        telefone,
        tipo,
        perfil,
        senha,
        ativo,
      });
      await judge.save();

      return judge;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async updateJudge(req, res) {
    const { id } = req.params;
    const novosDadosJudge = req.body; // Novos dados do juiz a serem atualizados

    try {
      // Verifique se o juiz com o ID fornecido existe
      const judgeExistente = await Judge.findById(id);

      if (!judgeExistente) {
        return res.status(404).json({ error: "Juiz não encontrado." });
      }

      // Atualize o juiz com os novos dados
      await Judge.findByIdAndUpdate(id, novosDadosJudge);

      // Retorna o juiz atualizado como resposta
      const judgeAtualizado = await Judge.findById(id);
      res.json(judgeAtualizado);
    } catch (error) {
      // Retorna um erro em caso de falha na atualização
      res.status(500).json({ error: "Erro ao atualizar juiz." });
    }
  },
  // Retorna um Judge por atributo
  async getByAttribute(req, res) {
    const {atributos} = req.params;

    try {
      // Construa um objeto de filtro com base nos atributos fornecidos
      /*const filtro = {};
      atributos.forEach((atributo) => {
        const [chave, valor] = atributo.split("=");
        filtro[chave] = valor;
      });*/

      // Consulte juizs com base no filtro construído
      const judges = await Judge.find(JSON.parse(atributos));

      // Retorna os juizs encontrados como resposta
      res.json(judges);
    } catch (error) {
      // Retorna um erro em caso de falha na consulta
      res.status(500).json({ error: "Erro ao buscar juizs." });
    }
  },
  // Verifica login e senha
  async judge(req, res) {
    const { id } = req.params;
    try {
      const judge = await Judge.findById(id);
      if (judge) {
        res.json(judge);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Juiz não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async judgeFiltro(req, res) {
    const { filtro } = req.params;
    try {
      const judge = await Judge.findOne(JSON.parse(filtro));
      if (judge) {
        res.json(judge);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Juiz não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async login(req, res) {
    const { login, senha } = req.body;
    try {
      // Aqui você faria a verificação no banco de dados se o login e senha correspondem a algum registro
      // Este é apenas um exemplo simplificado
      
      const judge = await Judge.findOne({ login: login, senha: senha });
      if (judge.length != 0 && judge.senha === senha) {
        res.json(judge);
      } else {
          res
          .status(401)
          .json({ success: false, message: "Credenciais inválidas" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Remove um Judge
  async remove(req, res) {
    const { id } = req.params;
    try {
      await Judge.findByIdAndDelete(id);
      res.json({ success: true, message: "Judge removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
(judgeController.removeRegisters = async function (atributo, valor) {
  const filtro = { [atributo]: valor };

  // Remover registros que correspondem ao filtro
  await Judge.deleteMany(filtro)
    .then((result) => {
      console.log(`${result.deletedCount} registros removidos`);
    })
    .catch((err) => {
      console.error("Erro ao remover registros:", err);
    });
}),
  (module.exports = judgeController);
