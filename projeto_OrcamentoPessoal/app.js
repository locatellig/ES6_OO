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

                if(despesa === null) {
                    continue
                }

                despesa.id = i

                arrayDespesas.push(despesa)
            }

        }

        return arrayDespesas
    }

    pesquisar(despesa) {
        let filtrarRegistros = this.recuperarTodosRegistros();

        if (despesa.ano != '') {
            filtrarRegistros = filtrarRegistros.filter(f => f.ano == despesa.ano)
        }

        if (despesa.mes != '') {
            filtrarRegistros = filtrarRegistros.filter(f => f.mes == despesa.mes)
        }

        if (despesa.dia != '') {
            filtrarRegistros = filtrarRegistros.filter(f => f.dia == despesa.dia)
        }

        if (despesa.tipo != '') {
            filtrarRegistros = filtrarRegistros.filter(f => f.tipo == despesa.tipo)
        }

        if (despesa.descricao != '') {
            filtrarRegistros = filtrarRegistros.filter(f => f.descricao == despesa.descricao)
        }

        if (despesa.valor != '') {
            filtrarRegistros = filtrarRegistros.filter(f => f.valor == despesa.valor)
        }

        return filtrarRegistros
    }

    remover(id){
        localStorage.removeItem(id)
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

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && !filtro) {
        despesas = bd.recuperarTodosRegistros()
    }
    
    //Selecionando tbody
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

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


        //Botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //Remove a despesa
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)

            window.location.reload();
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}