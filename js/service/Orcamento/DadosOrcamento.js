//Inicialização de objetos
var indiceCenarioSelecionadoDO = 0;
var indicadorPlanosAgrupados = false;
var numeroVersaoSelecionadaDO = 0;
var numeroCenarioSelecionado = 0;
var dadosOrcamento = null;

//Classes
var DadosOrcamento = (function () {
    function DadosOrcamento(numeroCotacao, dataManutencao, usuarioManutencao, impressoes) {
        this.numeroCotacao = numeroCotacao;
        this.dataManutencao = dataManutencao;
        this.usuarioManutencao = usuarioManutencao;
        this.impressoes = impressoes;
    }

    return DadosOrcamento;
}());

var ImpressaoOrcamento = (function () {
    function ImpressaoOrcamento(numeroCenario, numeroVersao, codigoTipoImpressao, codigoTextoAfastados, codigoTextoAposentados, indicadorPlanosAgrupados, textoObservacao) {
        this.numeroCenario = numeroCenario;
        this.numeroVersao = numeroVersao;
        this.codigoTipoImpressao = codigoTipoImpressao;
        this.codigoTextoAfastados = codigoTextoAfastados;
        this.codigoTextoAposentados = codigoTextoAposentados;
        this.indicadorPlanosAgrupados = indicadorPlanosAgrupados;
        this.textoObservacao = textoObservacao;
    }

    return ImpressaoOrcamento;
}());


window.DadosOrcamentoUi = {
    //Alterações da Tela: Bloqueio/Show/Hide/Preencher/Limpar
    initialize: function (callback) {
        window.DadosOrcamentoUi.carregarCenarios();
        window.DadosOrcamentoUi.carregarVersoesDoCenario();
        window.DadosOrcamentoUi.carregarIndicadorAgrupados();
        window.DadosOrcamentoUi.limparCampos();
    },

    carregarCenarios: function () {
        $("#cenariosDO > li").remove();
        cotacao.CenariosCotacao.forEach(function (cen) {
            cen.numeroCenario == 1 ?
                $("#cenariosDO").append("<li class='active'><a data-toggle='tab' href='#' id='liCen" + cen.numeroCenario + "AR'>Cen. " + cen.numeroCenario + "</a></li >") :
                $("#cenariosDO").append("<li><a data-toggle='tab' href='#' id='liCen" + cen.numeroCenario + "AR'>Cen. " + cen.numeroCenario + "</a></li >")

        });

        $('#cenariosDO a').unbind('shown.bs.tab');
        $('#cenariosDO a').on('shown.bs.tab', function (e) {
            window.DadosOrcamentoEvents.onChangeCenario($(e.target).closest('li').index());
        });
    },

    carregarVersoesDoCenario: function () {
        closeModalWait();
        //Dados iniciais do combo de versões do cálculo
        $('#selectVersaoDadosOrcamento').empty();
        $('#selectVersaoDadosOrcamento').append('<option value="0">Selecione</option>');
        cotacao.CenariosCotacao[indiceCenarioSelecionadoDO].versoesCalculo.forEach(function (cenVer) {
            if (cenVer.indicadorVersaoCalculada)
                $('#selectVersaoDadosOrcamento').append('<option value="' + cenVer.numeroVersao + '">' + cenVer.numeroVersao + '</option>');
        });
    },

    carregarIndicadorAgrupados: function () {
        closeModalWait();
        indicadorPlanosAgrupados = cotacao.CenariosCotacao[indiceCenarioSelecionadoDO].indicadorPlanoMesmaCobertura;
        if (indicadorPlanosAgrupados) {
            $('#SimPlanosAgrupadosDO').prop("checked", true);
        }
        else {
            $('#NaoPlanosAgrupadosDO').prop("checked", true);
        }
    },

    exportarDadosOrcamento: function () {
        // Para exportar em Word
    },

    desabilitarOrcamento: function () {
        $('#btnOrcamentoEnviado').attr('disabled', '');
    },

    desabilitarSalvar: function () {
        $('#btnSalvarOrcamento').attr('disabled', '');
    },

    habilitarOrcamento: function () {
        $('#btnOrcamentoEnviado').removeAttr('disabled');
    },

    habilitarExportar: function () {
        $('#btnExportarOrcamento').removeAttr('disabled');
    },

    limparCampos: function () {
        $('#selectAfastados').val(0);
        $('#selectAfastados').change();

        $('#selectAposentados').val(0);
        $('#selectAposentados').change();

        $("#txtObservacaoOrcamento").val("");

        if (cotacao.Status.Codigo == 2 || cotacao.Status.Codigo == 15) {
            $('#btnExportarOrcamento').attr('disabled', '');
            $('#btnOrcamentoEnviado').attr('disabled', '');
            $('#btnSalvarOrcamento').removeAttr('disabled');
        } else {
            $('#btnSalvarOrcamento').attr('disabled', '');
            if ($("#selectVersaoDadosOrcamento").val() == 0)
                $('#btnExportarOrcamento').attr('disabled', '');
            $('#btnOrcamentoEnviado').removeAttr('disabled');
            $('#btnOrcamentoEnviado').attr('disabled', '');
        }
    },

    popularDadosOrcamento: function () {

        //TODO: usar o numeroCenarioSelecionado
        var numCen = cotacao.CenariosCotacao[indiceCenarioSelecionadoDO].numeroCenario;

        if (cotacao.Status.Codigo == 2 || cotacao.Status.Codigo == 15) {
            $('#btnOrcamentoEnviado').removeAttr('disabled');
        } else {
            $('#btnOrcamentoEnviado').attr('disabled', '');
        }

        for (var i = 0; i < dadosOrcamento.impressoes.length; i++) {
            if (dadosOrcamento.impressoes[i].numeroCenario == numCen &&
                dadosOrcamento.impressoes[i].numeroVersao == numeroVersaoSelecionadaDO &&
                dadosOrcamento.impressoes[i].codigoTipoImpressao == 1) {

                var impressao = dadosOrcamento.impressoes[i];

                if (impressao.indicadorPlanosAgrupados) {
                    $('#SimPlanosAgrupadosDO').prop("checked", true);
                }
                else {
                    $('#NaoPlanosAgrupadosDO').prop("checked", true);
                }

                $('#selectAfastados').val(impressao.codigoTextoAfastados);
                $('#selectAfastados').change();

                $('#selectAposentados').val(impressao.codigoTextoAposentados);
                $('#selectAposentados').change();

                $("#txtObservacaoOrcamento").val(impressao.textoObservacao);

                if (cotacao.Status.Codigo == 2 || cotacao.Status.Codigo == 15) {
                    $('#btnSalvarOrcamento').removeAttr('disabled');
                    $('#btnExportarOrcamento').removeAttr('disabled');
                    $('#btnOrcamentoEnviado').removeAttr('disabled');
                }
                else {
                    $('#btnSalvarOrcamento').attr('disabled', '');
                    $('#btnOrcamentoEnviado').attr('disabled', '');

                    $('#btnExportarOrcamento').removeAttr('disabled');
                }
            }
        }
    }
}

