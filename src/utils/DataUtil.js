

const  DataUtil = {

   ConvertDDMMYYYY(dataOriginal) {
        
        // 2024-04-25
        const ano = dataOriginal.substring(0, 4);//String(data.getDate()).padStart(2, '0');
        const mes = dataOriginal.substring(5,7)
        const dia = dataOriginal.substring(8,10)
        
        const dataFormatada = `${dia}/${mes}/${ano}`;
        return dataFormatada;
    },

   calcularIdade(objeto) {

        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth() + 1;
        const diaAtual = dataAtual.getDate();
    
        const dataNascimento = new Date(objeto.dataNascimento);
        const anoNascimento = dataNascimento.getFullYear();
        const mesNascimento = dataNascimento.getMonth() + 1;
        const diaNascimento = dataNascimento.getDate();
    
        let idade = anoAtual - anoNascimento;
    
        // Verifica se ainda não fez aniversário este ano
        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
          idade--;
        }
        
        //console.log('Idade ' + idade);
        
        objeto.idadeAno = idade;
    
        return idade;
    
      }
}
module.exports = DataUtil;