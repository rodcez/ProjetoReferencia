//Inicialização de objetos
var numeroCenarioSelecionadoDC = 0;
var numeroVersaoSelecionadaDC = 0;
var dadosCartaOferta = null;

//Classes
var DadosCartaOferta = (function () {
    function DadosCartaOferta(numeroCotacao, dataManutencao, usuarioManutencao, impressoes) {
        this.numeroCotacao = numeroCotacao;
        this.dataManutencao = dataManutencao;
        this.usuarioManutencao = usuarioManutencao;
        this.impressoes = impressoes;
    }

    return DadosCartaOferta;
}());

var ImpressaoCartaOferta = (function () {
    function ImpressaoCartaOferta(numeroCenario, numeroVersao, codigoTipoImpressao, codigoTextoAfastados, codigoTextoAposentados, indicadorPlanosAgrupados, textoObservacao) {
        this.numeroCenario = numeroCenario;
        this.numeroVersao = numeroVersao;
        this.codigoTipoImpressao = codigoTipoImpressao;
        this.codigoTextoAfastados = codigoTextoAfastados;
        this.codigoTextoAposentados = codigoTextoAposentados;
        this.indicadorPlanosAgrupados = indicadorPlanosAgrupados;
        this.textoObservacao = textoObservacao;
    }

    return ImpressaoCartaOferta;
}());

window.DadosCartaOfertaUi = {
    //Alterações da Tela: Bloqueio/Show/Hide/Preencher/Limpar
    initialize: function (callback) {
        window.DadosCartaOfertaUi.carregarCenarios();
        //window.DadosCartaOfertaUi.carregarVersoesDoCenario();
        //window.DadosCartaOfertaUi.limparCampos();
    },

    carregarCenarios: function () {
        closeModalWait();

        $('#selectCenariosDadosCartaOferta').empty();
        $('#selectCenariosDadosCartaOferta').append('<option value="0">Selecione</option>');
        numeroCenarioSelecionadoDC = 0;

        if (dadosCartaOferta == null)
            return;

        var numCenarios = [];
        for (var i = 0; i < dadosCartaOferta.impressoes.length; i++) 
            numCenarios.push(dadosCartaOferta.impressoes[i].numeroCenario);

        var numCenariosDistinct = Array.from(new Set(numCenarios));

        numCenariosDistinct.forEach(function (numCenario) {
            $('#selectCenariosDadosCartaOferta').append('<option value="' + numCenario + '">' + "Cenário " + numCenario + '</option>');
        });

        var impressaoCartaOferta = dadosCartaOferta.impressoes.filter(function (impressaoFiltro) {
            return impressaoFiltro.codigoTipoImpressao == 2;
        });

        if (impressaoCartaOferta.length > 0) {
            $('#selectCenariosDadosCartaOferta').val(impressaoCartaOferta[0].numeroCenario);
            $('#selectCenariosDadosCartaOferta').change();
        }
    },

    carregarVersoesDoCenario: function () {
        closeModalWait();

        $('#selectVersaoDadosCartaOferta').empty();
        $('#selectVersaoDadosCartaOferta').append('<option value="0">Selecione</option>');
        numeroVersaoSelecionadaDC = 0;

        if (numeroCenarioSelecionadoDC == 0 || dadosCartaOferta == null)
            return;

        //TODO: Colocar esse pedaço em uma função para retornar só a lista de versões passando o numCenario?
        var numVersoes = [];

        for (var i = 0; i < dadosCartaOferta.impressoes.length; i++) {
            var numeroCenario = dadosCartaOferta.impressoes[i].numeroCenario;

            if (numeroCenario == numeroCenarioSelecionadoDC) {
                numVersoes.push(dadosCartaOferta.impressoes[i].numeroVersao);
            }
        }

        numVersoes.forEach(function (numVersao) {
            $('#selectVersaoDadosCartaOferta').append('<option value="' + numVersao + '">' + numVersao + '</option>');
        });

        var impressaoCartaOferta = dadosCartaOferta.impressoes.filter(function (impressaoFiltro) {
            return impressaoFiltro.codigoTipoImpressao == 2;
        });

        if (impressaoCartaOferta.length > 0) {
            $('#selectVersaoDadosCartaOferta').val(impressaoCartaOferta[0].numeroVersao);
            $('#selectVersaoDadosCartaOferta').change();
        }
    },

    popularDadosCartaOferta: function () {
        closeModalWait();

        if (numeroCenarioSelecionadoDC == 0 || numeroVersaoSelecionadaDC == 0)
            return;

        var indicadorPlanosAgrupados = false;
        var textoObservacao = "";
        var codigoTextoAfastados = 0;
        var codigoTextoAposentados = 0;

        //TODO: Colocar essa parte em functions e retornar só o dado encontrado?
        for (var i = 0; i < dadosCartaOferta.impressoes.length; i++) {
            var numeroCenario = dadosCartaOferta.impressoes[i].numeroCenario;
            var numeroVersao = dadosCartaOferta.impressoes[i].numeroVersao;

            if (numeroCenario == numeroCenarioSelecionadoDC && numeroVersao == numeroVersaoSelecionadaDC) {
                indicadorPlanosAgrupados = dadosCartaOferta.impressoes[i].indicadorPlanosAgrupados;
                textoObservacao = dadosCartaOferta.impressoes[i].textoObservacao;
                codigoTextoAfastados = dadosCartaOferta.impressoes[i].codigoTextoAfastados;
                codigoTextoAposentados = dadosCartaOferta.impressoes[i].codigoTextoAposentados;
            }
        }

        //Planos agrupados
        if (indicadorPlanosAgrupados)
            $('#SimPlanosAgrupadosDC').prop("checked", true);
        else
            $('#NaoPlanosAgrupadosDC').prop("checked", true);

        //Combo Afastados
        $('#selectAfastadosDC').val(codigoTextoAfastados);      //Verificar se dá erro no console caso não ache o código
        $('#selectAfastadosDC').change();

        //Combo Aposentados
        $('#selectAposentadosDC').val(codigoTextoAposentados);
        $('#selectAposentadosDC').change();

        //Texto Observação
        $("#txtObservacaoDC").val(textoObservacao);
    },

    limparCampos: function () {
        $('#selectAfastadosDC').val(0);
        $('#selectAfastadosDC').change();

        $('#selectAposentadosDC').val(0);
        $('#selectAposentadosDC').change();

        $("#txtObservacaoDC").val("");
    },
}

