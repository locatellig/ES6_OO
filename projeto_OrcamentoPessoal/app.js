class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class BD {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoID() {
        let proximoID = localStorage.getItem('id')
        return parseInt(proximoID) + 1
    }

    gravar(despesa) {
        //gravando no LocalStorage e Convertendo objeto para JSON
        let id = this.getProximoID()

        localStorage.setItem(id, JSON.stringify(despesa))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        //Array de despesas
        let arrayDespesas = Array()

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {

            if (localStorage.getItem(i) !== null) {
                let despesa = JSON.parse(localStorage.getItem(i))
                arrayDespesas.push(despesa)
            }

        }

        return arrayDespesas
    }
}

let bd = new BD()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {
        //gravar
        bd.gravar(despesa)

        //Limpar campos após inserção
        let selects = document.getElementsByTagName('select')
        for (let i = 0; i < selects.length; i++) {
            selects[i].selectedIndex = 0
        }

        let inputs = document.getElementsByTagName('input')
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = ''
        }

        //dialog sucesso
        document.getElementById('modalHeader').className = 'modal-header text-success'
        document.getElementById('modalLabel').innerHTML = 'Gravado com sucesso'
        document.getElementById('mensagemGravacao').innerHTML = 'Registro inserido com sucesso!'
        document.getElementById('modalButton').innerHTML = 'Voltar'
        document.getElementById('modalButton').className = 'btn btn-success'
        $('#registraDespesa').modal('show')
    } else {
        //dialog erro
        document.getElementById('modalHeader').className = 'modal-header text-danger'
        document.getElementById('modalLabel').innerHTML = 'Erro na gravação'
        document.getElementById('mensagemGravacao').innerHTML = 'Existem campos obrigatórios que não foram informados!'
        document.getElementById('modalButton').innerHTML = 'Voltar e informar'
        document.getElementById('modalButton').className = 'btn btn-danger'
        $('#registraDespesa').modal('show')
    }
}

function carregaListaDespesas() {
    let despesas = Array()
    despesas = bd.recuperarTodosRegistros()

    //Selecionando tbody
    let listaDespesas = document.getElementById('listaDespesas')

    //percorrer array despesas
    despesas.forEach(function (d) {
        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        //ajustar o tipo
        switch (parseInt(d.tipo)) {
            case 1: d.tipo = 'Alimentação'
                break
            case 2: d.tipo = 'Educação'
                break
            case 3: d.tipo = 'Lazer'
                break
            case 4: d.tipo = 'Saúde'
                break
            case 5: d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
    })


}