//Inicialização de objetos

var numeroComissionamentoSelecionado = 1;

//Classes
window.CenariosComissionamentoUi = {
    //Alterações da Tela: Bloqueio/Show/Hide/Preencher/Limpar
    initialize: function (callback) {
        window.CenariosComissionamentoUi.carregarPlanosCenariosComissionamento();
        window.CenariosComissionamentoUi.verificarVisibilidadeBotoes();
    },

    carregarPlanosCenariosComissionamento: function () {

        var planos = cotacao.CenariosCotacao.filter(x => x.numeroCenario == numeroCenarioSelecionadoDC)[0].planosCondicoesComerciais;

        $('#selectPlanoCenComiss').empty();
        $('#selectPlanoCenComiss').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < planos.length; i++) {
            $('#selectPlanoCenComiss').append('<option ' + (i == 0 ? ' selected ' : '') + ' value="' + planos[i].numeroPlano + '">' + planos[i].numeroPlano + '</option>');
        }

        $('#selectPlanoCenComiss').change();
    },

    popularGridCenariosComissionamento: function (data) {

        $('#tabelaCenariosComissionamento').DataTable().clear().destroy();

        if (data == undefined) {
            data = [];
            return;
        }

        $('#tabelaCenariosComissionamento').DataTable({
            "data": data,
            "columns": [
                { "data": "numeroComissionamento" },
                { "data": "percentualTotalCorretagem" },
                { "data": "percentualTotalProLabore" },
                { "data": "percentualTotalAgenciamento" },
                { "data": "percentualTaxaMedia" },
                { "data": "valorPremioTotal" }
            ],
            columnDefs: [
                {
                    targets: 0,
                    className: 'textAlignCenter',
                    render: function (data, type, row) {
                        return "<input name='rbComissionamento' id='rbComissionamento_" + data + "' value='" + data + "'   type='radio' " +
                            (numeroComissionamentoSelecionado == data ? "checked" : "") + "  onclick='window.CenariosComissionamentoEvents.onClickCenarioComissionamento(this)'>";
                    }
                },
                {
                    targets: 1,
                    className: 'textAlignCenter',
                    render: function (data) {
                        return helperFormatacao.formatarDecimal(data, 2);
                    }
                },
                {
                    targets: 2,
                    className: 'textAlignCenter',
                    render: function (data) {
                        return helperFormatacao.formatarDecimal(data, 2);
                    }
                },
                {
                    targets: 3,
                    className: 'textAlignCenter',
                    render: function (data) {
                        return helperFormatacao.formatarDecimal(data, 2);
                    }
                },
                {
                    targets: 4,
                    className: 'textAlignCenter',
                    render: function (data) {
                        return helperFormatacao.formatarDecimal(data, 4);
                    }
                },
                {
                    targets: 5,
                    className: 'textAlignRight',
                    render: function (data) {
                        return helperFormatacao.formatarDecimal(data, 2, true);
                    }
                }],
            ordering: false,
            searching: false,
            bPaginate: false,
            language: {
                sEmptyTable: "Nenhum registro encontrado",
                sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "",
                sInfoFiltered: "(Filtrados de _MAX_ registros)",
                sInfoPostFix: "",
                sInfoThousands: ".",
                sLengthMenu: "_MENU_ resultados por página",
                sLoadingRecords: "Carregando...",
                sProcessing: "Processando...",
                sZeroRecords: "Nenhum registro encontrado",
                sSearch: "Filtrar: &nbsp;",
                oPaginate: {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                }
            }
        });

        $('.sorting_asc').removeClass('sorting_asc');
    },

    verificarVisibilidadeBotoes: function () {
        if (cotacao.PropostaEmissao != null && cotacao.PropostaEmissao.NumeroCenarioComissionamento != null) {
            $('#btnExportarCartaOferta').removeAttr('disabled');

            if (cotacao.Status.Codigo == 4) {
                $('#btnCartaOfertaEnviada').removeAttr('disabled');
            }
        }

        if (cotacao.Status.Codigo == 4) {
            $('#btnSalvarCartaOferta').removeAttr('disabled');
        } else {
            $('#btnSalvarCartaOferta').attr('disabled', '');
            $('#btnCartaOfertaEnviada').attr('disabled', '');
        }
    },

    limparCampos: function () {

        $('#selectPlanoCenComiss').empty();
        $('#selectPlanoCenComiss').append('<option value="-1">Selecione</option>');

        $('#tabelaCenariosComissionamento').DataTable().clear().destroy();
    },
}

