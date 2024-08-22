/* eslint-disable no-unused-vars */
//const WebSocket = require('ws');
const Bateria = require('../../models/Bateria.js');
const Atleta = require('../../models/Atleta.js');
const Constante = require('../../utils/Constante.js')

// Controller para manipular as operações CRUD relacionadas aos baterias
const bateriaController = {
  // Retorna todos os baterias
  async getAll(req, res) {
    try {
      const baterias = await Bateria.find();
      res.json(baterias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cria um novo bateria
  async create(req, res) {
    const {
      idEvento,
      idCategoria,
      sequencia,
      descricao,
      round,
      status,
      avanca,
    } = req.body;
    try {
      const bateria = new Bateria({
        idEvento: idEvento,
        idCategoria: idCategoria,
        sequencia: sequencia,
        descricao: descricao,
        round: round,
        status: status,
        avanca: status,
      });

      const noovaBateria = await bateria.save();

      res.status(201).json(noovaBateria);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async createRegistro(
    idEvento,
    idCategoria,
    sequencia,
    descricao,
    seqBateria,
    round,
    seqRound,
    status,
    avanca
  ) {
    try {
      const bateria = new Bateria({
        idEvento,
        idCategoria,
        sequencia,
        descricao,
        seqBateria,
        round,
        seqRound,
        status,
        avanca,
      });
      await bateria.save();

      return bateria;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const novosDadosBateria = req.body; // Novos dados do bateria a serem atualizados

    try {
      // Verifique se o bateria com o ID fornecido existe
      const bateriaExistente = await Bateria.findById(id);

      if (!bateriaExistente) {
        return res.status(404).json({ error: "Bateria não encontrado." });
      }

      // Atualize o bateria com os novos dados
      await Bateria.findByIdAndUpdate(id, novosDadosBateria);

      // Retorna o bateria atualizado como resposta
      const bateriaAtualizado = await Bateria.findById(id);
      res.json(bateriaAtualizado);
    } catch (error) {
      // Retorna um erro em caso de falha na atualização
      res.status(500).json({ error: "Erro ao atualizar bateria." });
    }
  },
  // Retorna um Bateria por atributo
  async getByAttribute(req, res) {
    const {filtro} = req.params;

    try {
      // Construa um objeto de filtro com base nos atributos fornecidos
      /*const filtro = {};
      atributos.forEach((atributo) => {
        const [chave, valor] = atributo.split("=");
        filtro[chave] = valor;
      });*/

      // Consulte baterias com base no filtro construído
      const baterias = await Bateria.find(JSON.parse(filtro));

      // Retorna os baterias encontrados como resposta
      res.json(baterias);
    } catch (error) {
      // Retorna um erro em caso de falha na consulta
      res.status(500).json({ error: "Erro ao buscar baterias." });
    }
  },

  // Remove um Bateria
  async remove(req, res) {
    const { id } = req.params;
    try {
      await Bateria.findByIdAndDelete(id);
      res.json({ success: true, message: "Bateria removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async generate(req, res) {
    const { idEvento, idCategoria, qtdAtletasBateria, qtdAtletas, atletas } =
      req.body;

    const filtro = { idCategoria: idCategoria };
    try {
      // Remover registros que correspondem ao filtro
      await Bateria.deleteMany(filtro)
        .then((result) => {
          console.log(`${result.deletedCount} registros removidos`);
        })
        .catch((err) => {
          console.error("Erro ao remover registros:", err);
        });

      for (let i = atletas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [atletas[i], atletas[j]] = [atletas[j], atletas[i]];
      }
      let atletasMap = new Map();
      atletas.forEach((atleta) => {
        atletasMap.set(atleta._id,atleta);
      });
      const formato = Constante.formatos[qtdAtletas];
      let baterias = [];
      let sequencia = 0;
      formato.forEach((fase) => {
        let i = 1;
        for (let x = 0; x < fase.baterias; x++) {
          let bateria = new Bateria({
            idEvento: idEvento,
            idCategoria: idCategoria,
            fase : fase.fase,
            bateria: i,
            sequencia: ++sequencia,
            descricao:
              fase.descricao === "Final" ? `Final` : `${i}ª Bateria`,
            seqBateria: i,
            round: fase.descricao,
            stats: "Aguardando",
            avanca: 2,
            qtdAtletas: fase.atletas,
          });
          if (fase.fase==1) {
            bateriaController.addAthletes(atletasMap,bateria);
          } 
          baterias.push(bateria);
          ++i;
        }
        
      });
      await baterias.forEach((bateria) => bateria.save());
      res.status(200).json("Baterias geradas com sucesso.");
    } catch (error) {
      res.status(400).json({ error: error.message });
      throw error;
    }
  },
   
};

bateriaController.addAthletes = function(atletasMap, bateria) {

  const elements = [bateria.qtdAtletas];

  for (let i = 0; i < bateria.qtdAtletas; i++) {
    let atleta=null;
    if (i == 0) {
      atleta = atletasMap.forEach(element=>{
          if (element.cabecaChave) {{
             return element;
          }}
      });
      if (!atleta) {
        atleta = [...atletasMap][0];
      }
    } else {
      atleta = [...atletasMap][0];
    }
    if (atleta) {
      elements[i] = atleta[1];
      atletasMap.delete(atleta[1]._id);
    } 
  }
  bateria.atletas = elements;
};
bateriaController.removeRegisters = async function(atributo, valor) {

    const filtro = { [atributo]: valor };

    // Remover registros que correspondem ao filtro
    await Bateria.deleteMany(filtro)
      .then((result) => {
        console.log(`${result.deletedCount} registros removidos`);
      })
      .catch((err) => {
        console.error("Erro ao remover registros:", err);
      });
};

module.exports = bateriaController;