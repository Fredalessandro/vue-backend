/* eslint-disable no-unused-vars */
//const WebSocket = require('ws');
const Bateria = require('../../models/Bateria.js');
const Atleta = require('../../models/Atleta.js');
const Constante = require('../../utils/Constante.js');
const Judge = require('../../models/Judge.js');
const { judge } = require('../judge/judgeController.js');
const NumberUtil = require('../../utils/NumberUtil.js');
const { json } = require('express');

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
  async generateScore(req, res) {
    try {
        
        const { id } = req.params;
        const object = req.body;
        const idJuiz = object.idJuiz;

        console.log('Onda selecionada:', object.atleta);
        console.log("Juiz", idJuiz);

        const atletaRet  = object.atleta;
        const notaAtleta = object.nota.nota.nota;
        const notaMinima = object.notaMinima;
        const notaMaxima = object.notaMaxima;
        const index = object.index;
        const bateriaAtiva = JSON.parse(JSON.stringify(object.bateria));
        
        bateriaController.setScore(id, index, idJuiz, atletaRet, notaAtleta, bateriaAtiva,0)

        let judgesRobo = [];
        await Judge.find({robo: true,tipo:'Juiz'}).then((data)=>{
          judgesRobo = JSON.parse(JSON.stringify(data));
        });
        
        if (judgesRobo.length > 0) {
          const notasRobo = NumberUtil.generateScoreRandom(judgesRobo.length,notaMinima,notaMaxima);
          judgesRobo.forEach(async (judgeRobo, idx) => {
            await bateriaController.setScore(
              id,
              index,
              judgeRobo._id,
              atletaRet,
              notasRobo[idx],
              bateriaAtiva
            );
            await Bateria.findByIdAndUpdate(id, bateriaAtiva);
          });
        }

        bateriaController.calcScore(id,bateriaAtiva,index,atletaRet);

        const bateriaAtualizado = await Bateria.findById(id);
        
        res.json(bateriaAtualizado);
      } catch (error) {
        console.log('Erro ao gera notas',error);
      };
  },

  async setScore(id, index, idJuiz, atletaRet, notaAtleta, bateriaAtiva){
    
    try {

      bateriaAtiva.atletas.forEach((atleta) => {
        if (atleta._id === atletaRet.idAtleta) {
          atleta.notas.forEach((nota) => {
            if (nota.index === index) {
              nota.notasJuizes
                .filter((filter) => filter.idJuiz === idJuiz)
                .forEach(async (notaJuiz) => {
                  if (
                    notaJuiz.idJuiz === idJuiz &&
                    notaJuiz.index === index &&
                    notaJuiz.lancada != true
                  ) {
                    notaJuiz.nota = notaAtleta;
                    notaJuiz.lancada = true;
                    
                    console.log(`Notas Juiz ${notaJuiz.nome}`, notaJuiz.nota);
                  }
                });
            }
          });
        }
      });
  
    } catch (error) {
      console.log(error);
    }
  },
  async calcScore(id,bateriaProcessada, index, atletaRet) {
    const atleta = bateriaProcessada.atletas.filter(filter=>(filter._id===atletaRet.idAtleta))[0];
    const notas =  atleta.notas;
    const notaProcessada = notas.filter(nota=>(nota.index === index))[0];

    const notasJuizesProcessada = notaProcessada.notasJuizes.filter(
      filter => (filter.lancada === true
    ));

    if (notasJuizesProcessada.length === notaProcessada.notasJuizes.length) {
      bateriaProcessada.atletas.forEach((atleta) => {
        
        if (atleta._id === atletaRet.idAtleta) {
          
          atleta.notas.forEach(async (nota) => {
            
            if (nota.index === index) {

              notasJuizesProcessada
                .sort((a, b) => b.nota - a.nota) // Ordena as notas de forma decrescente
                .forEach((lancada) => {
                  //console.log(`Notas Juiz ${lancada.nome}`, lancada.nota);
                  // Exibe o valor da nota
                });

              const notaFinal =
                ( parseFloat(notasJuizesProcessada[1].nota) +
                  parseFloat(notasJuizesProcessada[2].nota) +
                  parseFloat(notasJuizesProcessada[3].nota)) /
                3;

              let notaSomada = Number(notaFinal.toFixed(2));

              console.log(`Nota somada`, notaSomada);
              nota.notaSomada = notaSomada;
              notasJuizesProcessada
              .sort((a, b) => a.index - b.index) // Retorna a  ordenação normal
              .forEach((lancada) => {
                //console.log(`Notas Juiz ${lancada.nome}`, lancada.nota);
                // Exibe o valor da nota
              });
              await Bateria.findByIdAndUpdate(id, bateriaProcessada);
              bateriaController.updateAll(id,bateriaProcessada);
            }
          });
        }
      });
    }  

      
  },
  async updateAll(id,bateria) {
      /*        atleta.colocacao= 0;
        atleta.notaUm   = 0;
        atleta.notaDoi  = 0;
        atleta.total    = 0;
        atleta.bloqueio = 0;
        atleta.interf1  = 0;
        atleta.interf2  = 0;
        atleta.notaAvanca=0;*/
      
      // Atualiza melhores notas
      bateria.atletas.forEach((atleta)=>{
            if (atleta.notas) {
              const maioresNotas = atleta.notas.sort((a, b) => b.notaSomada - a.notaSomada);
              if (maioresNotas.length > 0) {
                atleta.notaUm = maioresNotas[0].notaSomada;
                if (maioresNotas.length > 1) {
                  atleta.notaDois = maioresNotas[1].notaSomada;
                }
                atleta.total = atleta.notaUm + atleta.notaDois;
              }
            }  
      })

      // Atualiza colocacao
      bateria.atletas.sort((a, b) => b.total - a.total).forEach((atleta,index)=>atleta.total===0?atleta.colocacao=0:atleta.colocacao=index+1);
      let atletaAnterio;
      const atletas = bateria.atletas.sort((a, b) => a.colocacao - b.colocacao);
      bateria.atletas
        .sort((a, b) => a.colocacao - b.colocacao) // Ordena por colocação do menor para o maior
        .forEach((atleta, index, atletas) => {
          if (index > 0) {
            // Pula o primeiro, já que não há ninguém à frente
            const atletaAnterior = atletas[index - 1];
            let valorNota = 0;
            if (atleta.notaDois>0) {
              valorNota = atleta.notaDois;
            } else if (atleta.notaUm>0) {
              valorNota = atleta.notaUm;
            }
            let diferencaPontos = atletaAnterior.total - atleta.total;

            atleta.notaAvanca = diferencaPontos+(valorNota+1);
            console.log(
              `Atleta ${atleta.nome} precisa de mais ${diferencaPontos} pontos para passar o atleta ${atletaAnterior.nome}`
            );
          }
        });
        bateria.atletas.sort((a,b)=>a.index-b.index);
        await Bateria.findByIdAndUpdate(id, bateria);

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
  async getActive(req, res) {
    const {filtro} = req.params;

    try {
      // Construa um objeto de filtro com base nos atributos fornecidos
      /*const filtro = {};
      atributos.forEach((atributo) => {
        const [chave, valor] = atributo.split("=");
        filtro[chave] = valor;
      });*/

      // Consulte baterias com base no filtro construído
      const baterias = await Bateria.find({status:'ATIVA'});
      

// Acessa um elemento específico do array
      const firstElement = baterias[0]._doc; // { "id": 1, "name": "Alice" }

      
      // Retorna os baterias encontrados como resposta
      res.json(firstElement);
    } catch (error) {
      // Retorna um erro em caso de falha na consulta
      res.status(500).json({ error: "Erro ao buscar baterias." });
    }
  },
  async get(req, res) {
    const { id } = req.params;
    try {
      const bateria = await Bateria.findById(id);
      if (bateria) {
        res.json(bateria);
      } else {
        res
          .status(401)
          .json({ success: false, message: "Bateria não encontrada." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      atletas.forEach((atleta,index) => {
        atleta.colocacao= 0;
        atleta.notaUm   = 0;
        atleta.notaDois = 0;
        atleta.total    = 0;
        atleta.bloqueio = 0;
        atleta.interf1  = 0;
        atleta.interf2  = 0;
        atleta.notaAvanca=0;
        atleta.index=index;
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
            status: "AGUARDANDO",
            avanca: 2,
            qtdAtletas: fase.atletas,
            finalizada: false,
            notas: []
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