window.CenariosComissionamentoFunctions = {

    //Funcionalidades/Ajax/Alterações De Comportamento/Objeto
    initialize: function (callback) {
        window.CenariosComissionamentoFunctions.obterCenarioComissionamento();
    },

    salvarDadosCenarioComissionamento: function (callback) {
        $.ajax({
            url: '/cotacao/SalvarCenarioComissionamento/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                notification("sucesso", "Carta Oferta gerada com sucesso!", "");
                //ver se aqui é o melhor lugar pra lidar com os botões de exportar/enviar, já que tem o btn de salvar

                window.CotacaoFunctions.atualizarObjetoCotacao(function () {
                    window.CenariosComissionamentoUi.verificarVisibilidadeBotoes();
                });

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
                NumeroCenario: numeroCenarioSelecionadoDC,
                NumeroVersao: numeroVersaoSelecionadaDC,
                NumeroCenarioComissionamento: parseInt(numeroComissionamentoSelecionado)
            })
        })
    },

    obterCenariosComissionamento: function (callback) {

        if ($('#selectPlanoCenComiss').val() == "-1") {
            window.CenariosComissionamentoUi.popularGridCenariosComissionamento();
        }
        else {
            $.ajax({
                url: '/calculo/ObterCenariosComissionamento/',
                type: 'post',
                contentType: "application/json",
                success: function (data) {
                    closeModalWait();
                    window.CenariosComissionamentoUi.popularGridCenariosComissionamento(data.value);
                    window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();
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
                    NumeroCenario: numeroCenarioSelecionadoDC,
                    NumeroVersao: numeroVersaoSelecionadaDC,
                    NumeroPlano: parseInt($('#selectPlanoCenComiss').val())
                })
            })
        }
    },

    obterCenarioComissionamento: function () {
        if (cotacao.PropostaEmissao != null && cotacao.PropostaEmissao.NumeroCenarioComissionamento != null)
            numeroComissionamentoSelecionado = cotacao.PropostaEmissao.NumeroCenarioComissionamento;
    },

    alterarStatusCartaOfertaEnviada: function (callback) {

        $.ajax({
            url: '/cotacao/AlterarStatus',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                notification("sucesso", "Carta Oferta enviada com sucesso!", "");
                window.CenariosComissionamentoFunctions.alterarStatusCotacao();
                window.CenariosComissionamentoUi.verificarVisibilidadeBotoes();
                window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
                window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();
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
                CodigoStatus: 5,
                DescricaoStatus: "Proposta Liberada ao Corretor",
                Data: new Date(),
                Usuario: ""  //Está atribuindo valor da Claims no controller
            })
        })
    },

    validarSessoes: function () {
        return window.CosseguroCedidoFunctions.validaSalvarCosseguro() &&
            window.DadosCartaOfertaFunctions.validaSalvarDadosCartaOferta();
    },

    validarAlteracaoComissionamento: function () {
        var numeroComissionamentoCotacaoInvalido = cotacao.PropostaEmissao == null || cotacao.PropostaEmissao.NumeroCenarioComissionamento == null;
        var numeroComissionamentoCotacao = numeroComissionamentoCotacaoInvalido ? 0 : cotacao.PropostaEmissao.NumeroCenarioComissionamento;

        var alteracao = false;

        if (numeroComissionamentoCotacao == 0) {
            if (numeroComissionamentoSelecionado != 1) {
                alteracao = true;
            }
        } else {
            if (numeroComissionamentoCotacao != numeroComissionamentoSelecionado) {
                alteracao = true;
            }
        }

        return alteracao;
    },

    //Fazer atualizar o objeto cotação? 
    //Melhor chamar a API de novo do que imputar na mão da primeira vez, porque na próxima já terá vindo da cotação?
    alterarStatusCotacao: function () {
        cotacao.Status.Codigo = 5;
        cotacao.Status.Descricao = "Proposta Liberada ao Corretor";

        $('#statusCotacao').text("STATUS: " + cotacao.Status.Descricao);
    },

    exportarCartaOferta: function (callback) {
        $.ajax({
            url: '/relatorio/CartaOferta',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                //TODO: Colocar as duas funções abaixo em um arquivo Helper
                if (data.fileContents != null && data.fileContents.length > 0) {
                    blob = converBase64toBlob(data.fileContents, data.contentType);
                    saveFile(blob, data.fileDownloadName);
                }
                else
                    notification("erro", "Relatório não disponível para exportação!");
            },
            error: function (data) {
                closeModalWait();
                notification("erro", "Erro ao tentar exportar o arquivo!");
            },
            data: JSON.stringify({
                IdCotacao: cotacao._id,
                NumeroCenario: numeroCenarioSelecionadoDC,
                NumeroVersao: numeroVersaoSelecionadaDC,
                NumeroPlano: parseInt($('#selectPlanoCenComiss').val()),
                TipoRelatorio: 'CartaOferta'
            })
        });
    },
}

window.CenariosComissionamentoEvents = {
    //OnCLick/OnChange/OnBlur/On's
    initialize: function (callback) {

    },

    onChangePlanoCenComiss: function () {
        window.CenariosComissionamentoFunctions.obterCenariosComissionamento(); //Callback <- ? popularGrid?
    },

    onClickSalvar: function () {
        if (!window.CenariosComissionamentoFunctions.validarSessoes())
            return;

        if (window.CenariosComissionamentoFunctions.validarAlteracaoComissionamento()) {
            if (!confirm("Ao alterar o comissionamento para o plano selecionado, todos os planos serão atualizados com o mesmo comissionamento. Deseja continuar?")) {


                if (cotacao.PropostaEmissao == null) {
                    numeroComissionamentoSelecionado = 1;
                } else {
                    numeroComissionamentoSelecionado = cotacao.PropostaEmissao.NumeroCenarioComissionamento;
                }

                $('#rbComissionamento_' + numeroComissionamentoSelecionado).prop("checked", true);
                return;
            }
        }
        openModalWait();

        window.CosseguroCedidoFunctions.salvarCosseguroCedido();
        window.DadosCartaOfertaFunctions.salvarDadosCartaOferta();
        window.CenariosComissionamentoFunctions.salvarDadosCenarioComissionamento();
    },

    onClickCenarioComissionamento: function (rbComissionamento) {
        numeroComissionamentoSelecionado = rbComissionamento.value;
    },

    onClickExportar: function () {
        openModalWait();
        window.CenariosComissionamentoFunctions.exportarCartaOferta();
    },

    onClickCartaOfertaEnviada: function () {
        if (confirm("Deseja confirmar que a Carta Oferta foi enviada para o corretor?")) {
            window.CenariosComissionamentoFunctions.alterarStatusCartaOfertaEnviada();
        }
    },
}

$(document).ready(function () {

});