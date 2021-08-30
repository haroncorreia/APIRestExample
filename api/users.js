// Instanciando biblioteca bCryptJS para criptografia de dados
const bcrypt = require("bcryptjs");

// O módulo exporta função que recebe app (instância do Express JS) como parâmetro
module.exports = app => {

    // Importando funções de validação
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

    const encryptPassword = (password) => {

        // Cria um tempeiro (salt)
        const salt = bcrypt.genSaltSync(10);

        // Criptografa a senha (cria o hash da senha, usando o tempeiro)
        return bcrypt.hashSync(password, salt);

    }

    // Função para salvar registro
    const save = async (req, res) => {

        // Distribui os atributos do objeto body na constante user
        const user = { ...req.body }

        // Se for um update, cria do atributo id
        if ( req.params.id ) user.id = req.params.id;

        // Bloco de validação dos dados
        try {
            
            // Validando valores repassados pelo frontend
            existsOrError(user.cpf, "O campo CPF não foi informado.");
            existsOrError(user.email, "O campo e-mail não foi informado.");
            existsOrError(user.password, "O campo senha não foi informado.");
            existsOrError(user.confirmPassword, "O campo confirmação de senha não foi informado.");
            equalsOrError(user.password, user.confirmPassword, "As senhas informadas não conferem.");

            // Condição para verificar se é uma inserção de novo registro
            if ( !user.id ) {

                // Valida se o CPF já existe na base de dados do sistema.
                const checkUserCPFAlreadyExists = await app.db("users").where({ cpf: user.cpf }).first();
                notExistsOrError(checkUserCPFAlreadyExists, "O CPF informado já existe na base de dados do sistema.")

                // Valida se o e-mail já existe na base de dados do sistema.
                const checkUserEmailAlreadyExists = await app.db("users").where({ email: user.email }).first();
                notExistsOrError(checkUserEmailAlreadyExists, "O e-mail informado já existe na base de dados do sistema.")

            // Se for uma atualização de registro
            } else {

                // Valida se o ID de usuário existe na base de dados do sistema.
                const user = await app.db("users").where({ id: req.params.id }).first();
                existsOrError(user, "O ID informado não existe na base de dados do sistema.");

                // Valida se o usário tem permissão para remover registros.
                // ...desenvolver

            }

        // Caso haja algum erro de validação
        } catch (error) {

            // Retorna requisição com o status 400 (erro do cliente)
            return res.status(400).send({ message: "Erro ao realizar operação no backend.", error })
            
        }

        // Criptografa a senha para gravar no banco de dados
        user.password = encryptPassword(user.password);

        // Deleta o atributo de confirmação de senha do objeto que será inserido
        delete user.confirmPassword;

        // Condição para verificar se é uma atualização de registro
        if (user.id) {
            
            // Inserindo carimbos de atualização
            user.updatedAt = app.db.fn.now();
            user.updatedBy = "sarp.update.user";        
    
            // Realiza o update pelo knex
            app.db("users")
                .update(user)
                .where({ id: user.id })
                .then(() => {

                    // Retorna requisição com o status 200 (bem sucedido).
                    res.status(200).send({ message: "Operação realizada com sucesso." });

                }).catch((error) => {
                    
                    // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                    res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

                });

        // Se não for uma atualização, mas uma inserção
        } else {
            
            // Inserindo carimbos de inserção
            user.createdAt = app.db.fn.now();
            user.createdBy = "sarp.insert.user";        

            // Realiza o insert pelo knex
            app.db("users")
                .returning("id")
                .insert(user)            
                .then((object) => {

                    // Retorna requisição com o status 201 (bem sucedida e com novo item criado), com o id do registro criado.
                    res.status(201).send({ message: "Operação realizada com sucesso.", newObjectId: object[0]  });

                }).catch((error) => {
                    
                    // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                    res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

                });    

        }

    }

    // Função para obter os registros (exceto registros removidos no softDelete)
    const get = async (req, res) => {

        // Realiza o select pelo knex
        app.db("users")
            .whereNull("deletedAt")           
            .then((objects) => {

                // Retorna requisição com o status 200 (bem sucedido).
                res.status(200).send({ message: "Operação realizada com sucesso.", objects });

            }).catch((error) => {
                
                // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

            });   

    }    

    // Função para obter todos os registros (incluindo registros removidos no softDelete)
    const getAll = async (req, res) => {

        // Realiza o select pelo knex
        app.db("users")
            .then((objects) => {

                // Retorna requisição com o status 200 (bem sucedido).
                res.status(200).send({ message: "Operação realizada com sucesso.", objects });

            }).catch((error) => {
                
                // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

            });   

    }    

    // Função para obter apenas os registros removidos
    const getRemoved = async (req, res) => {

        // Realiza o select pelo knex
        app.db("users")
            .whereNotNull("deletedAt")           
            .then((objects) => {

                // Retorna requisição com o status 200 (bem sucedido).
                res.status(200).send({ message: "Operação realizada com sucesso.", objects });

            }).catch((error) => {
                
                // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

            });   

    } 
    
    // Função para obter apenas os registros restaurados
    const getRestored = async (req, res) => {

        // Realiza o select pelo knex
        app.db("users")
            .whereNotNull("restoredAt")           
            .then((objects) => {

                // Retorna requisição com o status 200 (bem sucedido).
                res.status(200).send({ message: "Operação realizada com sucesso.", objects });

            }).catch((error) => {
                
                // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

            });   

    }     

    // Função para obter um único registro
    const getById = async (req, res) => {

        // Realiza o select pelo knex
        app.db("users")
                .where("id", req.params.id)          
                .then((object) => {

                    // Retorna requisição com o status 200 (bem sucedido).
                    res.status(200).send({ message: "Operação realizada com sucesso.", object });

                }).catch((error) => {
                    
                    // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                    res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

                }); 

    }     

    // Função para remover o registro (softDelete)
    const remove = async (req, res) => {

        // Bloco de validação dos dados
        try {
            
            // Valida se o ID de usuário existe na base de dados do sistema.
            const user = await app.db("users").where({ id: req.params.id }).first();
            existsOrError(user, "O ID informado não existe na base de dados do sistema.");

            // Valida se o ID já foi excluído.
            if ( user.deletedBy ) throw "O ID informado existe, mas já consta como removido da base de dados do sistema.";

            // Valida se o usário tem permissão para remover registros.
            // ...desenvolver

        // Caso haja algum erro de validação
        } catch (error) {

            // Retorna requisição com o status 400 (erro do cliente).
            return res.status(400).send({ message: "Erro ao realizar operação no backend.", error })
            
        }

        // Realiza o update pelo knex
        app.db("users")
            .update({
                deletedAt: app.db.fn.now(),
                deletedBy: "sarp.remove.user",
                restoredAt: null,
                restoredBy: null
            })
            .where({ id: req.params.id })
            .then(() => {

                // Retorna requisição com o status 200 (bem sucedido).
                res.status(200).send({ message: "Operação realizada com sucesso." });

            }).catch((error) => {
                
                // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

            });

    } 

    // Função para restaurar o registro
    const restore = async (req, res) => {

        // Bloco de validação dos dados
        try {
            
            // Valida se o ID de usuário existe na base de dados do sistema.
            const user = await app.db("users").where({ id: req.params.id }).first();
            existsOrError(user, "O ID informado não existe na base de dados do sistema.");

            // Valida se o usário tem permissão para remover registros.
            // ...desenvolver

        // Caso haja algum erro de validação
        } catch (error) {

            // Retorna requisição com o status 400 (erro do cliente).
            return res.status(400).send({ message: "Erro ao realizar operação no backend.", error })
            
        }

        // Realiza o update pelo knex
        app.db("users")
            .update({
                deletedAt: null,
                deletedBy: null,
                restoredAt: app.db.fn.now(),
                restoredBy: "sarp.restore.user",
            })
            .where({ id: req.params.id })
            .then(() => {

                // Retorna requisição com o status 200 (bem sucedido).
                res.status(200).send({ message: "Operação realizada com sucesso." });

            }).catch((error) => {
                
                // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

            });

    }     

    // Função para destruir o registro (hardDelete)
    const destroy = async (req, res) => {

        // Bloco de validação dos dados
        try {
            
            // Valida se o ID de usuário existe na base de dados do sistema.
            const user = await app.db("users").where({ id: req.params.id }).first();
            existsOrError(user, "O ID informado não existe na base de dados do sistema.");

            // Valida se o usário tem permissão para apagar registros.
            // ...desenvolver

        // Caso haja algum erro de validação
        } catch (error) {

            // Retorna requisição com o status 400 (erro do cliente).
            return res.status(400).send({ message: "Erro ao realizar operação no backend.", error })
            
        }

        // Realiza o update pelo knex
        app.db("users")
            .where({ id: req.params.id })
            .del()
            .then(() => {

                // Retorna requisição com o status 200 (bem sucedido).
                res.status(200).send({ message: "Operação realizada com sucesso." });

            }).catch((error) => {
                
                // Se houver algum erro, retorna a requisição com o status 500 (erro do servidor).
                res.status(500).send({ message: "Erro ao realizar operação no backend.", error });

            });

    } 

    // Retorno das funções implementadas
    return {  destroy, get, getAll, getById, getRemoved, getRestored, remove, restore, save }
}