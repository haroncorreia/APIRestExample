/**
 * Este middleware faz a validação de nível do usuário
 * @param {*} middleware - Função determinada na rota
 * @returns 
 */

module.exports = middleware => {

    return (req, res, next) => {

        // Regra de validação de nível de usuário
        // ...desenvolver

        // Se a regra de validação de nível de usuário for válida 
        if ( req.user ) {
            
            // Executa o middleware
            middleware(req, res, next);
        
        // Caso contrário
        } else {

            // Retorna com a mensagem de não permitdo
            res.status(401).send({ message: "O usuário não tem permissão de acesso à esta rota." });

        }

    }

}