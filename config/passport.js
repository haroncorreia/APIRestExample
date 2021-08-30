// Variável de ambiente para cálculo do token
const { authSecret } = require("../.env");

// Middleware de autenticação usando JWT Jason Web Token
const passport = require("passport");
const passportJwt = require("passport-jwt");

// Importação das funções do passport-jwt que serão utilizadas
const { Strategy, ExtractJwt } = passportJwt;

module.exports = app => {

    const params = {

        // Chave de codificação/decodificação do token
        secretOrKey: authSecret,

        // Extração do token JWT no cabeçalho da requisição
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()

    }

    // Aplica a estratégia de autenticação
    const strategy = new Strategy(params, (payload, done) => {

        // O payload é extraído do objeto params, repassado com authSecret e jwtFromRequest
        // O payload é exatamente o mesmo payload que é carregado para o frontend em auth.js.
        
        // Verifica se o id do usuário, constante no payload, existe na base de dados do sistema
        app.db("users")
            .where({ id: payload.id })
            .first()
            .then(user => {
                
                // Com não houve erro na aplicação da estratégia, o primeiro parâmetro retorna null
                // Se o objeto user não for nulo, retorna o payload igual ao do frontend (mas poderia ser o objeto user também, 
                // contendo os dados do usuário autenticado), caso contrário, retorna falso
                done(null, user ? { ...payload } : false );

            })
            .catch(error => {
                
                // Se houve erro na aplicação da estratégia, retorna o erro, e false.
                done(error, false);

            })
    
    })

    // Usa a estratégia definida
    passport.use(strategy);

    return {

        // Função exportada para autenticar as rotas, utiliza a autenticação com JWT, e sem controle de sessão.
        authenticate: () => passport.authenticate("jwt", { session: false })

    }

}