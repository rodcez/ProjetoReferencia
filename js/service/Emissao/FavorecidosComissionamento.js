let bloquearProlabore = false;
let bloquearAgenciamento = false;

window.FavorecidosComissionamentoUi = {
    //Alterações da Tela: Bloqueio/Show/Hide/Preencher/Limpar
    initialize: function (callback) {

    },

    desabilitarCamposById: function (campos) {
        campos.forEach(campo => $(`#${campo}`).prop('disabled', true));
    }

}

window.FavorecidosComissionamentoFunctions = {
    //Funcionalidades/Ajax/Alterações De Comportamento/Objeto
    initialize: function (callback) {

        this.carregarGridCorretores();

        callback && callback();
    },

    carregarGridCorretores: function () {

        let listaCorretores = this.getListaCorretores();

        $("#tabelaParticipacaoCorretor tbody").empty();

        listaCorretores.forEach(function (corretor) {

            $("#tabelaParticipacaoCorretor tbody").append(
                `<tr>
                    <td style="border: 0.5px solid Gainsboro; padding : 5px; text-align:center">${corretor.Lider ? `<input type="checkbox" checked disabled>` : ``}</td>
                    <td style="border: 0.5px solid Gainsboro; font-size: 12px; padding: 5px; text-align:left">${corretor.Nome} (${corretor.CodigoCliente} / ${corretor.CodigoEstabelecimento})</td>
                    <td style="border: 0.5px solid Gainsboro; font-size: 12px; padding : 5px; text-align:center">${window.FavorecidosComissionamentoFunctions.formatarParaPorcentagem(corretor.PercentualParticipacao)}</td>
                </tr>`
            );

        });

    },

    carregarFavorecidos: function (select) {

        $(`#${select}`).empty();
        $(`#${select}`).append(`<option value = ""> Selecione </option>`);

        this.getComboCorretores().forEach(f => {
            if (!this.isEmpty(f))
                $(`#${select}`).append(`<option value ="${f.Value}" CodigoClienteOperacional="${f.CodigoClienteOperacional}" CodigoEstabelecimento="${f.CodigoEstabelecimento}"> ${this.getCodCliente(f.Value)} - ${f.Text}</option>`);
        });

        this.getComboSubEstipulantes().forEach(f => {
            if (!this.isEmpty(f))
                $(`#${select}`).append(`<option value = ${f.Value}> ${this.getCodCliente(f.Value)} - ${f.Text}</option>`);
        });
    },

    getCodCliente: function (value) {

        return value.split("|", 1)[0];

    },

    isEmpty: function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },

    getComboFavorecidos: function () {

        let comboCorretores = this.getComboCorretores();
        let comboSubEstipulantes = this.getComboSubEstipulantes();

        return [].concat(comboCorretores, comboSubEstipulantes);
    },

    getListaCorretores: function () {

        let codCorretorLider = cotacao.CorretorPrincipal.CodigoOperacional;

        return cotacao.Comissionamentos.filter(f => f.CodigoTipoComissao === "CO").map(m => Object.assign(m, { Lider: m.CodigoClienteOperacional == codCorretorLider ? true : false }));
    },

    getComboCorretores: function () {

        let listaCorretores = this.getListaCorretores();

        let objCombo = [];

        if (listaCorretores.length == 0)
            return objCombo;

        listaCorretores.forEach(m => {
            objCombo.push({
                Value: m.CodigoCliente.toString(),
                CodigoClienteOperacional: m.CodigoClienteOperacional.toString(),
                CodigoEstabelecimento: m.CodigoEstabelecimento.toString(),
                Text: m.Nome
            });
        });

        return objCombo;
    },

    getComboSubEstipulantes: function () {

        let objCombo = [];

        if (cotacao.Itens.length == 0)
            return objCombo;

        cotacao.Itens.forEach(m => { objCombo.push({ Value: m.NumeroItem, Text: m.Estipulante.Nome }) });

        return objCombo;
    },

    popularFavorecidosComissionamentos: function (comissoes) {

        this.preencherComissoes();

        bloquearProlabore = (comissoes.percentualTotalProLabore == 0);
        bloquearAgenciamento = (comissoes.percentualTotalAgenciamento == 0);

        if (bloquearProlabore) {
            window.FavorecidosComissionamentoUi.desabilitarCamposById(['selectFavorecidoProLabore', 'btnDadosBancariosProLabore']);
        } else {
            this.carregarFavorecidos('selectFavorecidoProLabore');
        }

        if (bloquearAgenciamento) {
            window.FavorecidosComissionamentoUi.desabilitarCamposById(['selectFavorecidoAgenciamento', 'btnDadosBancariosAgenciamento']);
        } else {
            this.carregarFavorecidos('selectFavorecidoAgenciamento');
        }
    },

    preencherComissoes: function () {

        $("#totalComissao").text(this.formatarParaPorcentagem(comissoes.percentualTotalComissao))
        $("#totalProLabore").text(this.formatarParaPorcentagem(comissoes.percentualTotalProLabore));
        $("#totalAgenciamento").text(this.formatarParaPorcentagem(comissoes.percentualTotalAgenciamento));
    },

    formatarParaPorcentagem: function (numero) {
        return numero.toFixed(2).toString().replace('.', ',');
    },

    validarFavorecidosComissionamento: function () {

        return this.validarFavorecidoProLabore() && this.validarFavorecidoAgenciamento();
    },

    validarFavorecidoProLabore: function () {

        let favorecidoProlabore = $("#selectFavorecidoProLabore");

        if (comissoes.percentualTotalProLabore > 0 && !favorecidoProlabore.val()) {
            notification("erro", "Campo favorecido do pro-labore é de preenchimento obrigatório.");
            return false;
        }

        //DadosBancariosProlabore
        if (favorecidoProlabore.val() && !$('#txtContaPL').val()) {
            notification("erro", "Dados bancários do favorecido do pro-labore é de preenchimento obrigatório..");
            return false;
        }

        return true;

    },

    validarFavorecidoAgenciamento: function () {

        let favorecidoAgenciamento = $("#selectFavorecidoAgenciamento");

        if (comissoes.percentualTotalAgenciamento > 0 && !favorecidoAgenciamento.val()) {
            notification("erro", "Campo favorecido do agenciamento é de preenchimento obrigatório.");
            return false;
        }

        //DadosBancariosAgenciamento
        if (favorecidoAgenciamento.val() && !$('#txtContaAG').val()) {
            notification("erro", "Dados bancários do favorecido do agenciamento é de preenchimento obrigatório.");
            return false;
        }

        return true;
    },

    SalvarFavorecidosComissionamento: function (callback) {

        var comissionamentos = [];

        if (!bloquearProlabore) {

            comissionamentos.push({
                DadosBancarios: {
                    NumeroBanco: parseInt($("#cboBancoDebitoPL").val()),
                    DigitoAgencia: parseInt($("#txtDigitoPL").val()),
                    NumeroAgencia: parseInt($("#txtAgenciaPL").val()),
                    NumeroContaCorrente: parseInt($("#txtContaPL").val()),
                    DigitoContaCorrente: parseInt($("#txtDigitoContaPL").val()),
                },
                CodigoTipoComissao: "PL",
                PercentualParticipacao: 100,
                CodigoCliente: $("#selectFavorecidoProLabore > option:selected").val() ? parseInt($("#selectFavorecidoProLabore > option:selected").val()) : 0,
                CodigoClienteOperacional: $("#selectFavorecidoProLabore > option:selected").attr("codigoclienteoperacional") ? parseInt($("#selectFavorecidoProLabore > option:selected").attr("codigoclienteoperacional")) : 0,
                CodigoEstabelecimento: $("#selectFavorecidoProLabore > option:selected").attr("CodigoEstabelecimento") ? $("#selectFavorecidoProLabore > option:selected").attr("CodigoEstabelecimento") : "0",
                Nome: $("#selectFavorecidoProLabore > option:selected").text()
            });
        }

        if (!bloquearAgenciamento) {

            comissionamentos.push({
                DadosBancarios: {
                    NumeroBanco: parseInt($("#cboBancoDebitoAG").val()),
                    DigitoAgencia: parseInt($("#txtDigitoAG").val()),
                    NumeroAgencia: parseInt($("#txtAgenciaAG").val()),
                    NumeroContaCorrente: parseInt($("#txtContaAG").val()),
                    DigitoContaCorrente: parseInt($("#txtDigitoContaAG").val()),
                },
                CodigoTipoComissao: "AG",
                PercentualParticipacao: 100,
                CodigoCliente: $("#selectFavorecidoAgenciamento > option:selected").val() ? parseInt($("#selectFavorecidoAgenciamento > option:selected").val()) : 0,
                CodigoClienteOperacional: $("#selectFavorecidoAgenciamento > option:selected").attr("codigoclienteoperacional") ? parseInt($("#selectFavorecidoAgenciamento > option:selected").attr("codigoclienteoperacional")) : 0,
                CodigoEstabelecimento: $("#selectFavorecidoAgenciamento > option:selected").attr("CodigoEstabelecimento") ? $("#selectFavorecidoAgenciamento > option:selected").attr("CodigoEstabelecimento") : "0",
                Nome: $("#selectFavorecidoAgenciamento").text()
            });
        }

        $.ajax({
            url: '/emissao/SalvarFavorecidosComissionamento',
            type: 'post',
            contentType: "application/json",
            success: function () {
                callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                Comissionamentos: comissionamentos
            })
        })
    },

}

window.FavorecidosComissionamentoEvents = {
    //OnCLick/OnChange/OnBlur/On's
    initialize: function (callback) {

    },
}