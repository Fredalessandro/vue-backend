/* eslint-disable no-unused-vars */
const WebSocket = require('ws');
const Bateria = require('../../models/Bateria.js');
const Atleta = require('../../models/Atleta.js');

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
    const { idEvento, idCategoria, sequencia, descricao, round, status, avanca } = req.body;
    try {
      
      const bateria = new Bateria({
        idEvento:idEvento,
        idCategoria:idCategoria,
        sequencia:sequencia,
        descricao:descricao,
        round:round,
        status:status,
        avanca:status
      });
      
      const noovaBateria = await bateria.save();
      
      res.status(201).json(noovaBateria);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },      
  async createRegistro(idEvento, idCategoria, sequencia, descricao, seqBateria, round, seqRound, status, avanca) {
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
        avanca
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
    const atributos = req.params.atributos.split("/");

    try {
      // Construa um objeto de filtro com base nos atributos fornecidos
      const filtro = {};
      atributos.forEach((atributo) => {
        const [chave, valor] = atributo.split("=");
        filtro[chave] = valor;
      });

      // Consulte baterias com base no filtro construído
      const baterias = await Bateria.find(filtro);

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
  async gerar(req, res) {
    
    const { idEvento, idCategoria, qtdAtletasBateria, qtdAtletas, atletas } = req.body;
    
    const filtro = {idCategoria: idCategoria };

    // Remover registros que correspondem ao filtro
    await Bateria.deleteMany(filtro)
      .then((result) => {
        console.log(`${result.deletedCount} registros removidos`);
      })
      .catch((err) => {
        console.error("Erro ao remover registros:", err);
      });

    const baterias = [];

    let totalBaterias = Math.ceil(qtdAtletas / qtdAtletasBateria);
    let strRound = 1;
    let sequencia = 1;

    const objetosAtletaChaveados = [];
    const objetosAtleta = [];


    // Algoritmo de Fisher-Yates para embaralhar a lista
    for (let i = atletas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [atletas[i], atletas[j]] = [atletas[j], atletas[i]];
    }


    while (totalBaterias>=1) {
      
      console.log("Quantidade baterias " + totalBaterias);
      
      let objetosGeral = [];

      for (let i = 0; i < totalBaterias; i++) {
        
        let descricao = (totalBaterias===1)?"Bateria Final ":(i + 1) + "ª Bateria ";
        let round = (totalBaterias===1)?"Round Final":strRound+"º Round";

        let objetos = [];
       
        try {

          if (strRound==1) {

            for (let index = 0; index < qtdAtletasBateria; index++) {
              let atletaBateria = null;

              if (index == 0) {
                let inseriu = false;
                atletas.forEach((atleta) => {
                  if (
                    !objetosGeral.find((objeto) => objeto._id === atleta._id) &&
                    !inseriu &&
                    atleta.cabecaChave
                  ) {
                    objetos.push(atleta);
                    objetosGeral.push(atleta);
                    console.log("Chaveado " + atleta.nome);
                    inseriu = true;
                  }
                });

                if (!inseriu) {
                  atletas.forEach((atleta) => {
                    if (!objetosGeral.find((objeto) => objeto._id === atleta._id)) {
                      objetos.push(atleta);
                      objetosGeral.push(atleta);
                      console.log("Não Chaveado " + atleta.nome);
                    }
                  });
                }
              } else {
                let inseriu = false;
                atletas.forEach((atleta) => {
                  if (
                    !objetosGeral.find((objeto) => objeto._id === atleta._id) &&
                    !inseriu
                  ) {
                    objetos.push(atleta);
                    objetosGeral.push(atleta);
                    console.log("Não Chaveado " + atleta.nome);
                    inseriu = true;
                  }
                });
              }
            }
          }
          const bateria = new Bateria({
            idEvento: idEvento,
            idCategoria: idCategoria,
            sequencia: sequencia,
            descricao,
            seqBateria: i + 1,
            round: round,
            seqRound: strRound,
            stats: "Aguardando",
            avanca: 2,
            atletas: objetos,
          });

          await bateria.save();
        } catch (error) {
          console.error("Erro ao gravar baterias:", error);
        }
      }

      if (totalBaterias!=1){
        strRound++
        totalBaterias = Math.ceil((qtdAtletas/strRound) / qtdAtletasBateria);
      } else {
        totalBaterias = 0;
      }

    } 

  }  
  
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