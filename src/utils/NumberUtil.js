class NumberUtil {
    static formatValueMoney(valueMoney) {
      const valorInscricaoNumber = parseFloat(valueMoney.replace(',', '.'));
      return valorInscricaoNumber;
    }
    static  generateScoreRandom(quantidade, minimo, maximo) {
      const notas = [];
      for (let i = 0; i < quantidade; i++) {
        const notaAleatoria = Math.random() * (maximo - minimo) + minimo;
        notas.push(notaAleatoria.toFixed(2)); // Arredonda para 2 casas decimais, se necessário
      }
      return notas;
    }
}
module.exports = NumberUtil;