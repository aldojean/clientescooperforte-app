import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import ClientesTable from './clientesTable'
import ClienteService from '../../app/service/clienteService'
import LocalStorageService from '../../app/service/localstorageService'

import * as messages from '../../components/toastr'

import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';



class ConsultaClientes extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        nome: '',
        showConfirmDialog: false,
        clienteDeletar: {},
        clientes : []
    }

    constructor(){
        super();
        this.service = new ClienteService();
    }

    buscar = () => {
        if(!this.state.ano){
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório.')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const clienteFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            nome: this.state.nome,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(clienteFiltro)
            .then( resposta => {
                const lista = resposta.data;
                
                if(lista.length < 1){
                    messages.mensagemAlert("Nenhum resultado encontrado.");
                }
                this.setState({ clientes: lista })
            }).catch( error => {
                console.log(error)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-clientes/${id}`)
    }

    abrirConfirmacao = (cliente) => {
        this.setState({ showConfirmDialog : true, clienteDeletar: cliente  })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog : false, clienteDeletar: {}  })
    }

    deletar = () => {
        this.service
            .deletar(this.state.clienteDeletar.id)
            .then(response => {
                const clientes = this.state.clientes;
                const index = clientes.indexOf(this.state.clienteDeletar)
                clientes.splice(index, 1);
                this.setState( { clientes: clientes, showConfirmDialog: false } )
                messages.mensagemSucesso('Cliente deletado com sucesso!')
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o Cliente')
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-clientes')
    }

    alterarStatus = (cliente, status) => {
        this.service
            .alterarStatus(cliente.id, status)
            .then( response => {
                const clientes = this.state.clientes;
                const index = clientes.indexOf(cliente);
                if(index !== -1){
                    cliente['status'] = status;
                    clientes[index] = cliente
                    this.setState({cliente});
                }
                messages.mensagemSucesso("Status atualizado com sucesso!")
            })
    }

    render(){
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} 
                        className="p-button-secondary" />
            </div>
        );

        return (
            <Card title="Consulta Clientes">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputAno" 
                                       value={this.state.ano}
                                       onChange={e => this.setState({ano: e.target.value})}
                                       placeholder="Digite o Ano" />
                            </FormGroup>

                            <FormGroup htmlFor="inputMes" label="Mês: ">
                                <SelectMenu id="inputMes" 
                                            value={this.state.mes}
                                            onChange={e => this.setState({ mes: e.target.value })}
                                            className="form-control" 
                                            lista={meses} />
                            </FormGroup>

                            <FormGroup htmlFor="inputDesc" label="Nome: ">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputDesc" 
                                       value={this.state.nome}
                                       onChange={e => this.setState({nome: e.target.value})}
                                       placeholder="Digite a descrição" />
                            </FormGroup>

                            <FormGroup htmlFor="inputTipo" label="Tipo Cliente: ">
                                <SelectMenu id="inputTipo" 
                                            value={this.state.tipo}
                                            onChange={e => this.setState({ tipo: e.target.value })}
                                            className="form-control" 
                                            lista={tipos} />
                            </FormGroup>

                            <button onClick={this.buscar} 
                                    type="button" 
                                    className="btn btn-success">
                                    <i className="pi pi-search"></i> Buscar
                            </button>
                            <button onClick={this.preparaFormularioCadastro} 
                                    type="button" 
                                    className="btn btn-danger">
                                    <i className="pi pi-plus"></i> Cadastrar
                            </button>

                        </div>
                        
                    </div>
                </div>   
                <br/ >
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <ClientesTable clientes={this.state.clientes} 
                                              deleteAction={this.abrirConfirmacao}
                                              editAction={this.editar}
                                              alterarStatus={this.alterarStatus} />
                        </div>
                    </div>  
                </div> 
                <div>
                    <Dialog header="Confirmação" 
                            visible={this.state.showConfirmDialog} 
                            style={{width: '50vw'}}
                            footer={confirmDialogFooter} 
                            modal={true} 
                            onHide={() => this.setState({showConfirmDialog: false})}>
                        Confirma a exclusão deste Cliente?
                    </Dialog>
                </div>           
            </Card>

        )
    }
}

export default withRouter(ConsultaClientes);