window.DadosCartaOfertaFunctions = {
    //Funcionalidades/Ajax/Alterações De Comportamento/Objeto
    initialize: function (callback) {
        openModalWait();
        window.DadosCartaOfertaFunctions.obterTextosImpressao(function () {
            window.DadosCartaOfertaFunctions.obterDadosCartaOferta(function () {
                callback && callback();
            });
        });
    },

    obterTextosImpressao: function (callback) {

        $.ajax({
            url: '/ObterTextosImpressao',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosCartaOfertaFunctions.popularCombosAfastadosAposentados(data);
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
                TipoImpressaoCodigo: 2, //1 Orçamento | 2 Carta Oferta
                TipoTextoCodigo: null // 2 Afastastados | 3 Aposentados | null Todos
            })
        })
    },

    obterDadosCartaOferta: function (callback) {

        $.ajax({
            url: '/impressao/ObterDadosImpressao',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosCartaOfertaFunctions.carregarDadosCartaOferta(data);
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

    salvarDadosCartaOferta: function (callback) {

        $.ajax({
            url: '/impressao/SalvarDadosImpressao',
            type: 'post',
            contentType: "application/json",
            success: function () {
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
                //TODO: Trocar a forma de pegar o número do cenário por variável que nem o va versão
                NumeroCenario: numeroCenarioSelecionadoDC,
                NumeroVersao: numeroVersaoSelecionadaDC,
                CodigoTipoImpressao: 2, //1 Orçamento | 2 Carta Oferta
                IndicadorPlanosAgrupados: indicadorPlanosAgrupados,
                CodigoTextoAfastados: parseInt($("#selectAfastadosDC").val()),
                CodigoTextoAposentados: parseInt($("#selectAposentadosDC").val()),
                TextoObservacao: $("#txtObservacaoDC").val(),
                DataManutencao: new Date(),
                UsuarioManutencao: ""  //Está atribuindo valor da Claims no controller
            })
        })
    },

    popularCombosAfastadosAposentados: function (data) {

        //TipoImpressaoCodigo - 2 = Carta Oferta
        //TextoCodigo - 2 = Afastados / 3 Aposentados
        $('#selectAfastadosDC').empty();
        $('#selectAfastadosDC').append('<option value="0">Selecione</option>');

        $('#selectAposentadosDC').empty();
        $('#selectAposentadosDC').append('<option value="0">Selecione</option>');

        for (var i = 0; i < data.length; i++) {
            if (data[i].tipoImpressaoCodigo == 2) {
                if (data[i].tipoTextoCodigo == 2) {
                    $('#selectAfastadosDC').append('<option value="' + data[i].textoCodigo + '">' + data[i].textoTitulo + '</option>');
                }

                if (data[i].tipoTextoCodigo == 3) {
                    $('#selectAposentadosDC').append('<option value="' + data[i].textoCodigo + '">' + data[i].textoTitulo + '</option>');
                }
            }
        }
    },

    carregarDadosCartaOferta: function (data) {
        var impressoes = [];

        for (var i = 0; i < data.impressoes.length; i++) {
            var impressao = new ImpressaoCartaOferta(
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

        dadosCartaOferta = new DadosCartaOferta(data.numeroCotacao, data.dataManutencao, data.usuarioManutencao, impressoes);

        var existeCartaOferta = dadosCartaOferta.impressoes.filter(function (impressaoFiltro) {
            return impressaoFiltro.codigoTipoImpressao == 2;
        }).length > 0;

        if (existeCartaOferta) {
            window.DadosCartaOfertaFunctions.remanejarListaImpressoes();

        }
    },

    remanejarListaImpressoes: function () {
        var impressaoCartaOferta = dadosCartaOferta.impressoes.filter(function (impressaoFiltro) {
            return impressaoFiltro.codigoTipoImpressao == 2;
        });

        var impressaoOrcamento = dadosCartaOferta.impressoes.filter(function (impressaoFiltro) {
            return impressaoFiltro.numeroCenario == impressaoCartaOferta[0].numeroCenario &&
                impressaoFiltro.numeroVersao == impressaoCartaOferta[0].numeroVersao &&
                impressaoFiltro.codigoTipoImpressao == 1;
        });

        var index = dadosCartaOferta.impressoes.indexOf(impressaoOrcamento[0]);
        if (index !== -1)
            dadosCartaOferta.impressoes.splice(index, 1);


    },

    validaSalvarDadosCartaOferta: function () {
        var validacao = true;

        if ($('#selectCenariosDadosCartaOferta').val() == "0") {

            $("#selectCenariosDadosCartaOferta").addClass("input-validation-error");
            notification("erro", "O campo Cenário de Condições Comerciais deve ser informado");
            validacao = false;
        }

        if ($('#selectVersaoDadosCartaOferta').val() == "0") {

            $("#selectVersaoDadosCartaOferta").addClass("input-validation-error");
            notification("erro", "O campo Versão do Cálculo deve ser informado");
            validacao = false;
        }

        if ($('#selectAfastadosDC').val() == "0") {

            $("#selectAfastadosDC").addClass("input-validation-error");
            notification("erro", "O campo Afastados deve ser informado");
            validacao = false;
        }

        if ($('#selectAposentadosDC').val() == "0") {

            $("#selectAposentadosDC").addClass("input-validation-error");
            notification("erro", "O campo Aposentados deve ser informado");
            validacao = false;
        }

        return validacao;
    }
}

window.DadosCartaOfertaEvents = {
    //OnCLick/OnChange/OnBlur/On's
    initialize: function (callback) {

    },

    onChangeCenario: function (cenario) {
        numeroCenarioSelecionadoDC = parseInt($(cenario).val());
        numeroVersaoSelecionadaDC = 0;

        window.DadosCartaOfertaUi.limparCampos();
        window.CenariosComissionamentoUi.limparCampos();

        window.DadosCartaOfertaUi.carregarVersoesDoCenario();
    },

    onChangeVersao: function (versao) {
        numeroVersaoSelecionadaDC = parseInt($(versao).val());
        //Verificar se precisa dar change
        window.DadosCartaOfertaUi.limparCampos();

        if (numeroVersaoSelecionadaDC == 0)
            return;

        window.DadosCartaOfertaUi.popularDadosCartaOferta();

        window.CenariosComissionamentoFunctions.initialize();
        window.CenariosComissionamentoUi.initialize();
    },
}

$(document).ready(function () {

});