
const Status = Object.freeze({
    'Aceitar': { 'cod': 4, 'desc': "Aguardando Proposta" },
    'Recusar': { 'cod': 14, 'desc': "Cotação Recusada" },
    'Repicar': { 'cod': 15, 'desc': "Repique Cotação" }
});


window.AceitacaoUI = {

    initialize: function (callback) {

        // comentado para poder testar
        // window.AceitacaoUI.habilitaDesabilitaStatusAceitacao();

        callback && callback();
    },

    habilitaDesabilitaStatusAceitacao: function () {

        if (cotacao.Status.Codigo == 3) {
            $("#selectStatusAceitacaoOrcamento").prop('disabled', false);
        } else {
            $("#selectStatusAceitacaoOrcamento").prop('disabled', true);
        }
    },

    showHideMotivoStatus: function () {

        if ($("#selectStatusAceitacaoOrcamento").val() == '1') {
            $('#divMotivoAceitacaoOrcamento').hide();
        } else {
            $('#divMotivoAceitacaoOrcamento').show();
        }
    },

    alterarStatusAceitacao: function (status) {
        $('#divMotivoAceitacaoOrcamento').show();

        if (status.codigoStatus == Status.Recusar.cod) {
            $("#selectStatusAceitacaoOrcamento").val(2);

        } else if (status.codigoStatus == Status.Repicar.cod) {
            $("#selectStatusAceitacaoOrcamento").val(3);

        } else {
            $("#selectStatusAceitacaoOrcamento").val(1);
            $('#divMotivoAceitacaoOrcamento').hide();
        }

        $("#selectStatusAceitacaoOrcamento").change();
        $('#txtMotivoOrcamentoAceitacao').val(status.descricaoMotivoStatus);
    }
}

window.AceitacaoFunctions = {

    initialize: function (callback) {
        window.AceitacaoFunctions.obterUltimoStatusCotacao();
        callback && callback();
    },

    obterUltimoStatusCotacao: function (callback) {

        $.ajax({
        url: '/cotacao/ObterStatus',
        type: 'post',
        contentType: "application/json",
        success: function (data) {
            closeModalWait();
            window.AceitacaoUI.alterarStatusAceitacao(data[0]);
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

    alterarStatusOrcamentoAceitacao: function (callback, status) {

        $.ajax({
            url: '/cotacao/AlterarStatus',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                // closeModalWait();

                if (status.cod == Status.Aceitar.cod) {
                    notification("sucesso", "Orçamento aceito com sucesso!", "");
                } else if (status.cod == Status.Recusar.cod) {
                    notification("sucesso", "Orçamento recusado com sucesso!", "");
                } else if (status.cod == Status.Repicar.cod) {
                    notification("sucesso", "Repique solicitado com sucesso!", "");
                }
                $('#statusCotacao').text("STATUS:" + status.desc);
                cotacao.Status = { Codigo: status.cod, Descricao: status.desc };
                window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
                window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();

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
                DescricaoMotivoStatus: $('#txtMotivoOrcamentoAceitacao').val()
            })
        })
    },


aceitar: function () {

    if (confirm("Deseja Aceitar o Orçamento?Sim/Não")) {
        window.AceitacaoFunctions.alterarStatusOrcamentoAceitacao(function () {

            // habilitar aba carta oferta

        }, Status.Aceitar);
    }
},

recusar: function () {

    if (confirm("Deseja Recusar o Orçamento?Sim/Não")) {
        window.AceitacaoFunctions.alterarStatusOrcamentoAceitacao(function () {

            //Sistema deve bloquear todos os dados da cotação não permitindo mais nenhuma ação

        }, Status.Recusar);
    }
},

repicar: function () {

    if (confirm("Deseja solicitar repique do Orçamento?Sim/Não")) {
        window.AceitacaoFunctions.alterarStatusOrcamentoAceitacao(function () {

            //Ao solicitar o Repique o sistema deve habilitar os campos da tela de cotação,
            //calculo e Orçamento para realização das alterações necessárias, permitindo que seja gerado um novo orçamento e o mesmo seja enviado novamente.

        }, Status.Repicar);
    }
},

validaMotivoOrcamento: function (callback) {

    if ($('#selectStatusAceitacaoOrcamento').val() != '1' && $('#txtMotivoOrcamentoAceitacao').val() == '') {
        $('#txtMotivoOrcamentoAceitacao').addClass('input-validation-error');
        notification('erro', 'O campo de Motivo deve ser preenchido.', 'txtMotivoOrcamentoAceitacao');
        return;
    }

    callback && callback();
}
}

window.AceitacaoEvents = {

    onClickSalvarAceitacao: function () {

        window.AceitacaoFunctions.validaMotivoOrcamento(function () {

            let opcaoAceite = $('#selectStatusAceitacaoOrcamento').val();

            if (opcaoAceite == '1') {

                window.AceitacaoFunctions.aceitar();

            } else if (opcaoAceite == '2') {

                window.AceitacaoFunctions.recusar();

            } else if (opcaoAceite == '3') {

                window.AceitacaoFunctions.repicar();
            }

        });

    },

    onChangeSelectStatusAceitacaoOrcamento: function () {

        $('#txtMotivoOrcamentoAceitacao').val('');
        window.AceitacaoUI.showHideMotivoStatus();
    }

}
