

window.CosseguroCedidoUI = {

    initialize: function (callback) {

        window.CosseguroCedidoUI.addMasks();
        window.CosseguroCedidoUI.preencherCamposCosseguro();
        window.CosseguroCedidoUI.habilitaDesabilitaCampos();

        callback && callback();
    },

    addMasks: function () {

        $('.maskMoneyPercent2').maskMoney({
            precision: 2, decimal: ","
        });
    },

    habilitaDesabilitaCampos: function () {

        if ($("#selectSeguradoraAceitacao").val() !== "0") {

            $("#txtCosseguroPercAceitacao").prop('disabled', false);
            $("#txtComissaoPercAceitacao").prop('disabled', false);
            $("#txtDAPercAceitacao").prop('disabled', false);
        } else {
            window.CosseguroCedidoUI.preencherCamposCosseguro();

            $("#txtCosseguroPercAceitacao").prop('disabled', true);
            $("#txtComissaoPercAceitacao").prop('disabled', true);
            $("#txtDAPercAceitacao").prop('disabled', true);
        }


    },

    preencherCamposCosseguro: function () {

        $('#txtCosseguroPercAceitacao').val('');
        $('#txtComissaoPercAceitacao').val('');
        $('#txtDAPercAceitacao').val('');
    },

    popularCosseguroCedido: function () {
        if (cotacao.CosseguroCedido != null && cotacao.CosseguroCedido.CodigoSeguradora != null) {
            $("#selectSeguradoraAceitacao").val(cotacao.CosseguroCedido.CodigoSeguradora);
            $('#txtCosseguroPercAceitacao').val(cotacao.CosseguroCedido.PercentualCosseguro);
            $('#txtComissaoPercAceitacao').val(cotacao.CosseguroCedido.PercentualComissao);
            $('#txtDAPercAceitacao').val(cotacao.CosseguroCedido.PercentualDespesaAdministrativa);
        }
    }
}

window.CosseguroCedidoFunctions = {

    initialize: function (callback) {
        window.AnaliseDeRiscoFunctions.analisarRiscoCenario(); //Verificar

        callback && callback();
    },

    salvarCosseguroCedido: function (callback) {
        if ($("#selectSeguradoraAceitacao").val() !== "0") {
            $.ajax({
                url: '/cotacao/SalvarCosseguroCedido/',
                type: 'post',
                contentType: "application/json",
                success: function (data) {
                    closeModalWait();
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
                    CodigoSeguradora: parseInt($('#selectSeguradoraAceitacao').val()),
                    NomeSeguradora: $('#selectSeguradoraAceitacao option:selected').text(),
                    CodigoClienteOperacionalSeguradora: window.CosseguroCedidoFunctions.obterCodigoClienteSeguradora(),
                    PercentualCosseguro: $("#txtCosseguroPercAceitacao").maskMoney('unmasked')[0],
                    PercentualComissao: $("#txtComissaoPercAceitacao").maskMoney('unmasked')[0],
                    PercentualDespesaAdministrativa: $("#txtDAPercAceitacao").maskMoney('unmasked')[0],
                })
            })
        }
    },

    obterCodigoClienteSeguradora: function () {
        if (dataSeguradorasService.seguradoras.seguradora.length > 0) {
            var seguradora = dataSeguradorasService.seguradoras.seguradora.filter(function (dataSeguradora) {
                return dataSeguradora.codigoSusep == $('#selectSeguradoraAceitacao').val();
            })[0];

            return parseInt(seguradora.codigoCliente);
        }

        return 0;
    },

    validaSalvarCosseguro: function () {
        var validacao = true;
        if ($("#selectSeguradoraAceitacao").val() !== "0") {

            validacao = window.CosseguroCedidoFunctions.validaCampoCosseguroPerc() &&
                window.CosseguroCedidoFunctions.validaCampoComissaoPerc() &&
                window.CosseguroCedidoFunctions.validaCampoDaPerc();
        }

        return validacao;
    },

    validaCampoCosseguroPerc: function () {

        if (!$("#txtCosseguroPercAceitacao").val()) {
            $("#txtCosseguroPercAceitacao").addClass("input-validation-error");
            notification("erro", "O campo % Cosseguro deve ser preenchido", "txtCosseguroPercAceitacao");
            return false;
        }

        return true;
    },

    validaCampoComissaoPerc: function () {

        if (!$("#txtComissaoPercAceitacao").val()) {
            $("#txtComissaoPercAceitacao").addClass("input-validation-error");
            notification("erro", "O campo % Comissão deve ser preenchido", "txtComissaoPercAceitacao");
            return false;
        }

        return true;
    },

    validaCampoDaPerc: function () {

        if (!$("#txtDAPercAceitacao").val()) {
            $("#txtDAPercAceitacao").addClass("input-validation-error");
            notification("erro", "O campo % DA deve ser preenchido", "txtDAPercAceitacao");
            return false;
        }

        return true;
    }
}

window.CosseguroCedidoEvents = {

    onChangeCampoCosseguroPerc: function () {

        if (($("#txtCosseguroPercAceitacao").maskMoney('unmasked')[0] > 99.99) ||
            ($("#txtCosseguroPercAceitacao").maskMoney('unmasked')[0] < 0.01)) {
            $("#txtCosseguroPercAceitacao").addClass("input-validation-error");
            notification("erro", "O limite permitido do campo % Cosseguro é mínimo 0,01% e máximo 99,99%.", "txtCosseguroPercAceitacao");
            return false;
        }

    },

    onChangeCampoComissaoPerc: function () {

        if (($("#txtComissaoPercAceitacao").maskMoney('unmasked')[0] > 99.99) ||
            ($("#txtComissaoPercAceitacao").maskMoney('unmasked')[0] < 0.01)) {
            $("#txtComissaoPercAceitacao").addClass("input-validation-error");
            notification("erro", "O limite permitido do campo % Comissão é mínimo 0,01% e máximo 99,99%.", "txtComissaoPercAceitacao");
            return false;
        }

    },

    onChangeCampoDaPerc: function () {

        let maxDA = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMaximoDespesasAdministrativas;
        let minDA = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMinimoDespesasAdministrativas;

        if (($("#txtDAPercAceitacao").maskMoney('unmasked')[0] > maxDA || $("#txtDAPercAceitacao").maskMoney('unmasked')[0] < minDA)) {
            $("#txtDAPercAceitacao").addClass("input-validation-error");
            notification("erro", `O limite permitido do campo % DA é mínimo ${minDA} e máximo ${maxDA}.`, "txtDAPercAceitacao");
            return false;
        }

    }

}