window.DadosOrcamentoFunctions = {
    //Funcionalidades/Ajax/Alterações De Comportamento/Objeto
    initialize: function (callback) {
        openModalWait();
        window.DadosOrcamentoFunctions.obterTextosImpressao(function () {
            callback && callback();
        });
    },

    obterTextosImpressao: function (callback) {

        $.ajax({
            url: '/ObterTextosImpressao',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosOrcamentoFunctions.popularCombos(data);
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
                CodigoProdutoComercial: ProdutoComercial.produtoComercial.codigoProdutoComercial,
                DataReferencia: cotacao.DataReferencia,
                TipoImpressaoCodigo: 1, //1 Orçamento | 2 Carta Oferta
                TipoTextoCodigo: null // 2 Afastastados | 3 Aposentados | null Todos
            })
        })
    },

    salvarDadosOrcamento: function (callback) {

        $.ajax({
            url: '/impressao/SalvarDadosImpressao',
            type: 'post',
            contentType: "application/json",
            success: function () {
                closeModalWait();
                notification("sucesso", "Orçamento salvo com sucesso!", "");
                window.DadosOrcamentoUi.habilitarExportar();
                window.DadosOrcamentoUi.habilitarOrcamento();
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
                //TODO: Trocar a forma de pegar o número do cenário por variável que nem o va versão
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoDO].numeroCenario,
                NumeroVersao: parseInt(numeroVersaoSelecionadaDO),
                CodigoTipoImpressao: 1, //1 Orçamento | 2 Carta Oferta
                IndicadorPlanosAgrupados: indicadorPlanosAgrupados,
                CodigoTextoAfastados: parseInt($("#selectAfastados").val()),
                CodigoTextoAposentados: parseInt($("#selectAposentados").val()),
                TextoObservacao: $("#txtObservacaoOrcamento").val(),
                DataManutencao: new Date(),
                UsuarioManutencao: ""  //Está atribuindo valor da Claims no controller
            })
        })
    },

    obterDadosOrcamento: function (callback) {

        $.ajax({
            url: '/impressao/ObterDadosImpressao',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                callback && callback(data);
            },
            error: function (data) {
                closeModalWait();
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id
            })
        })
    },

    alterarStatusOrcamentoEnviado: function (callback) {

        $.ajax({
            url: '/cotacao/AlterarStatus',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                notification("sucesso", "Orçamento enviado com sucesso!", "");
                window.DadosOrcamentoUi.desabilitarSalvar();
                window.DadosOrcamentoUi.desabilitarOrcamento();
                window.DadosOrcamentoFunctions.alterarStatusCotacao();
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
                CodigoStatus: 3,
                DescricaoStatus: "Cotação liberada ao corretor",
                Data: new Date(),
                Usuario: ""  //Está atribuindo valor da Claims no controller
            })
        })
    },

    popularCombos: function (data) {

        //TipoImpressaoCodigo - 1 = Orçamento
        //TextoCodigo - 2 = Afastados / 3 Aposentados
        $('#selectAfastados').empty();
        $('#selectAfastados').append('<option value="0">Selecione</option>');

        $('#selectAposentados').empty();
        $('#selectAposentados').append('<option value="0">Selecione</option>');

        for (var i = 0; i < data.length; i++) {
            if (data[i].tipoImpressaoCodigo == 1) {
                if (data[i].tipoTextoCodigo == 2) {
                    $('#selectAfastados').append('<option value="' + data[i].textoCodigo + '">' + data[i].textoTitulo + '</option>');
                }

                if (data[i].tipoTextoCodigo == 3) {
                    $('#selectAposentados').append('<option value="' + data[i].textoCodigo + '">' + data[i].textoTitulo + '</option>');
                }
            }
        }
    },

    validarCamposObrigatorios: function () {
        if (numeroVersaoSelecionadaDO <= 0) {
            notification("erro", "O campo Versão do Cálculo deve ser informado", '');
            return false;
        }

        if (indicadorPlanosAgrupados == "undefined") {
            notification("erro", "É obrigatório a seleção do campo Orçamento com Planos Agrupados.", '');
            return false;
        }

        if ($("#selectAfastados").val() == "undefined" || $("#selectAfastados").val() == "0") {
            notification("erro", "É obrigatório a seleção  do texto de afastados", '');
            return false;
        }

        if ($("#selectAposentados").val() == "undefined" || $("#selectAposentados").val() == "0") {
            notification("erro", "É obrigatório a seleção do texto de aposentados.", '');
            return false;
        }

        if ($('#txtObservacaoOrcamento').val().length > 10000) {
            notification("erro", "Limite do campo de observação é de 10.000 caracteres.", '');
            return false;
        }

        return true;
    },

    carregarDadosOrcamento: function () {

        if (dadosOrcamento == null) {

            window.DadosOrcamentoFunctions.obterDadosOrcamento(function (data) {
                var impressoes = [];
                for (var i = 0; i < data.impressoes.length; i++) {
                    var impressao = new ImpressaoOrcamento(
                        data.impressoes[i].numeroCenario,
                        data.impressoes[i].numeroVersao,
                        data.impressoes[i].codigoTipoImpressao,
                        data.impressoes[i].codigoTextoAfastados,
                        data.impressoes[i].codigoTextoAposentados,
                        data.impressoes[i].indicadorPlanosAgrupados,
                        data.impressoes[i].textoObservacao
                    );

                    impressoes.push(impressao);
                }

                dadosOrcamento = new DadosOrcamento(data.numeroCotacao, data.dataManutencao, data.usuarioManutencao, impressoes);

                window.DadosOrcamentoUi.popularDadosOrcamento();
            });
        }
        else {
            window.DadosOrcamentoUi.popularDadosOrcamento();
        }
    },

    alterarStatusCotacao: function () {
        cotacao.Status.Codigo = 3;
        cotacao.Status.Descricao = "Cotação liberada ao corretor";
        window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
        window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();
        $('#statusCotacao').text("STATUS: " + cotacao.Status.Descricao);
    },

    exportarOrcamento: function (callback) {
        $.ajax({
            url: '/relatorio/Orcamento',
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
                    notification("erro", "Orçamento não disponível para exportação!");
            },
            error: function (data) {
                closeModalWait();
                notification("erro", "Erro ao tentar exportar o arquivo!");
            },
            data: JSON.stringify({
                IdCotacao: cotacao._id,
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoDO].numeroCenario,
                NumeroPlano: 1,
                NumeroVersao: parseInt($('#selectVersaoDadosOrcamento').val()),
                TipoRelatorio: 'Orcamento'
            })
        });
    },
}

