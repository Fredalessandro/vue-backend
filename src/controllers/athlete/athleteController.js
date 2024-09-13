/* eslint-disable no-unused-vars */
const Atleta = require('../../models/Atleta.js');
const DataUtil = require('../../utils/DataUtil.js');


// Controller para manipular as operações CRUD relacionadas aos atletas
const athleteController = {
  // Retorna todos os atletas
  async getAll(req, res) {
    try {
      const atletas = await Atleta.find();
      res.json(atletas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async get(req, res) {
    const { id } = req.params;
    try {
      const atleta = await Atleta.findById(id);
      if (atleta) {
        res.json(atleta);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Atleta não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async filtro(req, res) {
    const { filtro } = req.params;
    try {
      const atleta = await Atleta.findOne(JSON.parse(filtro));
      if (atleta) {
        res.json(atleta);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Atleta não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async createRegister(
    idEvento,
    nome,
    login,
    senha,
    apelidio,
    email,
    telefone,
    cpf,
    dataNascimento,
    cep,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    uf,
    rankNordestino,
    rankEstadual,
    idadeAno,
    cabecaChave,
    isento,
    tipo,
    sexo,
    ativo
  ) {
    try {
      const atleta = new Atleta({
        idEvento,
        nome,
        login,
        senha,
        apelidio,
        email,
        telefone,
        cpf,
        dataNascimento,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
        rankNordestino,
        rankEstadual,
        idadeAno,
        cabecaChave,
        isento,
        tipo,
        sexo,
        ativo
      });
      DataUtil.calcularIdade(atleta);
      await atleta.save();

      return atleta;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async create(req, res) {
    const {
      idEvento,
      nome,
      login,
      senha,
      apelidio,
      email,
      telefone,
      cpf,
      dataNascimento,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      rankNordestino,
      rankEstadual,
      idadeAno,
      cabecaChave,
      isento,
      tipo,
      sexo,
      ativo
    } = req.body;
    try {
      
      const atleta = new Atleta({
        idEvento,
        nome,
        login,
        senha,
        apelidio,
        email,
        telefone,
        cpf,
        dataNascimento,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
        rankNordestino,
        rankEstadual,
        idadeAno,
        cabecaChave,
        isento,
        tipo,
        sexo,
        ativo
      });
      
      DataUtil.calcularIdade(atleta);

      const novoAtleta = await atleta.save();
      
      res.status(200).json(novoAtleta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async atualizar(req, res) {
    const { id } = req.params;
    const novosDadosAtleta = req.body; // Novos dados do usuário a serem atualizados

    try {
      // Verifique se o usuário com o ID fornecido existe
      const atletaExistente = await Atleta.findById(id);

      if (!atletaExistente) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
      DataUtil.calcularIdade(novosDadosAtleta);
      // Atualize o usuário com os novos dados
      await Atleta.findByIdAndUpdate(id, novosDadosAtleta);

      // Retorna o usuário atualizado como resposta
      const atletaAtualizado = await Atleta.findById(id);
      res.json(atletaAtualizado);
    } catch (error) {
      // Retorna um erro em caso de falha na atualização
      res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
  },
  // Retorna um Atleta por atributo
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
      const opcaoOrdenacao = { nome: 1 };
      let atletas = await Atleta.find(filtro).sort(opcaoOrdenacao);

      // Retorna os usuários encontrados como resposta
      res.json(atletas);
    } catch (error) {
      // Retorna um erro em caso de falha na consulta
      res.status(500).json({ error: "Erro ao buscar usuários." });
    }
  },
  // Verifica login e senha
  async checkLogin(req, res) {
    const { login, senha } = req.body;
    try {
      // Aqui você faria a verificação no banco de dados se o login e senha correspondem a algum registro
      // Este é apenas um exemplo simplificado
      const atleta = await Atleta.find({ login: login, senha: senha });
      if (atleta.length != 0) {
        res.json(atleta[0]);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Credenciais inválidas" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Remove um Atleta
  async remove(req, res) {
    const { id } = req.params;
    try {
      await Atleta.findByIdAndDelete(id);
      res.json({ success: true, message: "Atleta removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}
athleteController.removeRegisters = async function(atributo, valor) {

    const filtro = { [atributo]: valor };

    // Remover registros que correspondem ao filtro
    await Atleta.deleteMany(filtro)
      .then((result) => {
        console.log(`${result.deletedCount} registros removidos`);
      })
      .catch((err) => {
        console.error("Erro ao remover registros:", err);
      });

},

module.exports = athleteController;