// Variável de ambiente para cálculo do token
const { authSecret } = require("../.env");

// Instanciando biblioteca JWT-Simple para obtenção do token
const jwt = require("jwt-simple");

// Instanciando biblioteca bCryptJS para criptografia de dados
const bcrypt = require("bcryptjs");

module.exports = app => {

    /**
     * Esta função realiza a autenticação do usuário.
     * @param {*} req
     * @param {*} res
     * @returns 
     */
    const signIn = async (req, res) => {

        // Se email ou senha não for informado
        if ( !req.body.email || !req.body.password ) {

            // Retorna com erro 400 (erro do cliente)
            return res.status(400).send({ message: "Usuário ou senha não informado." });

        }

        // Obtendo usuário do banco de dados, com função assíncrona
        const user = await app.db("users")
                                .where({ email: req.body.email })
                                .first();

        // Se o usuário não existir, retorna com erro 400 (erro do cliente)                        
        if ( !user ) return res.status(400).send({ message: "O e-mail informado não existe na base de dados do sistema." });

        // Compara a senha informada na requisição com a senha armazenada no banco de dados
        const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
        
        // Se as senhas não forem iguais, retorna com erro 401 (não autorizado)
        if ( !passwordMatch ) return res.status(401).send({ message: "A senha informada não confere com a armazenada na base de dados." });

        // Data atual em segundos, desde 1970 (epochtime) para cálculo da validade do token
        const now = Math.floor(Date.now() / 1000);

        // Dados do payload que serão retornados ao autenticar corretamente
        const payload = {
            id: user.id,
            email: user.email,
            cpf: user.cpf,
            iat: now,                   // iat é a sigla convencional para issued at (publicado em)
            exp: now + ( 60 * 60 )      // exp é a sigla convencional para expiration (expira em). O now somado a (60 * 60) é o tempo de uma hora para expiração do token.
        }

        // Gera o token de autenticação
        const token = jwt.encode(payload, authSecret);

        // Se autenticado corretamente, retorna com status 200 (ok), e os dados payload e token
        res.status(200).json({
            ...payload,
            token
        })

    }

    /**
     * Esta função realiza a validação do token do usuário.
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    const validateToken = async (req, res) => {

        // Recebe os dados de usuário do frontend ou recebe nulo
        const userDataFromFrontend = req.body || null;

        // Bloco de validação
        try {
            
            // Se os dados de usuário do frontend forem passados
            if ( userDataFromFrontend ) {

                // Decodifica o token repassado pelo frontend
                const token = jwt.decode(userDataFromFrontend.token, authSecret);

                // Compara se o timestamp de expiração do token é maior do que o agora 
                // * 1000 para formatar em milisegundos (usado no JavaScript), uma vez que o valor foi transformado em segundos na função signIn)
                if ( new Date(token.exp * 1000) > new Date() ) {

                    // Neste momento pode-se aplicar uma política de renovação do token, p. e.: se o token estiver muito próximo de expirar,
                    // pode-se optar por renovar o token.
                    // ...desenvolver

                    // Se for maior, o token ainda é válido, retorna com verdadeiro
                    return res.status(200).send(true);

                }
                
            }

        } catch (error) {

            // Se houver algum erro no token, p. e.: se o token for gerado com um authSecret diferente.
            
        }

        // Se o token não for válido, retorna com falso
        return res.status(401).send(false);

    }

    // Retorna os métodos
    return { signIn, validateToken }

}