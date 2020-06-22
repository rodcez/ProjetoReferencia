
const StatusCO = Object.freeze({
    'Aceitar': { 'cod': 7, 'desc': "Proposta Aprovada" },
    'Recusar': { 'cod': 17, 'desc': "Proposta Recusada" },
    'Repicar': { 'cod': 18, 'desc': "Repique Proposta" }
});


window.AceitacaoCOUI = {

    initialize: function (callback) {
        callback && callback();
    },

    habilitaDesabilitaStatusAceitacaoCO: function () {

        if (cotacao.StatusCO.Codigo == 5) {
            $("#selectStatusAceitacaoCO").prop('disabled', false);
        } else {
            $("#selectStatusAceitacaoCO").prop('disabled', true);
        }
    },

    showHideMotivoStatus: function () {

        if ($("#selectStatusAceitacaoCO").val() == '1') {
            $('#divMotivoAceitacaoCO').hide();
        } else {
            $('#divMotivoAceitacaoCO').show();
        }
    },

    alterarStatusAceitacaoCO: function (status) {
        $('#divMotivoAceitacaoCO').show();

        if (status.codigoStatus == StatusCO.Recusar.cod) {
            $("#selectStatusAceitacaoCO").val(2);

        } else if (status.codigoStatus == StatusCO.Repicar.cod) {
            $("#selectStatusAceitacaoCO").val(3);

        } else {
            $("#selectStatusAceitacaoCO").val(1);
            $('#divMotivoAceitacaoCO').hide();
        }

        $("#selectStatusAceitacaoCO").change();
        $('#txtMotivoAceitacaoCO').val(status.descricaoMotivoStatus);
    }
}

window.AceitacaoCOFunctions = {

    initialize: function (callback) {
        window.AceitacaoCOFunctions.obterUltimoStatusCotacao();
        callback && callback();
    },

    obterUltimoStatusCotacao: function (callback) {

        $.ajax({
            url: '/cotacao/ObterStatus',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.AceitacaoCOUI.alterarStatusAceitacaoCO(data[0]);
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
                CodigoStatus: null,
                UltimoStatus: true
            })
        })
    },

    alterarStatusAceitacaoCO: function (callback, status) {

        $.ajax({
            url: '/cotacao/AlterarStatus',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                // closeModalWait();

                if (status.cod == StatusCO.Aceitar.cod) {
                    notification("sucesso", "Carta Oferta aceita com sucesso!", "");
                } else if (status.cod == StatusCO.Recusar.cod) {
                    notification("sucesso", "Carta Oferta recusada!", "");
                } else if (status.cod == StatusCO.Repicar.cod) {
                    notification("sucesso", "Repique solicitado com sucesso!", "");
                }
                $('#statusCotacao').text("STATUS:" + status.desc);
                cotacao.Status = { Codigo: status.cod, Descricao: status.desc };

                window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
                window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();

                window.CotacaoFunctions.atualizarObjetoCotacao();

                callback && callback();
            },
            error: function (data) {
                // closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                CodigoStatus: status.cod,
                DescricaoStatus: status.desc,
                Data: new Date(),
                DescricaoMotivoStatus: $('#txtMotivoAceitacaoCO').val()
            })
        })
    },


    aceitar: function () {

        if (confirm("Deseja Aceitar a Carta Oferta?")) {
            window.AceitacaoCOFunctions.alterarStatusAceitacaoCO(function () {

            }, StatusCO.Aceitar);
        }
    },

    recusar: function () {

        if (confirm("Deseja Recusar a Carta Oferta?")) {
            window.AceitacaoCOFunctions.alterarStatusAceitacaoCO(function () {

            }, StatusCO.Recusar);
        }
    },

    repicar: function () {

        if (confirm("Deseja solicitar repique da Proposta?")) {
            window.AceitacaoCOFunctions.alterarStatusAceitacaoCO(function () {

            }, StatusCO.Repicar);
        }
    },

    validaMotivo: function (callback) {

        if ($('#selectStatusAceitacaoCO').val() != '1' && $('#txtMotivoAceitacaoCO').val() == '') {
            $('#txtMotivoAceitacaoCO').addClass('input-validation-error');
            notification('erro', 'Campo Motivo é de prenchimento obrigatório', 'txtMotivoAceitacaoCO');
            return;
        }

        callback && callback();
    }
}

window.AceitacaoCOEvents = {

    onClickSalvarAceitacaoCO: function () {

        window.AceitacaoCOFunctions.validaMotivo(function () {

            let opcaoAceite = $('#selectStatusAceitacaoCO').val();

            if (opcaoAceite == '1') {

                window.AceitacaoCOFunctions.aceitar();

            } else if (opcaoAceite == '2') {

                window.AceitacaoCOFunctions.recusar();

            } else if (opcaoAceite == '3') {

                window.AceitacaoCOFunctions.repicar();
            }

        });

    },

    onChangeSelectStatusAceitacaoCO: function () {

        $('#txtMotivoAceitacaoCO').val('');
        window.AceitacaoCOUI.showHideMotivoStatus();
    }

}
