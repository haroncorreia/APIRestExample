module.exports = app => {

    /**
     * Função que verifica se o valor de uma variável existe.
     * @param {*} value - Variável que será verificada.
     * @param {*} message - Mensagem de erro passada na função.
     */
    function existsOrError(value, message) {

        // Se o valor não foi inicializado, lança o erro.
        if ( !value ) throw message;

        // Se o valor for um array, e ele for vazio, lança o erro.
        if ( Array.isArray(value) && value.length === 0 ) throw message;

        // Se o valor for uma string, e ela for vazia, lança o erro.
        if ( typeof value === "string" && !value.trim() ) throw message;

    }

    /**
     * Função que verifica se o valor de uma variável não existe.
     * @param {*} value - Variável que será verificada.
     * @param {*} message - Mensagem de erro passada na função.
     */
    function notExistsOrError(value, message) {

        // Bloco de testagem
        try {

            // Testa o valor com a função existsOrError
            existsOrError(value, message);

        } catch (error) {
            
            // Se lançar o erro, significa que o valor não existe, então, apenas retorna
            return

        }

        // Se não lançar erro, significa que o valor testado na função existsOrError existe, logo, lança o erro pois o objetivo desta funçao é verificar a não existência do valor.
        throw message;

    }

    /**
     * Função que verifica se o valor de duas variáveis são iguais.
     * @param {*} valueA - Valor da variável A.
     * @param {*} valueB - Valor da variável B.
     * @param {*} message - Mensagem de erro passada na função.
    */
    function equalsOrError(valueA, valueB, message) {

        // Se o valor de A for diferente de B lança o erro.
        if ( valueA !== valueB ) throw message;

    }

    // Retorno para exportação das funções
    return { existsOrError, notExistsOrError, equalsOrError }

}