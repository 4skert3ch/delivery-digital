import React, { Component } from "react";

const headerProps = {
    icon : 'users',
    title : 'Usuários',
    subtitle: 'Cadastro de usuário: Incluir, Listar , Alterar e Excluir'
}

export default class UserCrud extends Component {
    render(){
        return(
            <Main {...headerProps}>
                Cadastro de usuário
            </Main>
        )
    }
}