import React from 'react'
import currencyFormatter from 'currency-formatter'

export default props => {

    const rows = props.clientes.map( cliente => {
        return (
            <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{ currencyFormatter.format(cliente.valor, { locale: 'pt-BR'}) }</td>
                <td>{cliente.tipo}</td>
                <td>{cliente.mes}</td>
                <td>{cliente.status}</td>
                <td>
                    <button className="btn btn-success" title="Efetivar"
                            disabled={ cliente.status !== 'CADASTRAMENTO' }
                            onClick={e => props.alterarStatus(cliente, 'EFETIVADO')} 
                            type="button">
                            <i className="pi pi-check"></i>
                    </button>
                    <button className="btn btn-warning"  title="Cancelar"
                            disabled={ cliente.status !== 'CADASTRAMENTO' }
                            onClick={e => props.alterarStatus(cliente, 'CANCELADO')} 
                            type="button">
                            <i className="pi pi-times"></i>
                    </button>
                    <button type="button"   title="Editar"
                            className="btn btn-primary"
                            onClick={e => props.editAction(cliente.id)}>
                            <i className="pi pi-pencil"></i>
                    </button>
                    <button type="button"  title="Excluir"
                            className="btn btn-danger" 
                            onClick={ e => props.deleteAction(cliente)}>
                            <i className="pi pi-trash"></i>
                    </button>
                </td>
            </tr>
        )
    } )

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Mês</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}