window.DadosOrcamentoEvents = {
    //OnCLick/OnChange/OnBlur/On's
    initialize: function (callback) {

    },

    onChangeCenario: function (indexAbaAtual) {
        openModalWait();
        indiceCenarioSelecionadoDO = indexAbaAtual;
        indiceVersaoSelecionada = 0;

        window.DadosOrcamentoUi.limparCampos();
        window.DadosOrcamentoUi.carregarVersoesDoCenario();
        window.DadosOrcamentoUi.carregarIndicadorAgrupados();
    },

    onChangeVersao: function (versao) {
        numeroVersaoSelecionadaDO = $(versao).val();
        window.DadosOrcamentoUi.limparCampos();

        if (numeroVersaoSelecionadaDO == 0)
            return;

        window.DadosOrcamentoFunctions.carregarDadosOrcamento();
    },

    onClickSalvar: function () {
        if (window.DadosOrcamentoFunctions.validarCamposObrigatorios()) {
            openModalWait();
            window.DadosOrcamentoFunctions.salvarDadosOrcamento();
        }
    },

    onClickExportar: function () {
        openModalWait();
        window.DadosOrcamentoFunctions.exportarOrcamento();
    },

    onClickOrcamentoEnviado: function () {
        if (confirm("Deseja confirmar que pelo menos um Orçamento foi enviado para o corretor?")) {
            openModalWait();
            window.DadosOrcamentoFunctions.alterarStatusOrcamentoEnviado();
            window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
            window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();
        }
    }
}

$(document).ready(function () {

});