/* eslint-disable no-unused-vars */
const WebSocket = require("ws");
const Usuario = require("../../models/Usuario.js");

// Controller para manipular as operações CRUD relacionadas aos usuarios
const usuarioController = {
  // Retorna todos os usuarios
  async getAll(req, res) {
    try {
      const usuarios = await Usuario.find();
      res.json(usuarios);
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
      const usuario = new Usuario({
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
      await usuario.save();

      res.status(201).json(usuario);
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
      const usuario = new Usuario({
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
      await usuario.save();

      return usuario;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async updateUser(req, res) {
    const { id } = req.params;
    const novosDadosUsuario = req.body; // Novos dados do usuário a serem atualizados

    try {
      // Verifique se o usuário com o ID fornecido existe
      const usuarioExistente = await Usuario.findById(id);

      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Atualize o usuário com os novos dados
      await Usuario.findByIdAndUpdate(id, novosDadosUsuario);

      // Retorna o usuário atualizado como resposta
      const usuarioAtualizado = await Usuario.findById(id);
      res.json(usuarioAtualizado);
    } catch (error) {
      // Retorna um erro em caso de falha na atualização
      res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
  },
  // Retorna um Usuario por atributo
  async getByAttribute(req, res) {
    const atributos = req.params.atributos.split("/");

    try {
      // Construa um objeto de filtro com base nos atributos fornecidos
      const filtro = {};
      atributos.forEach((atributo) => {
        const [chave, valor] = atributo.split("=");
        filtro[chave] = valor;
      });

      // Consulte usuários com base no filtro construído
      const usuarios = await Usuario.find(filtro);

      // Retorna os usuários encontrados como resposta
      res.json(usuarios);
    } catch (error) {
      // Retorna um erro em caso de falha na consulta
      res.status(500).json({ error: "Erro ao buscar usuários." });
    }
  },
  // Verifica login e senha
  async user(req, res) {
    const { id } = req.params;
    try {
      const usuario = await Usuario.findById(id);
      if (usuario) {
        res.json(usuario);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Usuário não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async userFiltro(req, res) {
    const { filtro } = req.params;
    try {
      const usuario = await Usuario.findOne(JSON.parse(filtro));
      if (usuario) {
        res.json(usuario);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Usuário não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async checkLogin(req, res) {
    const { login, senha } = req.body;
    try {
      // Aqui você faria a verificação no banco de dados se o login e senha correspondem a algum registro
      // Este é apenas um exemplo simplificado
      
      const usuario = await Usuario.find({ login: login, senha: senha });
      if (usuario.length != 0 && usuario[0].senha === senha) {
        res.json(usuario[0]);
      } else {
        const totalRecord = await Usuario.countDocuments();
        if (login.toLowerCase()==='afred' && totalRecord === 0) {
          const usuario = Usuario({
            idUsuario: null,
            nome: 'ALESSANDRO',
            login: 'afred',
            email: 'fredalessandro@gmail.com',
            cpf: '621.374.924-15',
            telefone: '(81)98414-7601',
            dataNascimento: '1971-10-27',
            senha: '312831',
            sexo: 'Masculino',
            tipo: 'Admin',
            ativo: true
          })
          await usuario.save();
          res.json(usuario);
        } else {
          res
          .status(401)
          .json({ success: false, message: "Credenciais inválidas" });
        }

      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Remove um Usuario
  async remove(req, res) {
    const { id } = req.params;
    try {
      await Usuario.findByIdAndDelete(id);
      res.json({ success: true, message: "Usuario removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
(usuarioController.removeRegisters = async function (atributo, valor) {
  const filtro = { [atributo]: valor };

  // Remover registros que correspondem ao filtro
  await Usuario.deleteMany(filtro)
    .then((result) => {
      console.log(`${result.deletedCount} registros removidos`);
    })
    .catch((err) => {
      console.error("Erro ao remover registros:", err);
    });
}),
  (module.exports = usuarioController);
