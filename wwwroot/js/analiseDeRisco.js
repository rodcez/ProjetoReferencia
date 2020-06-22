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
var indiceCenarioSelecionadoRelatorios = 0;
var indiceVersaoSelecionadaRelatorios = 0;
let maiorIdadeRT = 0;
let maiorCapitalRT = 0;
window.RelatoriosAnaliseDeRiscoUi = {

    initialize: function () {
        indiceCenarioSelecionadoRelatorios = 0;
        indiceVersaoSelecionadaRelatorios = 0;
        window.RelatoriosAnaliseDeRiscoUi.carregarCenarios();
        window.RelatoriosAnaliseDeRiscoUi.carregarVersoes();
        window.RelatoriosAnaliseDeRiscoUi.carregarPlanos();
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo[0].indicadorVersaoCalculada) {
            window.RelatoriosAnaliseDeRiscoFunctions.obterResumoTecnico();
            window.RelatoriosAnaliseDeRiscoFunctions.ObterProjecaoFaturamento();
            window.RelatoriosAnaliseDeRiscoFunctions.obterFreecover();
        }
    },

    rederizarResumoTecnico: function (resumoTecnico) {

        var helper = {
            formatarDecimal: window.helperFormatacao.formatarDecimal
        };

        var htmlBasicas = $("#templateCoberturas").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "basica";
        }), helper);
        $('#coberturasBasicas').html(htmlBasicas);

        var htmlAdicionais = $("#templateCoberturas").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "adicional";
        }), helper);
        $('#coberturasAdicionais').html(htmlAdicionais);

        var htmlFuneral = $("#templateCoberturas").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "funeral";
        }), helper);
        $('#coberturasFuneral').html(htmlFuneral);

        var htmlDiarias = $("#templateCoberturas").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "diaria";
        }), helper);
        $('#coberturasDiarias').html(htmlDiarias);

        var htmlServico = $("#templateServicos").render(resumoTecnico.coberturas.filter(function (c) {
            return c.grupoExibicaoCobertura === "servico";
        }), helper);
        $('#servicos').html(htmlServico);

        $('#taxaPuraTotal').text(helperFormatacao.formatarDecimal(resumoTecnico.coeficienteTaxaPonderadaLibertyFinal, 4));
        $('#taxaResseguroTotal').text(helperFormatacao.formatarDecimal(resumoTecnico.coeficienteTaxaPonderadaResseguroFinal, 4));
        $('#taxaComercialTotal').text(helperFormatacao.formatarDecimal(resumoTecnico.coeficienteTaxaPonderadaComercialFinalCoberturas, 4));
        $('#custoTotalServicos').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoComercialAssistencias, 2, true));
        $('#taxaComercialTotalServicos').text(helperFormatacao.formatarDecimal(resumoTecnico.coeficienteTaxaPonderadaComercialFinal, 4));

        //premio
        $('#PremioComercialLibertySemIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoComercialLiberty, 2, true));
        $('#PremioComercialResseguroSemIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoComercialResseguro, 2, true));
        $('#PremioComercialAssistenciasSemIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoComercialAssistencias, 2, true));
        $('#PremioComercialTotalSemIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorTotalPremioLiquidoComercial, 2, true));
        $('#PremioPuroAnualRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoAnual, 2, true));
        $('#PremioMedioIndividualRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorPremioLiquidoMedioIndividual, 2, true));
        $('#PremioTotalComIOFRT').text(helperFormatacao.formatarDecimal(resumoTecnico.premio.valorTotalPremioComercial, 2, true));

        //carregamentos
        $('#ComissaoRT').text(helperFormatacao.formatarDecimal(parseFloat(cotacao.TotaisComissionamento.TotalPercentualCorretagem), 2));
        $('#ProLaboreRT').text(helperFormatacao.formatarDecimal(parseFloat(cotacao.TotaisComissionamento.TotalPercentualProLabore), 2));
        $('#AgenciamentoRT').text(helperFormatacao.formatarDecimal(parseFloat(cotacao.TotaisComissionamento.TotalPercentualAgenciamento), 2));
        $('#DART').text(helperFormatacao.formatarDecimal(cotacao.PercentualDespesaAdministrativa, 2));

        //Tábua de Mortalidade / Descontos
        $('#TabuaMortalidadeRT').text(resumoTecnico.tabuaMortalidadeEDescontos.descricaoTabuaMortalidade);
        $('#descontoAgravoTecnicoRT').text(helperFormatacao.formatarDecimal(resumoTecnico.tabuaMortalidadeEDescontos.percentualDescontoAgravoTecnico, 2) + "%");
        resumoTecnico.tabuaMortalidadeEDescontos.indicadorDescontoAgravoResseguro ? $('#descontoAgravoResseguroRT').text("Sim") : $('#descontoAgravoResseguroRT').text("Não");

        //GrupoAnalisado
        $('#quantidadeVidasGrupoRT').text(resumoTecnico.grupoAnalisado.quantidadeTotalVidas);
        $('#quantidadeVidasResseguradasRT').text(resumoTecnico.grupoAnalisado.quantidadeVidasResseguradas);
        $('#idadeMediaRT').text(resumoTecnico.grupoAnalisado.idadeMedia);
        $('#idadeMediaAtuarialRT').text(resumoTecnico.grupoAnalisado.idadeMediaAtuarial);
        $('#idadeMaximaRT').text(resumoTecnico.grupoAnalisado.idadeMaxima);
        $('#porcentagemGeneroFemininoRT').text(resumoTecnico.grupoAnalisado.percentualVidasGeneroFeminino);
        $('#porcentagemGeneroMasculinoRT').text(resumoTecnico.grupoAnalisado.percentualVidasGeneroMasculino);
        $('#quantidadeAfastadosRT').text(resumoTecnico.grupoAnalisado.quantidadeTotalVidasAfastadas);
        $('#quantidadeVidasAcimaRT').text(resumoTecnico.grupoAnalisado.quantidadeVidasForaDoLimiteDeIdade);

        //capitais
        $('#modalidadeRT').text(resumoTecnico.capitais.tipoModalidadeCapital);
        $('#limiteRetencaoLibertyRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorLimiteRetencaoLiberty, 2, true));
        $('#totalCapitalRetidoLibertyRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorTotalCapitalRetidoLiberty, 2, true));
        $('#totalCapitalRetidoResseguroRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorTotalCapitalRetidoResseguro, 2, true));
        $('#totalCapitalLibertyResseguroRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorTotalCapitalRetido, 2, true));
        $('#capitalMinimoRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorCapitalMinimo, 2, true));
        $('#capitalMaximoRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorCapitalMaximo, 2, true));
        $('#capitalMedioRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorCapitalMedio, 2, true));
        $('#capitalSeguradoMaisVelhoRT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorCapitalMaiorIdade, 2, true));
        $('#capitalMedioConcentracaoRT').text(resumoTecnico.capitais.valorCapitalMedioConcentracaoGrupo + "%");
        $('#TotalCapitalResseguradoVidasAcima70RT').text(helperFormatacao.formatarDecimal(resumoTecnico.capitais.valorTotalCapitalResseguradoForaLimiteIdade, 2, true));
        $('#paridadeRT').text(resumoTecnico.capitais.numeroParidade);

        //sinistro
        $('#expectativaRT').text(helperFormatacao.formatarDecimal(resumoTecnico.expectativaSinistro.percentualExpectativa, 2));
        $('#sinistroPorMilRT').text(helperFormatacao.formatarDecimal(resumoTecnico.expectativaSinistro.percentualSinistroPorMil, 2));
        $('#anosDeRecuperacaoRT').text(parseInt(resumoTecnico.expectativaSinistro.quantidadeAnosRecuperacao));

    },

    renderizarFreecover: function (freecover) {
        $("#ISAcimaLimiteIdadeFreecover").text(helperFormatacao.formatarDecimal(freecover.aceitacaoGrupo.valorCapitalAcimaIdadeFreeCover, 2, true));
        $("#LimiteMaximoAbrangenciaFreecover").text(helperFormatacao.formatarDecimal(freecover.aceitacaoGrupo.valorLimiteMaximoAbrangenciaFreeCover, 2, true));
        $("#SomaMediaSeguradaFreecover").text(helperFormatacao.formatarDecimal(freecover.aceitacaoGrupo.valorSomaMediaSegurada, 2, true));
        $("#LimiteFreecover").text(helperFormatacao.formatarDecimal(freecover.aceitacaoGrupo.valorLimiteFreeCover, 2, true));
        $("#PorcentagemGrupoFreecover").text(freecover.aceitacaoGrupo.percentualGrupo);

        if (!freecover.indicadorLimiteGrupoUltrapassado) {
            $("#FreecoverFcl").addClass('glyphicon glyphicon-ok');
            $("#FreecoverFcl").css("color", "green");
        } else {
            $("#FreecoverFcl").addClass('glyphicon glyphicon-remove');
            $("#FreecoverFcl").css("color", "red");
        }



    },

    carregarCenarios: function () {
        //TODO: validar qual cenario foi o ultimo a ser calculado
        $("#cenariosRel > li").remove();
        cotacao.CenariosCotacao.forEach(function (cen) {
            if (cen.versoesCalculo.some(function (c) {
                return c.indicadorVersaoCalculada == true
            })) {
                cen.numeroCenario === 1 ?
                    $("#cenariosRel").append("<li class='active'><a data-toggle='tab' href='#' id='liCen" + cen.numeroCenario + "AR'>Cen. " + cen.numeroCenario + "</a></li >") :
                    $("#cenariosRel").append("<li><a data-toggle='tab' href='#' id='liCen" + cen.numeroCenario + "AR'>Cen. " + cen.numeroCenario + "</a></li >")
            }
        });

        $('#cenariosRel a').unbind('shown.bs.tab');
        $('#cenariosRel a').on('shown.bs.tab', function (e) {
            window.RelatoriosAnaliseDeRiscoEvents.onChangeCenario($(e.target).closest('li').index(), $(e.relatedTarget).closest('li').index());
        });
    },

    carregarVersoes: function () {
        $('#selectVsCalculoRel').empty();
        //TODO: Primeiro impelmentar a melhoria do selecione antes de colocar -1 no combo
        //$('#selectVsCalculoRel').append('<option value="-1">Selecione</option>');
        cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo.forEach(function (v) {
            if (v.indicadorVersaoCalculada)
                $('#selectVsCalculoRel').append('<option value="' + v.numeroVersao + '">' + v.numeroVersao + '</option>');
        });
    },

    adicionarVersaoNoDropdown: function (numeroVersao) {
        var necessarioAdicionar = true;
        $("#selectVsCalculoRel option").each(function () {
            if ($(this).val() == numeroVersao)
                necessarioAdicionar = false;
        });

        if (necessarioAdicionar) {
            $('#selectVsCalculoRel').append('<option value="' + numeroVersao + '">' + numeroVersao + '</option>');
            $('#selectVsCalculoRel').change();
        }

    },

    carregarPlanos: function () {
        $('#selecPlanoRel').empty();
        //TODO: Primeiro impelmentar a melhoria do selecione antes de colocar -1 no combo
        //$('#selecPlanoRel').append('<option value="-1">Selecione</option>');

        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].indicadorPlanoMesmaCobertura && cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].planosCondicoesComerciais.length > 1) {
            $('#selecPlanoRel').append('<option value="0">TODOS OS PLANOS</option>');
        }
        cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].planosCondicoesComerciais.forEach(function (p) {
            $('#selecPlanoRel').append('<option value="' + p.numeroPlano + '">' + p.nomePlano + '</option>');
        });
    },
};
window.RelatoriosAnaliseDeRiscoFunctions = {

    obterResumoTecnico: function () {
        $.ajax({
            url: '/calculo/ObterResumoTecnico',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                window.RelatoriosAnaliseDeRiscoUi.rederizarResumoTecnico(data.value);
                maiorIdadeRT = data.value.grupoAnalisado.idadeMaxima;
                maiorCapitalRT = data.value.capitais.valorCapitalMaximo;
                closeModalWait();
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
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario,
                NumeroVersao: parseInt($('#selectVsCalculoRel').val()),
                NumeroPlano: parseInt($('#selecPlanoRel').val())
            })
        });
    },

    obterFreecover: function () {
        $.ajax({
            url: '/calculo/ObterFreecover',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                window.RelatoriosAnaliseDeRiscoUi.renderizarFreecover(data.value);
                closeModalWait();
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
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario,
                NumeroVersao: parseInt($('#selectVsCalculoRel').val()),
                NumeroPlano: parseInt($('#selecPlanoRel').val())
            })
        });
    },

    ValidarDistribuicaoCapitalIntervaloCapitais: function () {
        //Se não foi preenchido obter o intervalo do produto comercial (Motor de Calculo)
        if ($('#txtDCIntervaloCapitais').val() !== "" && parseFloat($('#txtDCCapitalMaximo').maskMoney('unmasked')[0]) > 0) {
            var intervaloCapital = parseFloat($('#txtDCIntervaloCapitais').maskMoney('unmasked')[0]);
            var intervaloMinimoPermitido = 0.01;

            if (intervaloCapital < intervaloMinimoPermitido || intervaloCapital > maiorCapitalRT) {
                notification("erro", "O Intervalo de Capitais deve ser maior que 0 e menor ou igual que o valor do Maior Capital informado de " + maiorCapitalRT.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'txtDCIntervaloCapitais');
                return false;
            }
        }
        $('#txtDCIntervaloCapitais').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalIntervaloIdade: function () {
        //Se não foi preenchido obter o intervalo do produto comercial (Motor de Calculo)
        if ($('#txtDCIntervaloIdade').val() !== "" && $('#txtDCIdadeMaxima').val() !== "") {
            var intervaloIdade = parseInt($('#txtDCIntervaloIdade').val());
            var intervaloMinimoPermitido = 1;

            if (intervaloIdade < intervaloMinimoPermitido || intervaloIdade > maiorIdadeRT) {
                notification("erro", "O Intervalo de Faixa de Idade deve ser maior que 0 e menor que a Idade Máxima informada de " + maiorIdadeRT, 'txtDCIntervaloIdade');
                return false;
            }
        }
        $('#txtDCIntervaloIdade').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalMenorCapital: function () {
        var valorCapitalMinimo = $('#txtDCCapitalMinimo').val() === "" ? 0 : parseFloat($('#txtDCCapitalMinimo').maskMoney('unmasked')[0]);
        var valorMinimoPermitido = 0;
        var valorCapitalMaximo = parseFloat($('#txtDCCapitalMaximo').maskMoney('unmasked')[0]);

        if (valorCapitalMinimo < valorMinimoPermitido || valorCapitalMinimo > valorCapitalMaximo) {
            notification("erro", "O valor do Menor Capital deve ser menor ou igual que o valor do Maior Capital informado.", 'txtDCCapitalMinimo');
            return false;
        }
        $('#txtDCCapitalMinimo').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalIdadeMinima: function () {
        var valorIdadeMinima = $('#txtDCIdadeMinima').val() === "" ? 0 : parseInt($('#txtDCIdadeMinima').val());
        var valorMinimoPermitido = 0;
        var valorIdadeMaxima = parseInt($('#txtDCIdadeMaxima').val());

        if (valorIdadeMinima < valorMinimoPermitido || valorIdadeMinima > valorIdadeMaxima) {
            notification("erro", "O campo Idade Mínima deve ser menor ou igual ao valor do campo Idade máxima.", 'txtDCIdadeMinima');
            return false;
        }
        $('#txtDCIdadeMinima').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalMaiorCapital: function () {
        if ($('#txtDCCapitalMaximo').val() === "" && $('#txtDCIntervaloCapitais').val() !== "") {
            notification("erro", "O valor do Maior Capital deve ser informado.", 'txtDCCapitalMaximo');
            return false;
        }
        else if ($('#txtDCCapitalMaximo').val() !== "") {
            var valorCapitalMaximo = parseFloat($('#txtDCCapitalMaximo').maskMoney('unmasked')[0]);
            var valorCapitalMinimo = parseFloat($('#txtDCCapitalMinimo').maskMoney('unmasked')[0]);

            if (valorCapitalMaximo < valorCapitalMinimo) {
                notification("erro", "O valor do Maior Capital deve ser maior ou igual que o valor do Menor Capital informado.", 'txtDCCapitalMaximo');
                return false;
            }
        }
        $('#txtDCCapitalMaximo').removeClass("input-validation-error");
        return true;
    },

    ValidarDistribuicaoCapitalIdadeMaxima: function () {
        if ($('#txtDCIdadeMaxima').val() === "" && parseInt($('#txtDCIntervaloIdade').val()) > 0) {
            notification("erro", "A Idade Máxima deve ser informada.", 'txtDCIdadeMaxima');
            return false;
        }
        else if ($('#txtDCIdadeMaxima').val() !== "") {
            var valorIdadeMaxima = parseInt($('#txtDCIdadeMaxima').val());
            var valorIdadeMinima = parseInt($('#txtDCIdadeMinima').val());

            if (valorIdadeMaxima < valorIdadeMinima) {
                notification("erro", "A Idade Máxima deve ser maior ou igual ao valor Idade Mínima informada.", 'txtDCIdadeMaxima');
                return false;
            }
        }
        $('#txtDCIdadeMaxima').removeClass("input-validation-error");
        return true;
    },

    CalcularDistribuicaocapital: function (codigoProdutoComercial,
        dataReferencia,
        numeroCotacao,
        numeroCenario,
        numeroVersao,
        numeroPlano,
        intervaloCapital,
        menorCapital,
        maiorCapital,
        intervaloFaixaIdade,
        idadeMinima,
        idadeMaxima) {
        $.ajax({
            url: '/calculo/DistribuicaoCapital/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                if (data.value.mensagem !== null && data.value.mensagem !== "") {
                    notification("erro", data.value.mensagem, '');
                }
                else {
                    notification("sucesso", "Relatório atualizado com sucesso!", "");
                }
            },
            error: function (data) {
                closeModalWait();
                if (data.value.mensagem !== null && data.value.mensagem !== "") {
                    notification("erro", data.value.mensagem, '');
                }
                var errors = JSON.parse(data.messages);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                CodigoProdutoComercial: codigoProdutoComercial,
                DataReferencia: dataReferencia,
                NumeroCotacao: numeroCotacao,
                NumeroCenario: numeroCenario,
                NumeroVersao: numeroVersao,
                NumeroPlano: numeroPlano,
                IntervaloCapital: intervaloCapital,
                MenorCapital: menorCapital,
                MaiorCapital: maiorCapital,
                IntervaloFaixaIdade: intervaloFaixaIdade,
                IdadeMinima: idadeMinima,
                IdadeMaxima: idadeMaxima
            })
        });
    },

    ObterProjecaoFaturamento: function () {
        $.ajax({
            url: '/calculo/ObterProjecaoFaturamento/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                window.RelatoriosAnaliseDeRiscoFunctions.CarregarProjecaoFaturamento(data);
            },
            error: function (data) {
                if (data.messages != undefined) {
                    var errors = JSON.parse(data.messages);
                    for (var i = 0; i < errors.length; i++) {
                        notification("erro", errors[i], '');
                    }
                }
            },
            data: JSON.stringify({
                NumeroCotacao: parseInt(cotacao._id),
                NumeroCenario: parseInt(cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario),
                NumeroVersao: parseInt(cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo[indiceVersaoSelecionadaRelatorios].numeroVersao),
                NumeroPlano: parseInt($('#selecPlanoRel').val())
            })
        });
    },

    CarregarProjecaoFaturamento: function (data) {

        if (data.value != undefined) {

            $('#spValorPremioPF').html(data.value.valorTotal.valorPremioEmitido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorAsssitenciasPF').html(data.value.valorTotal.valorPremioAssitencias.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorResseguroPF').html(data.value.valorTotal.valorPremioResseguro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorCosseguroPF').html(data.value.valorTotal.valorPremioCosseguro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorPremioGanhoPF').html(data.value.valorTotal.valorPremioGanho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorComissaoPF').html(data.value.valorTotal.valorComissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorProLaborePF').html(data.value.valorTotal.valorProLabore.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorAgenciamentoPF').html(data.value.valorTotal.valorAgenciamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorDespAdmPF').html(data.value.valorTotal.valorDespesasAdministrativas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorSinProjPF').html(data.value.valorTotal.valorSinistrosProjetados.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            $('#spValorResultadoPF').html(data.value.valorTotal.valorResultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

            $('#spPercPremioPF').html(data.value.percentualTotal.percentualPremioEmitido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercAsssitenciasPF').html(data.value.percentualTotal.percentualPremioAssitencias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercResseguroPF').html(data.value.percentualTotal.percentualPremioResseguro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercCosseguroPF').html(data.value.percentualTotal.percentualPremioCosseguro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercPremioGanhoPF').html(data.value.percentualTotal.percentualPremioGanho.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercComissaoPF').html(data.value.percentualTotal.percentualComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercProLaborePF').html(data.value.percentualTotal.percentualProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercAgenciamentoPF').html(data.value.percentualTotal.percentualAgenciamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercDespAdmPF').html(data.value.percentualTotal.percentualDespesasAdministrativas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercSinProjPF').html(data.value.percentualTotal.percentualSinistrosProjetados.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#spPercResultadoPF').html(data.value.percentualTotal.percentualResultado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
        }
    },

    ExportarFreecover: function (callback) {

        var idCotacao = cotacao._id;
        var numeroPlano = parseInt($('#selecPlanoRel').val());
        var numeroCenario = cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario;
        var numeroVersao = parseInt($('#selectVsCalculoRel').val());

        $.ajax({
            url: '/relatorio/Freecover',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                //TODO: Colocar as duas funções abaixo em um arquivo Helper
                if (data.fileContents != null) {
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
                IdCotacao: idCotacao,
                NumeroPlano: numeroPlano,
                NumeroCenario: numeroCenario,
                NumeroVersao: numeroVersao,
                TipoRelatorio: 'Freecover'
            })
        });
    },

    ExportarResumoTecnico: function (callback) {

        var idCotacao = cotacao._id;
        var numeroPlano = parseInt($('#selecPlanoRel').val());
        var numeroCenario = cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario;
        var numeroVersao = parseInt($('#selectVsCalculoRel').val());

        $.ajax({
            url: '/relatorio/ResumoTecnico',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                //TODO: Colocar as duas funções abaixo em um arquivo Helper
                if (data.fileContents != null) {
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
                IdCotacao: idCotacao,
                NumeroPlano: numeroPlano,
                NumeroCenario: numeroCenario,
                NumeroVersao: numeroVersao,
                TipoRelatorio: 'ResumoTecnico'
            })
        });
    },

    ExportarDistribuicaoCapital: function () {

        var idCotacao = cotacao._id;
        var numeroPlano = parseInt($('#selecPlanoRel').val());
        var numeroCenario = cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario;
        var numeroVersao = parseInt($('#selectVsCalculoRel').val());

        $.ajax({
            url: '/relatorio/DistribuicaoCapital',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                //TODO: Colocar as duas funções abaixo em um arquivo Helper
                if (data.fileContents != null) {
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
                IdCotacao: idCotacao,
                NumeroPlano: numeroPlano,
                NumeroCenario: numeroCenario,
                NumeroVersao: numeroVersao,
                TipoRelatorio: 'DistribuicaoCapital'
            })
        });
    }
};

window.RelatoriosAnaliseDeRiscoEvents = {

    onChangeCenario: function (indexAbaAtual, indexAbaAnterior) {
        openModalWait();
        //TODO: limpar relatorios?

        indiceCenarioSelecionadoRelatorios = indexAbaAtual;
        indiceVersaoSelecionadaRelatorios = 0;
        window.RelatoriosAnaliseDeRiscoUi.carregarVersoes();
        window.RelatoriosAnaliseDeRiscoUi.carregarPlanos();
        if (cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo[0].indicadorVersaoCalculada) {
            window.RelatoriosAnaliseDeRiscoFunctions.obterResumoTecnico();
            window.RelatoriosAnaliseDeRiscoFunctions.ObterProjecaoFaturamento();
            window.RelatoriosAnaliseDeRiscoFunctions.obterFreecover();
        }
    },

    onChangeVersao: function (campo) {
        openModalWait();
        indiceVersaoSelecionadaRelatorios = cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo.findIndex(function (value) {
            return value.numeroVersao == $(campo).val();
        });
        window.RelatoriosAnaliseDeRiscoUi.carregarPlanos();
        window.RelatoriosAnaliseDeRiscoFunctions.obterResumoTecnico();
        window.RelatoriosAnaliseDeRiscoFunctions.ObterProjecaoFaturamento();
        window.RelatoriosAnaliseDeRiscoFunctions.obterFreecover();
        closeModalWait();
    },

    onChangePlano: function () {
        openModalWait();
        window.RelatoriosAnaliseDeRiscoFunctions.obterResumoTecnico();
        window.RelatoriosAnaliseDeRiscoFunctions.ObterProjecaoFaturamento();
        window.RelatoriosAnaliseDeRiscoFunctions.obterFreecover();
        closeModalWait();
    },

    OnClickAtualizarRelatorioDistribuicaoCapital: function () {
        openModalWait();
        $('#txtDCIntervaloCapitais').removeClass("input-validation-error");
        $('#txtDCIntervaloIdade').removeClass("input-validation-error");
        $('#txtDCCapitalMinimo').removeClass("input-validation-error");
        $('#txtDCIdadeMinima').removeClass("input-validation-error");
        $('#txtDCCapitalMaximo').removeClass("input-validation-error");
        $('#txtDCIdadeMaxima').removeClass("input-validation-error");

        if ($('#txtDCIntervaloCapitais').val() === "" && $('#txtDCCapitalMinimo').val() === "" && $('#txtDCCapitalMaximo').val() === "" &&
            $('#txtDCIntervaloIdade').val() === "" && $('#txtDCIdadeMinima').val() === "" && $('#txtDCIdadeMaxima').val() === "") {
            notification("erro", "Para atualizar o relatório, deve-se preencher os campos de limitadores.", '');
            closeModalWait();
        }
        else {
            var capitalMenorOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalMenorCapital();
            var capitalMaiorOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalMaiorCapital();
            var idadeMinimaOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalIdadeMinima();
            var idadeMaximaOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalIdadeMaxima();

            if (capitalMenorOK && capitalMaiorOK) {
                var intervaloCapitalOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalIntervaloCapitais();
            }

            if (idadeMinimaOK && idadeMaximaOK) {
                var intervaloIdadeOK = window.RelatoriosAnaliseDeRiscoFunctions.ValidarDistribuicaoCapitalIntervaloIdade();
            }

            if (intervaloCapitalOK && intervaloIdadeOK) {

                window.RelatoriosAnaliseDeRiscoFunctions.CalcularDistribuicaocapital(parseInt(cotacao.ProdutoComercial.Codigo),
                    cotacao.DataReferencia,
                    parseInt(cotacao._id),
                    parseInt(cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].numeroCenario),
                    parseInt(cotacao.CenariosCotacao[indiceCenarioSelecionadoRelatorios].versoesCalculo[indiceVersaoSelecionadaRelatorios].numeroVersao),
                    parseInt($('#selecPlanoRel').val()),
                    $('#txtDCIntervaloCapitais').val() === "" ? null : parseInt($('#txtDCIntervaloCapitais').maskMoney('unmasked')[0]),
                    $('#txtDCCapitalMinimo').val() === "" ? 0 : parseFloat($('#txtDCCapitalMinimo').maskMoney('unmasked')[0]),
                    $('#txtDCCapitalMaximo').val() === "" ? null : parseFloat($('#txtDCCapitalMaximo').maskMoney('unmasked')[0]),
                    $('#txtDCIntervaloIdade').val() === "" ? null : parseInt($('#txtDCIntervaloIdade').val()),
                    $('#txtDCIdadeMinima').val() === "" ? 0 : parseInt($('#txtDCIdadeMinima').val()),
                    $('#txtDCIdadeMaxima').val() === "" ? null : parseInt($('#txtDCIdadeMaxima').val()));
            }
            else
                closeModalWait();
        }
    },

    OnClickExportarResumoTecnico: function () {
        openModalWait();
        window.RelatoriosAnaliseDeRiscoFunctions.ExportarResumoTecnico();
    },

    OnClickExportarFreecover: function () {
        openModalWait();
        window.RelatoriosAnaliseDeRiscoFunctions.ExportarFreecover();
    },

    OnClickExportarDistribuicaoCapital: function () {
        openModalWait();
        window.RelatoriosAnaliseDeRiscoFunctions.ExportarDistribuicaoCapital();
    },

};