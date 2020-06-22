var indiceCenarioSelecionadoCalculo = 0;
var indiceVersaoSelecionada = 0;
var produtoComercialAnaliseRisco;
var indiceLinhasTaxaResseguro = 0;

window.AnaliseDeRiscoUi = {

    initialize: function (callback) {
        indiceVersaoSelecionada = 0;
        indiceCenarioSelecionadoCalculo = 0;
        window.AnaliseDeRiscoUi.addMasks();
        window.AnaliseDeRiscoUi.preencheDadosDoCalculo();
        window.AnaliseDeRiscoUi.validaExbicaoSubSessaoCNAE();
        window.AnaliseDeRiscoUi.carregarCenarios();
        window.AnaliseDeRiscoUi.carregarVersoesDoCenario();
        window.AnaliseDeRiscoUi.preencherCamposDaVersao();
        window.AnaliseDeRiscoUi.preencherExcedenteTecnico();
        window.AnaliseDeRiscoUi.disableEnableCamposPorVersao();
        callback && callback();

    },

    addMasks: function () {

        $('.mask999').mask('999');

        $('.maskMoneyPercent2').maskMoney({
            precision: 2, decimal: ","
        });

        $('.maskMoneyPercent2Negative').maskMoney({
            precision: 2, decimal: ",", allowNegative: true
        });

        $('.maskMoneyPercent4').maskMoney({
            precision: 4, decimal: ","
        });
    },

    preencherCamposDaVersao: function () {
        $("#nomeVersao").val(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].nomeVersao);
        $("#selectTabuaMortalidade").val(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].codigoTipoTabelaTaxa);
        $("#selectTabuaMortalidade").trigger("change");
        $("#DescontoAgravoTecnico").val(helperFormatacao.formatarDecimal(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].percentualDescontoAgravoTecnico, 2));
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].valorLimiteRetencaoResseguro != 0) {
            $("#selectLimiteRetencao").val(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].valorLimiteRetencaoResseguro);
        }
        $("#selectLimiteRetencao").trigger("change");
        $("#TotalVidasVersao").val(helperFormatacao.formatarDecimal(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].quantidadeTotalVidas));

        for (var i = 0; i < cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.length; i++) {
            if (i != 0 && (typeof ($("#idadeMinimaResseguro_" + i) == "undefined"))) {
                window.AnaliseDeRiscoUi.InserirLinhaTaxaResseguro(i);
                indiceLinhasTaxaResseguro = + i;
            }
            if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].idadeMinima > 0)
                $("#idadeMinimaResseguro_" + i).val(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].idadeMinima);
            if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].idadeMaxima > 0)
                $("#idadeMaximaResseguro_" + i).val(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].idadeMaxima);
            if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].percentualTaxa > 0)
                $("#taxaPorMil_" + i).val(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].percentualTaxa);
        }
        $("#CapitalMedioCenario").val(helperFormatacao.formatarDecimal(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].valorCapitalMedio, 2, true));
    },

    carregarCenarios: function () {
        $("#cenariosAR > li").remove();
        cotacao.CenariosCotacao.forEach(function (cen) {
            cen.numeroCenario == 1 ?
                $("#cenariosAR").append("<li class='active'><a data-toggle='tab' href='#' id='liCen" + cen.numeroCenario + "AR'>Cen. " + cen.numeroCenario + "</a></li >") :
                $("#cenariosAR").append("<li><a data-toggle='tab' href='#' id='liCen" + cen.numeroCenario + "AR'>Cen. " + cen.numeroCenario + "</a></li >")

        });

        $('#cenariosAR a').unbind('shown.bs.tab');
        $('#cenariosAR a').on('shown.bs.tab', function (e) {
            window.AnaliseDeRiscoEvents.OnChangeCenario($(e.target).closest('li').index(), $(e.relatedTarget).closest('li').index());
        });
    },

    carregarVersoesDoCenario: function () {
        $('#selectVsCalculo').empty();
        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo.forEach(function (cenVer) {
            $('#selectVsCalculo').append('<option value="' + cenVer.numeroVersao + '">' + cenVer.numeroVersao + '</option>');
        });
    },

    InserirLinhaTaxaResseguro: function (i) {
        var templateIdades = $("#TaxaDeResseguroTemplate").render({ indice: i })
        $(templateIdades).insertBefore("#btnsTaxaResseguro")
    },

    RemoverLinhaTaxaResseguro: function (i) {
        $("#taxaDeResseguro_" + i).remove();

    },

    removerTodasLinhaTaxaResseguro: function () {
        if (indiceLinhasTaxaResseguro >= 1) {
            for (x = 1; x <= indiceLinhasTaxaResseguro; x++) {
                $("#taxaDeResseguro_" + x).remove();
            }
        }
        $("#idadeMinimaResseguro_0").val("");
        $("#idadeMaximaResseguro_0").val("");
        $("#taxaPorMil_0").val("");
        $("#taxaDeResseguro_0").show();
        indiceLinhasTaxaResseguro = 0;
    },

    LimparVersao: function () {
        $('#selectLimiteRetencao').empty();
        produtoComercialAnaliseRisco.limitesRetencaoResseguro.limitesRetencaoResseguro.forEach(function (limiteRetencao) {
            limiteRetencao.indicadorValorLimiteRetencaoPadrao == "S" ?
                $("#selectLimiteRetencao").append('<option selected  value="' + limiteRetencao.valorLimiteRetencao + '">' + limiteRetencao.valorLimiteRetencao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + '</option>') :
                $("#selectLimiteRetencao").append('<option value="' + limiteRetencao.valorLimiteRetencao + '">' + limiteRetencao.valorLimiteRetencao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + '</option>');
        });
        $('#selectTabuaMortalidade').empty();
        produtoComercialAnaliseRisco.tipoTabelaTaxa.tipoTabelaTaxa.forEach(function (tabelaTaxa) {
            tabelaTaxa.indicadorTabelaPadrao == "S" ?
                $("#selectTabuaMortalidade").append('<option selected value="' + tabelaTaxa.codigoTipoTabelaTaxa + '">' + tabelaTaxa.descricaoTipoTabelaTaxa + '</option>') :
                $("#selectTabuaMortalidade").append('<option value="' + tabelaTaxa.codigoTipoTabelaTaxa + '">' + tabelaTaxa.descricaoTipoTabelaTaxa + '</option>');
        });
        if ($('#selectVsCalculo').val() != 1) {
            $('#nomeVersao').val(null);
        }
        $("#DescontoAgravoTecnico").val(0);


        for (var i = $('[id*="taxaDeResseguro_"]').length - 1; i > 0; i--) {
            $("#taxaDeResseguro_" + i).remove();
        }
        $("#idadeMinimaResseguro_0").val("");
        $("#idadeMaximaResseguro_0").val("");
        $("#taxaPorMil_0").val("");
    },

    preencheDadosDoCalculo: function () {

        window.AnaliseDeRiscoUi.preencherCNAE();

        if (cotacao.PercentualDespesaAdministrativa == null) {
            $("#ProcentagemDACotacao").val(helperFormatacao.formatarDecimal(produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMaximoDespesasAdministrativas, 2));
            $("#ProcentagemDACotacao").change();
        } else {
            $("#ProcentagemDACotacao").val(helperFormatacao.formatarDecimal(cotacao.PercentualDespesaAdministrativa, 2));
        }
        produtoComercialAnaliseRisco.limitesRetencaoResseguro.limitesRetencaoResseguro.forEach(function (limiteRetencao) {
            limiteRetencao.indicadorValorLimiteRetencaoPadrao == "S" ?
                $("#selectLimiteRetencao").append('<option selected  value="' + limiteRetencao.valorLimiteRetencao + '">' + limiteRetencao.valorLimiteRetencao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + '</option>') :
                $("#selectLimiteRetencao").append('<option value="' + limiteRetencao.valorLimiteRetencao + '">' + limiteRetencao.valorLimiteRetencao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + '</option>');
        });
        $('#selectTabuaMortalidade').empty();
        produtoComercialAnaliseRisco.tipoTabelaTaxa.tipoTabelaTaxa.forEach(function (tabelaTaxa) {
            tabelaTaxa.indicadorTabelaPadrao == "S" ?
                $("#selectTabuaMortalidade").append('<option selected value="' + tabelaTaxa.codigoTipoTabelaTaxa + '">' + tabelaTaxa.descricaoTipoTabelaTaxa + '</option>') :
                $("#selectTabuaMortalidade").append('<option value="' + tabelaTaxa.codigoTipoTabelaTaxa + '">' + tabelaTaxa.descricaoTipoTabelaTaxa + '</option>');
        });
    },

    preencherExcedenteTecnico: function () {
        $("#PorcentagemDA").val(helperFormatacao.formatarDecimal(cotacao.ExcedenteTecnico.PercentualDespesaAdministrativa, 2));
        $("#PorcentagemIBNR").val(helperFormatacao.formatarDecimal(cotacao.ExcedenteTecnico.PercentualIBNR, 2));
        $("#PorcentagemDistribuicao").val(helperFormatacao.formatarDecimal(cotacao.ExcedenteTecnico.PercentualDistribuicaoEstipulante, 2));
        $("#MesesGatilho").val(cotacao.QuantidadeMesesGatilho);
    },

    validaExbicaoSubSessaoCNAE: function () {
        if ($("#rbEstipulanteFisica").prop("checked")) {
            $(".CNAE-hide").hide();
        } else {
            $(".CNAE-hide").show();
        }
    },

    preencherCNAE: function () {


        if (produtoComercialAnaliseRisco.restricoesCNAE.restricaoCodigoCNAE == true) {

            $("#prodCnaeOrcamentoTxt").text('Risco Excluído');
            $("#prodCnaeComparacao").text('Risco Excluído');
            $("#coenfDescAgravo").hide();

        } else {

            let percentualDescontoAgravo = cotacao.CoeficienteDescontoAgravoCnae ? helperFormatacao.formatarDecimal(cotacao.CoeficienteDescontoAgravoCnae, 4) : helperFormatacao.formatarDecimal(produtoComercialAnaliseRisco.descontoAgravoCNAE[0].percentualDescontoAgravo, 4);

            if (produtoComercialAnaliseRisco.descontoAgravoCNAE.length == 1) {

                $("#coenfDescAgravo").val(percentualDescontoAgravo);
                $("#divCnaeComp").hide();

            } else if (produtoComercialAnaliseRisco.descontoAgravoCNAE.length > 1) {

                $("#coenfDescAgravo").val(percentualDescontoAgravo);

                let percDescontoAgravoComp = helperFormatacao.formatarDecimal(produtoComercialAnaliseRisco.descontoAgravoCNAE[1].percentualDescontoAgravo, 4);
                let desc = produtoComercialAnaliseRisco.descontoAgravoCNAE[1].desc;

                $("#legendaProdComp").text(`Compare CNAE - ${desc}`);
                $("#prodCnaeComparacao").text(percDescontoAgravoComp);

                $("#divCnaeComp").show();
            }
        }
    },

    adicionarVersao: function (numeroDaVersao) {
        $('#selectVsCalculo').append('<option value="' + numeroDaVersao + '">' + numeroDaVersao + '</option>');
    },

    disableEnableCamposPorVersao: function () {

        let versao = $('#selectVsCalculo').val();

        if (versao == 1 || (cotacao.Status.Codigo >= 3 && cotacao.Status.Codigo != 15)) {
            $('#btnRemover').prop('disabled', true);
            $('#nomeVersao').prop('disabled', true);
        } else {
            $('#btnRemover').prop('disabled', false);
            $('#nomeVersao').prop('disabled', false);
        }

    },

    validaPreenchimentoCamposVersao: function () {
        if ($("#nomeVersao").val() == "") {
            $("#nomeVersao").addClass("input-validation-error");
            notification("erro", "", '');
        }
    },

    validaExportarRelatorio: function () {
        if ($("#selectVsCalculoRel").val() == "") {
            $("#selectVsCalculoRel").addClass("input-validation-error");
            notification("erro", "Versão do cálculo não selecionada!");
        }
        if ($("#selecPlanoRel").val() == "") {
            $("#selecPlanoRel").addClass("input-validation-error");
            notification("erro", "Número do plano do cálculo não selecionado!");
        }
    }

};
window.AnaliseDeRiscoFunctions = {

    initialize: function (callback) {
        window.AnaliseDeRiscoFunctions.analisarRiscoCenario(function () {
            callback && callback();
        });
        window.AnaliseDeRiscoFunctions.obterCapitalMedio();
        window.RelacoesVidaFunctions.atualizarTotaldeVidas();
    },

    calcularCenario: function () {
        $.ajax({
            url: '/calculo/CotacaoCenario',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                notification("sucesso", "Cálculo gerado com sucesso", "");
                cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].indicadorVersaoCalculada = true;
                window.RelatoriosAnaliseDeRiscoUi.adicionarVersaoNoDropdown(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].numeroVersao);
                window.CotacaoFunctions.atualizarObjetoCotacao();
                window.RelatoriosAnaliseDeRiscoUi.carregarCenarios();
                window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
                window.ControleDeAcessoCotacaoFunctions.validaExibicaoDasSessoesAbaAnaliseRisco();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                IdCotacao: cotacao._id,
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].numeroCenario,
                NumeroVersao: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].numeroVersao,
                NumeroPlano: null,
                CoeficienteDescontoAgravoCnae: cotacao.CoeficienteDescontoAgravoCnae,
                IndicadorRiscoExcluido: cotacao.IndicadorRiscoExcluido,
                PercentualDespesaAdministrativa: cotacao.PercentualDespesaAdministrativa,
                QuantidadeMesesGatilho: cotacao.QuantidadeMesesGatilho,
                ExcedenteTecnico: JSON.parse(JSON.stringify(cotacao.ExcedenteTecnico)),
                Versao: JSON.parse(JSON.stringify(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada]))
            })
        });
    },

    analisarRiscoCenario: function (callback) {
        $.ajax({
            url: '/calculo/AnaliseRisco',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                produtoComercialAnaliseRisco = data.value;
                callback && callback();
            },
            error: function (data) {

            },
            data: JSON.stringify({
                IdCotacao: cotacao._id,
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].numeroCenario,
                NumeroPlano: null,
                NumeroVersao: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].numeroVersao,
                CodigoProdutoComercial: parseInt(cotacao.ProdutoComercial.Codigo),
                DataReferencia: cotacao.DataReferencia,
                CodigoCNAE: cotacao.Itens[0].Estipulante.CodigoCNAE,
                CodigoOrgaoEmissor: cotacao.Filial.Codigo
            })
        });
    },

    exportarProjecaoFaturamento: function (callback) {
        $.ajax({
            url: '/relatorio/ProjecaoFaturamento',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                //TODO: Colocar as duas funções abaixo em um arquivo Helper
                if (data.fileContents != null) {
                    blob = converBase64toBlob(data.fileContents, data.contentType);
                    saveFile(blob, data.fileDownloadName);
                }
                else
                    notification("erro", "Relatório não disponível para exportação!");
            },
            error: function (data) {
                notification("erro", "Erro ao tentar exportar o arquivo!");
            },
            data: JSON.stringify({
                IdCotacao: cotacao._id,
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario,
                NumeroPlano: parseInt($('#selecPlanoRel').val()),
                NumeroVersao: parseInt($('#selectVsCalculoRel').val()),
                TipoRelatorio: 'ProjecaoFaturamento'
            })
        });
    },

    obterCapitalMedio: function (callback) {
        $.ajax({
            url: '/calculo/CapitalMedio',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                $("#CapitalMedioCenario").val(data.value.mediaCapitalSegurado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
                cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].valorCapitalMedio = data.value.mediaCapitalSegurado;
                callback && callback();
            },
            error: function (data) {

            },
            data: JSON.stringify({
                IdCotacao: cotacao._id,
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].numeroCenario,
                NumeroPlano: null,
                NumeroVersao: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].numeroVersao
            })
        });
    },

    salvarVersao: function (callback) {
        $.ajax({
            url: '/cenarios/SalvarVersao/',
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
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].numeroCenario,
                Versao: JSON.parse(JSON.stringify(window.AnaliseDeRiscoFunctions.getVersaoSalvar()))
            })
        });
    },


    getVersaoSalvar: function () {

        let taxas = cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro;

        let taxasResseguroLimpa = taxas.filter(function (taxa) {

            return taxa.idadeMinima != null &&
                taxa.idadeMaxima != null &&
                taxa.percentualTaxa != null;
        });

        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.splice(0, taxas.length, ...taxasResseguroLimpa);

        return cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada];
    },


    removerVersao: function (callback) {
        $.ajax({
            url: '/cenarios/ExcluirVersaoVidas/',
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
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].numeroCenario,
                NumeroVersao: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].numeroVersao
            })
        });
    },

    InserirLinhaTaxaResseguro: function () {
        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.push(new TaxasResseguro(null, null, null));
        indiceLinhasTaxaResseguro = indiceLinhasTaxaResseguro + 1;
    },

    RemoverLinhaTaxaResseguro: function (i) {
        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.splice(i, 1);
        indiceLinhasTaxaResseguro = indiceLinhasTaxaResseguro - 1;
    },

    alterarDACotacao: function (valor) {
        cotacao.PercentualDespesaAdministrativa = valor;
    },

    alterarMesesGatilho: function (valor) {
        cotacao.QuantidadeMesesGatilho = valor;
    },

    adicionarVersao: function (callback, numeroDaVersao) {
        var vidasPrimeiraVersao = cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[0].quantidadeTotalVidas;
        var valorCapitalMedioPrimeiraVersao = cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[0].valorCapitalMedio;

        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo.push(
            new VersaoCalculo(numeroDaVersao, "Versão" + numeroDaVersao, vidasPrimeiraVersao, null, 0, 0, valorCapitalMedioPrimeiraVersao, false, [new TaxasResseguro(null, null, null)], false)
        );

        callback && callback();
    },

    salvarNovaVersao: function (callback) {

        indiceVersaoSelecionada = cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo.findIndex(function (value) {
            return value.numeroVersao == $('#selectVsCalculo').val();
        });

        callback && callback();
    }

};
window.AnaliseDeRiscoEvents = {

    initialize: function (callback) {

    },

    OnClickInserirLinhaTaxaResseguro: function () {
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.length == 0) {
            cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.push(new TaxasResseguro(null, null, null));
        }
        if ($("#idadeMinimaResseguro_" + indiceLinhasTaxaResseguro).val() == "" ||
            $("#idadeMaximaResseguro_" + indiceLinhasTaxaResseguro).val() == "" ||
            $("#taxaPorMil_" + indiceLinhasTaxaResseguro).val() == "") {
            notification("erro", "Para inclusão da faixa é necessário o preenchimento de todos os campos.", "");

        }
        else {
            window.AnaliseDeRiscoFunctions.InserirLinhaTaxaResseguro();
            window.AnaliseDeRiscoUi.InserirLinhaTaxaResseguro(cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.length - 1);
            window.AnaliseDeRiscoUi.addMasks();
        }

    },

    OnClickRemoverLinhaTaxaResseguro: function () {
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.length > 0) {
            var i = 0;
            window.AnaliseDeRiscoUi.RemoverLinhaTaxaResseguro(indiceLinhasTaxaResseguro);
            window.AnaliseDeRiscoFunctions.RemoverLinhaTaxaResseguro(indiceLinhasTaxaResseguro);
        }
    },

    onClickNovaVersao: function () {
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo.length >= produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.quantidadeMaximaVersaoPorCenario) {
            notification("erro", "Quantidade total de versões de cálculo por cenário não deve ser maior que " + produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.quantidadeMaximaVersaoPorCenario + ".", "");
            return false;
        }
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].indicadorVersaoCalculada) {
            openModalWait();

            var numeroDaVersao = cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo.length - 1].numeroVersao + 1;
            window.AnaliseDeRiscoUi.adicionarVersao(numeroDaVersao);
            window.AnaliseDeRiscoFunctions.adicionarVersao(null, numeroDaVersao);
            $('#selectVsCalculo').val(numeroDaVersao).trigger('change');

            window.AnaliseDeRiscoFunctions.salvarNovaVersao(function () {

                window.AnaliseDeRiscoFunctions.salvarVersao();

            });


        } else {
            notification("erro", "A versão " + cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].numeroVersao + " do Cenário " + cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].numeroCenario + " não foi calculada. Calcule-a para criar uma nova versão.", "");
        }

    },

    onClickRemoverVersao: function () {
        if (confirm("Deseja realmente remover a versão?")) {
            openModalWait();
            window.AnaliseDeRiscoFunctions.removerVersao(function () {
                notification("sucesso", "Versão excluída com sucesso.", "");
                cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo.splice(indiceVersaoSelecionada, 1);
                indiceVersaoSelecionada = 0;
                window.AnaliseDeRiscoUi.removerTodasLinhaTaxaResseguro();
                window.AnaliseDeRiscoUi.carregarVersoesDoCenario();
                window.AnaliseDeRiscoUi.preencherCamposDaVersao();
                window.AnaliseDeRiscoUi.disableEnableCamposPorVersao();
                window.RelatoriosAnaliseDeRiscoUi.carregarVersoes();
            });
        }
    },

    onClickLimparVersao: function () {
        window.AnaliseDeRiscoUi.LimparVersao();
    },

    OnChangeCenario: function (indexAbaAtual, indexAbaAnterior) {
        openModalWait();

        indiceCenarioSelecionadoCalculo = indexAbaAnterior;

        window.AnaliseDeRiscoFunctions.salvarVersao(function () {
            indiceCenarioSelecionadoCalculo = indexAbaAtual;
            indiceVersaoSelecionada = 0;
            window.AnaliseDeRiscoUi.removerTodasLinhaTaxaResseguro();
            window.AnaliseDeRiscoUi.carregarVersoesDoCenario();
            window.AnaliseDeRiscoFunctions.obterCapitalMedio(function () {
                window.AnaliseDeRiscoUi.preencherCamposDaVersao();
            });
            window.AnaliseDeRiscoUi.disableEnableCamposPorVersao();
        });
    },

    OnChangeVersao: function (versao) {
        openModalWait();
        window.AnaliseDeRiscoFunctions.salvarVersao(function () {
            indiceVersaoSelecionada = cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo.findIndex(function (value) {
                return value.numeroVersao == $(versao).val();
            });
            window.AnaliseDeRiscoUi.removerTodasLinhaTaxaResseguro();
            window.AnaliseDeRiscoUi.preencherCamposDaVersao();
            window.AnaliseDeRiscoUi.disableEnableCamposPorVersao();
        });
    },

    onClickCalcularCenario: function () {
        window.AnaliseDeRiscoUi.validaPreenchimentoCamposVersao();
        if ($(".input-validation-error").length > 0) {
            $('html, body').animate({
                scrollTop: $(".input-validation-error").offset().top - 240
            }, 500);
        } else {
            openModalWait();
            for (i = 0; i < cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.length; i++) {
                if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].idadeMaxima == null &&
                    cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].idadeMinima == null &&
                    cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].percentualTaxa == null)
                    cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.splice(i, 1);
            }
            window.AnaliseDeRiscoFunctions.calcularCenario();
        }
    },

    OnChangeCoeficienteAgravo: function (campo) {

        let valor = convertePorcentagemParaDecimal($(campo).val());
        cotacao.CoeficienteDescontoAgravoCnae = valor;
    },

    //ProcentagemDACotacao
    OnChangePorcentagemDACotacao: function (campo) {

        var valor = $(campo).maskMoney('unmasked')[0];
        var valorMaximo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMaximoDespesasAdministrativas;
        var valorMinimo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMinimoDespesasAdministrativas;

        if (valor) {
            if (valor > valorMaximo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado de DA Cotação, ultrapassa o limite máximo de ' + helperFormatacao.formatarDecimal(valorMaximo, 2) + ' do produto.', '');
            }
            else if (valor < valorMinimo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado de DA Cotação, ultrapassa o limite mínimo de ' + helperFormatacao.formatarDecimal(valorMinimo, 2) + ' do produto.', '');
            }
            else {
                $(campo).removeClass("input-validation-error");
                window.AnaliseDeRiscoFunctions.alterarDACotacao(valor);
            }
        }
        else {
            $(campo).addClass("input-validation-error");
            notification('erro', 'O campo DA Cotação é de preenchimento obrigatório.', '');
        }
    },

    //PorcentagemDA
    OnChangePorcentagemDA: function (campo) {

        var valor = $(campo).maskMoney('unmasked')[0];
        var valorMaximo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMaximoDespesaAdministrativaExcedenteTecnico;
        var valorMinimo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMinimoDespesaAdministrativaExcedenteTecnico;

        if (valor) {
            if (valor > valorMaximo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado do Excedente Técnico (DA), ultrapassa o limite máximo de ' + helperFormatacao.formatarDecimal(valorMaximo, 2) + ' do produto.', '');
            }
            else if (valor < valorMinimo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado do Excedente Técnico (DA), ultrapassa o limite mínimo de ' + helperFormatacao.formatarDecimal(valorMinimo, 2) + ' do produto.', '');
            }
            else {
                $(campo).removeClass("input-validation-error");
                cotacao.ExcedenteTecnico.PercentualDespesaAdministrativa = valor;
            }
        }
        else
            $(campo).removeClass("input-validation-error");
    },

    //PorcentagemIBNR
    OnChangePorcentagemIBNR: function (campo) {

        var valor = $(campo).maskMoney('unmasked')[0];
        var valorMaximo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMaximoIBNRExcedenteTecnico;
        var valorMinimo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMinimoIBNRExcedenteTecnico;

        if (valor) {
            if (valor > valorMaximo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado do Excedente Técnico (IBNR), ultrapassa o limite máximo de ' + helperFormatacao.formatarDecimal(valorMaximo, 2) + ' do produto.', '');
            }
            else if (valor < valorMinimo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado do Excedente Técnico (IBNR), ultrapassa o limite mínimo de ' + helperFormatacao.formatarDecimal(valorMinimo, 2) + ' do produto.', '');
            }
            else {
                $(campo).removeClass("input-validation-error");
                cotacao.ExcedenteTecnico.PercentualIBNR = valor;
            }
        }
        else
            $(campo).removeClass("input-validation-error");
    },

    //PorcentagemDistribuicao
    OnChangePorcentagemDistribuicao: function (campo) {

        var valor = $(campo).maskMoney('unmasked')[0];
        var valorMaximo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMaximoDistribuicaoEstipulanteExcedenteTecnico;
        var valorMinimo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMinimoDistribuicaoEstipulanteExcedenteTecnico;

        if (valor) {
            if (valor > valorMaximo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado do Excedente Técnico (Distribuição), ultrapassa o limite máximo de ' + helperFormatacao.formatarDecimal(valorMaximo, 2) + ' do produto.', '');
            }
            else if (valor < valorMinimo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado do Excedente Técnico (Distribuição), ultrapassa o limite mínimo de ' + helperFormatacao.formatarDecimal(valorMinimo, 2) + ' do produto.', '');
            }
            else {
                $(campo).removeClass("input-validation-error");
                cotacao.ExcedenteTecnico.PercentualDistribuicaoEstipulante = valor;
            }
        }
        else
            $(campo).removeClass("input-validation-error");
    },

    //MesesGatilho
    OnChangeMeses: function (campo) {

        var valor = parseInt($(campo).val());
        var valorMaximo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.quantidadeMaximaMesGatilho;
        var valorMinimo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.quantidadeMinimaMesGatilho;

        if (valor) {
            if (valor > valorMaximo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado do Gatilho (Meses), ultrapassa o limite máximo de ' + valorMaximo + ' do produto.', '');
            }
            else if (valor < valorMinimo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado do Gatilho (Meses), ultrapassa o limite mínimo de ' + valorMinimo + ' do produto.', '');
            }
            else {
                $(campo).removeClass("input-validation-error");
                window.AnaliseDeRiscoFunctions.alterarMesesGatilho(valor);
            }
        }
        else
            $(campo).removeClass("input-validation-error");
    },

    //Desconto/Agravo Técnico
    OnChangeDescontoAgravoTecnico: function (campo) {

        if ($(campo).val().length == 0) {
            $(campo).val("0,00");
        }

        var valor = parseInt($(campo).val());
        var valorMaximo = produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.percentualMaximoDescontoTecnico * -1;

        if (valor) {
            if (valor < valorMaximo) {
                $(campo).addClass("input-validation-error");
                notification('erro', 'Valor informado do Desconto Técnico ultrapassa o limite máximo de ' + helperFormatacao.formatarDecimal(valorMaximo, 2) + ' do produto.', '');
            }
            else {
                $(campo).removeClass("input-validation-error");
                cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].percentualDescontoAgravoTecnico = valor;
            }
        }
        else
            $(campo).removeClass("input-validation-error");
    },

    OnChangeNomeVersao: function (campo) {
        if (!$(campo).val()) {
            $(campo).removeClass("input-validation-error");
        } else {
            $(campo).addClass("input-validation-error");
        }

        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].nomeVersao = $(campo).val();
    },

    OnChangeTabuaDeMortalidade: function (campo) {

        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].codigoTipoTabelaTaxa = $(campo).val();
        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].descricaoTipoTabelaTaxa = $("#" + campo.id + " option:selected").html();

    },

    OnChangeLimiteDeRetencao: function (campo) {

        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].valorLimiteRetencaoResseguro = parseInt($(campo).val());
    },

    OnChangeNomeVersao: function (campo) {
        if ($(campo).val()) {
            $(campo).removeClass("input-validation-error");
        } else {
            $(campo).addClass("input-validation-error");
        }

        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].nomeVersao = $(campo).val();
    },

    onClickAbrirRelacaoDeVidasPopUp: function () {

        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo] != undefined &&
            cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada] != undefined) {
            $('#modalRelacaoVidas').modal('show');
        }
        else
            alert("Calculo não disponível! Não foi possível abrir a relação de vidas.");
    },

    onChangeIdadeMinima: function (campo, i) {
        var idade = parseInt($(campo).val());
        var idadeFinal = $("#idadeMaximaResseguro_" + i).val();

        if ($(campo).val()) {
            $(campo).removeClass("input-validation-error");

            if (idade < produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.idadeMinimoContrato ||
                idade > produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.idadeMaximoContrato) {
                $(campo).addClass("input-validation-error");
                notification("erro", "O limite de idade permitido é mínimo " + produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.idadeMinimoContrato + " e máximo " + produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.idadeMaximoContrato + ".", "");
            } else if (idadeFinal != "" && idade > idadeFinal) {
                $(campo).addClass("input-validation-error");
                notification("erro", "A Idade mínima não pode ser maior que a idade máxima.", "");
            } else {
                for (let j = 0; j < i; j++) {
                    if (j != i) {
                        if (idade >= parseInt($("#idadeMinimaResseguro_" + j).val()) && idade <= parseInt($("#idadeMaximaResseguro_" + j).val())) {
                            $(campo).addClass("input-validation-error");
                            invalido = 1;
                            notification("erro", "Faixa de idade já cadastrada.", "#" + $(this).attr("id"));
                            break;
                        }
                    }
                }
            }
        } else {
            $(campo).addClass("input-validation-error");
        }
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.length == 0)
            cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.push(new TaxasResseguro(0, 0, 0));
        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].idadeMinima = parseInt($(campo).val());
    },

    onChangeIdadeMaxima: function (campo, i) {
        var idade = parseInt($(campo).val());
        var idadeInicial = $("#idadeMinimaResseguro_" + i).val();

        if ($(campo).val()) {
            $(campo).removeClass("input-validation-error");

            if (idade < produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.idadeMinimoContrato ||
                idade > produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.idadeMaximoContrato) {
                $(campo).addClass("input-validation-error");
                notification("erro", "O limite de idade permitido é mínimo " + produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.idadeMinimoContrato + " e máximo " + produtoComercialAnaliseRisco.produtoComercialVida.produtoComercialVida.idadeMaximoContrato + ".", "");
            } else if (idadeInicial != "" && idade < idadeInicial) {
                $(campo).addClass("input-validation-error");
                notification("erro", "A Idade maxima não pode ser menor que a idade mínima.", "");
            } else {
                for (let j = 0; j < i; j++) {
                    if (j != i) {
                        if (idade >= parseInt($("#idadeMinimaResseguro_" + j).val()) && idade <= parseInt($("#idadeMaximaResseguro_" + j).val())) {
                            $(campo).addClass("input-validation-error");
                            invalido = 1;
                            notification("erro", "Faixa de idade já cadastrada.", "#" + $(this).attr("id"));
                            break;
                        }
                    }
                }
            }
        } else {
            $(campo).addClass("input-validation-error");
        }
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.length == 0)
            cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.push(new TaxasResseguro(0, 0, 0));
        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].idadeMaxima = parseInt($(campo).val());
    },

    onChangeIdadeTaxaPorMil: function (campo, i) {
        if ($(campo).val()) {
            $(campo).removeClass("input-validation-error");
        } else {
            $(campo).addClass("input-validation-error");
        }
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.length == 0)
            cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro.push(new TaxasResseguro(0, 0, 0));
        cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].taxasResseguro[i].percentualTaxa = $(campo).maskMoney('unmasked')[0];
    },

    onClickExportarProjecaoFaturamento: function () {
        window.AnaliseDeRiscoUi.validaExportarRelatorio();
        if ($(".input-validation-error").length > 0) {
            $('html, body').animate({
                scrollTop: $(".input-validation-error").offset().top - 240
            }, 500);
        } else {
            window.AnaliseDeRiscoFunctions.exportarProjecaoFaturamento();
        }
    },

}