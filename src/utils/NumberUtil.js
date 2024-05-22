class NumberUtil {
    static formatValueMoney(valueMoney) {
      const valorInscricaoNumber = parseFloat(valueMoney.replace(',', '.'));
      return valorInscricaoNumber;
    }
}
module.exports = NumberUtil;