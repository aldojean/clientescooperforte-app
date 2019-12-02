import ApiService from '../apiservice'

import ErroValidacao from '../exception/ErroValidacao'

export default class ClienteService extends ApiService {

    constructor(){
        super('/api/clientes')
    }

    obterListaMeses(){
        return  [
            { label: 'Selecione...', value: '' },
            { label: 'Janeiro', value: 1 },
            { label: 'Fevereiro', value: 2 },
            { label: 'Março', value: 3 },
            { label: 'Abril', value: 4 },
            { label: 'Maio', value: 5 },
            { label: 'Junho', value: 6 },
            { label: 'Julho', value: 7 },
            { label: 'Agosto', value: 8 },
            { label: 'Setembro', value: 9 },
            { label: 'Outubro', value: 10 },
            { label: 'Novembro', value: 11 },
            { label: 'Dezembro', value: 12 },
        ]
    }

    obterListaTipos(){
        return  [
            { label: 'Selecione...', value: '' },
            { label: 'Público' , value : 'PUBLICO' },
            { label: 'Privado' , value : 'PRIVADO' }
        ]

    }

    obterPorId(id){
        return this.get(`/${id}`);
    }

    alterarStatus(id, status){
        return this.put(`/${id}/atualiza-status`, { status })
    }

    validar(cliente){
        const erros = [];

        if(!cliente.ano){
            erros.push("Informe o Ano.")
        }

        if(!cliente.mes){
            erros.push("Informe o Mês.")
        }

        if(!cliente.nome){
            erros.push("Informe a Nome.")
        }

        if(!cliente.valor){
            erros.push("Informe o Valor.")
        }

        if(!cliente.tipo){
            erros.push("Informe o Tipo.")
        }

        if(erros && erros.length > 0){
            throw new ErroValidacao(erros);
        }
    }

    salvar(cliente){
        return this.post('/', cliente);
    }

    atualizar(cliente){
        return this.put(`/${cliente.id}`, cliente);
    }

    consultar(clienteFiltro){
        let params = `?ano=${clienteFiltro.ano}`

        if(clienteFiltro.mes){
            params = `${params}&mes=${clienteFiltro.mes}`
        }

        if(clienteFiltro.tipo){
            params = `${params}&tipo=${clienteFiltro.tipo}`
        }

        if(clienteFiltro.status){
            params = `${params}&status=${clienteFiltro.status}`
        }

        if(clienteFiltro.usuario){
            params = `${params}&usuario=${clienteFiltro.usuario}`
        }

        if(clienteFiltro.nome){
            params = `${params}&nome=${clienteFiltro.nome}`
        }

        return this.get(params);
    }

    deletar(id){
        return this.delete(`/${id}`)
    }
}