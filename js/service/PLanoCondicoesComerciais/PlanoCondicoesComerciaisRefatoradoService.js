var CenarioCotacao = (function () {
    function CenarioCotacao(numeroCenario, totalVidas, planosCondicoesComerciais, indicadorRelacaoVidaSimplificada, indicadorRelacaoVidaAgrupada, versoesCalculo, salvo, indicadorPlanoMesmaCobertura) {
        this.numeroCenario = numeroCenario;
        this.totalVidas = totalVidas;
        this.planosCondicoesComerciais = planosCondicoesComerciais;
        this.versoesCalculo = versoesCalculo;
        this.indicadorRelacaoVidaSimplificada = indicadorRelacaoVidaSimplificada;
        this.indicadorRelacaoVidaAgrupada = indicadorRelacaoVidaAgrupada;
        this.indicadorPlanoMesmaCobertura = indicadorPlanoMesmaCobertura;
        this.salvo = salvo;
        this.indicadorSomentePlanosAP = true;
    }
    return CenarioCotacao;
}());

var VersaoCalculo = (function () {
    function Versao(numeroVersao, nomeVersao, quantidadeTotalVidas, codigoTipoTabelaTaxa, percentualDescontoAgravoTecnico, valorLimiteRetencaoResseguro, valorCapitalMedio, indicadorCalcularAfastados, taxasResseguro, indicadorVersaoCalculada, descricaoTipoTabelaTaxa) {
        this.numeroVersao = numeroVersao;
        this.nomeVersao = nomeVersao;
        this.quantidadeTotalVidas = quantidadeTotalVidas;
        this.codigoTipoTabelaTaxa = codigoTipoTabelaTaxa;
        this.descricaoTipoTabelaTaxa = descricaoTipoTabelaTaxa;
        this.percentualDescontoAgravoTecnico = percentualDescontoAgravoTecnico;
        this.valorLimiteRetencaoResseguro = valorLimiteRetencaoResseguro;
        this.valorCapitalMedio = valorCapitalMedio;
        this.indicadorCalcularAfastados = indicadorCalcularAfastados;
        this.taxasResseguro = taxasResseguro;
        this.indicadorVersaoCalculada = indicadorVersaoCalculada;
    }
    return Versao;
}());

var TaxasResseguro = (function () {
    function TaxasResseguro(idadeMinima, idadeMaxima, percentualTaxa) {
        this.idadeMinima = idadeMinima;
        this.idadeMaxima = idadeMaxima;
        this.percentualTaxa = percentualTaxa;
    }
    return TaxasResseguro;

}());

var PlanoCondicoesComerciais = (function () {
    function PlanoCondicoesComerciais(cotacao, numero, nome, modalidadeCapital, capitalUniforme, capitalEscalonadoIdade, multiploSalarial, vidas, pMasculino, pFeminino, iMedia, lCapital, cobertura, salvo) {
        this.numeroCotacao = cotacao;
        this.numeroPlano = numero;
        this.nomePlano = nome;
        this.tipoModalidadeCapital = modalidadeCapital;
        this.valorCapitalUniforme = capitalUniforme;
        this.indicadorCapitalEscalonadoIdade = capitalEscalonadoIdade;
        this.valorMultiploSalarial = multiploSalarial;
        this.totalVidas = vidas;
        this.percentualMasculino = pMasculino;
        this.percentualFeminino = pFeminino;
        this.idadeMedia = iMedia;
        this.limitadoresCapital = lCapital;
        this.coberturas = JSON.parse(JSON.stringify(cobertura));
        this.indicadorPlanoAP = true;
        this.salvo = salvo;
    }
    return PlanoCondicoesComerciais;
}());

var TipoModalidadeCapital = (function () {
    function TipoModalidadeCapital(codigo, descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }
    return TipoModalidadeCapital;
}());

var LimitadoresCapital = (function () {
    function LimitadoresCapital(minima, maxima, minimo, maximo) {
        this.idadeMinima = minima;
        this.idadeMaxima = maxima;
        this.valorCapitalMinimo = minimo;
        this.valorCapitalMaximo = maximo;
    }
    return LimitadoresCapital;
}());

var Cobertura = (function () {
    function Cobertura(codigo, codigoTipoCobertura, siglaTipoCobertura, nome, verbas, selecionado) {
        this.codigo = codigo;
        this.codigoTipoCobertura = codigoTipoCobertura;
        this.siglaTipoCobertura = siglaTipoCobertura;
        this.nome = nome;
        this.verbas = verbas;
        this.selecionado = selecionado;
    }
    return Cobertura;
}());

var Verba = (function () {
    function Verba(codigo, nome, valorImportanciaSegurada, valorTotalPremio, percentualIndenizacao, percentualIndenizacaoValorCadastrado, quantidadeDiaria, valorDiaria, coeficienteTaxaLiberty, coeficienteTaxaResseguro, coeficienteTaxaComercial) {
        this.codigo = codigo;
        this.nome = nome;
        this.valorImportanciaSegurada = valorImportanciaSegurada;
        this.valorTotalPremio = valorTotalPremio;
        this.percentualIndenizacao = percentualIndenizacao;
        this.percentualIndenizacaoValorCadastrado = percentualIndenizacaoValorCadastrado;
        this.quantidadeDiaria = quantidadeDiaria;
        this.valorDiaria = valorDiaria;
        this.coeficienteTaxaLiberty = coeficienteTaxaLiberty;
        this.coeficienteTaxaResseguro = coeficienteTaxaResseguro;
        this.coeficienteTaxaComercial = coeficienteTaxaComercial;
    }
    return Verba;
}());

var indexPlanoSelecionado = 0;
var indexCenarioSelecionado = 0;

var coberturas = [];

var criarPlanoDepoisDoSubmit = false;
var criarCenarioDepoisDoSubmit = false;
var copiarCenarioDepoisDoSubmit = false;
var carregandoPlano = true;
var changePlanoOnError = false;

$(function () {

    window.PlanosCondicoesComerciaisFunctions.initialize(window.PlanosCondicoesComerciaisUi.initialize);

});

window.PlanosCondicoesComerciaisUi = {

    initialize: function (callback) {
        window.PlanosCondicoesComerciaisUi.addMasks();
        window.PlanosCondicoesComerciaisUi.carregaCoberturas(coberturasBasicas, "#CoberturaProdutoComercialBasica");
        window.PlanosCondicoesComerciaisUi.carregaCoberturas(coberturasAdicionais, "#CoberturaProdutoComercialAdicionais");
        window.PlanosCondicoesComerciaisUi.carregaCoberturas(coberturasAdicionaisDiarias, "#CoberturaProdutoComercialAdicionaisDiarias");
        window.PlanosCondicoesComerciaisUi.carregaCoberturas(coberturasAdicionaisFuneral, "#CoberturaProdutoComercialAdicionaisFuneral");
        window.PlanosCondicoesComerciaisUi.carregaCoberturas(coberturasCestaBasica, "#CoberturaProdutoComercialCestaBasica");
        window.PlanosCondicoesComerciaisUi.carregaCoberturas(coberturasCestaNatalidade, "#CoberturaProdutoComercialCestaNatalidade");
        window.PlanosCondicoesComerciaisUi.carregaCoberturas(coberturasServicos, "#CoberturaProdutoComercialServicos");
        window.PlanosCondicoesComerciaisUi.verificaModalidadeSeguro();

        for (var i = 0; i < cotacao.CenariosCotacao.length; i++) {
            window.PlanosCondicoesComerciaisUi.adicionarCenario($("#addCenario"), cotacao.CenariosCotacao[i].numeroCenario, i == 0, cotacao.CenariosCotacao.length == 1);
        }

        window.PlanosCondicoesComerciaisUi.carregarPlanosDoCenario();
        window.PlanosCondicoesComerciaisUi.preencheCamposDoPlanoNaTela(function () {
            carregandoPlano = false;
        });

        $('#accordion .panel').on('show.bs.collapse', function (e) { $(e.currentTarget).find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up"); });
        $('#accordion .panel').on('hide.bs.collapse', function (e) { $(e.currentTarget).find(".glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down"); });
    },

    addMasks: function () {
        $('.mask999').mask('999');

        $('.maskMoney').maskMoney({
            prefix: "R$ ",
            decimal: ",",
            thousands: "."
        });
    },

    carregaCoberturas: function (data, template) {
        var html = $("#CoberturasTemplate").render(data);
        $(template).html(html);
        window.PlanosCondicoesComerciaisUi.addMasks();
    },

    verificaModalidadeSeguro: function () {
        window.PlanosCondicoesComerciaisUi.escondeTodasModalidas();
        if ($('#selectTipoModalidadeCapital').val() == "UN") {
            $('#modalidadeSeguroUniforme').show();
            $("#modalidadeEscalonadoPorIdade").show();
            $("#lblEscalonadoPorIdade").show();
            $("#inputEscalonadoPorIdade").show();
            $('#lblIdades').show();
            $('#inputIdades').show();
            $('#modalidadeSeguroEscalonado').show();
            $("#inputEscalonadoPorIdadelinha_0").show();
            if (window.PlanosCondicoesComerciaisUi.preencherLimitadoresCapitalComValoresPadrao()) {
                $("#inputIdadeInicial_0").val(ProdutoComercial.produtoComercialVida.idadeMinimoContrato).change();
                $("#inputIdadeFinal_0").val(ProdutoComercial.produtoComercialVida.idadeMaximoContrato).change();
                $("#inputCapitalMinimo_0").val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato)).change();
                $("#inputCapitalMaximo_0").val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato)).change();
            }
        } else if ($('#selectTipoModalidadeCapital').val() == "ES") {
            $('#modalidadeSeguroEscalonado').show();
            $("#modalidadeEscalonadoPorIdade").show();
            $("#selectEscalonadoIdade").show();
            $("#lblEscalonadoPorIdade").show();
            $("#inputEscalonadoPorIdade").show();
            $("#inputEscalonadoPorIdadelinha_0").show();
            $('#lblIdades').show();
            $('#lblCapital').show();
            $("#inputIdades").show();
            $("#inputCapital").show();
            window.PlanosCondicoesComerciaisUi.verificaEscalonadoPorIdade();
        } else if ($('#selectTipoModalidadeCapital').val() == "MS") {
            $('#modalidadeSeguroMultiploSalarial').show();
            $("#modalidadeEscalonadoPorIdade").show();
            $("#lblEscalonadoPorIdade").show();
            $("#inputEscalonadoPorIdade").show();
            $('#modalidadeSeguroEscalonado').show();
            $("#inputEscalonadoPorIdadelinha_0").show();
            $('#lblIdades').show();
            $('#lblCapital').show();
            $("#inputIdades").show();
            $("#inputCapital").show();
            if (window.PlanosCondicoesComerciaisUi.preencherLimitadoresCapitalComValoresPadrao()) {
                $("#inputIdadeInicial_0").val(ProdutoComercial.produtoComercialVida.idadeMinimoContrato).change();
                $("#inputIdadeFinal_0").val(ProdutoComercial.produtoComercialVida.idadeMaximoContrato).change();
                $("#inputCapitalMinimo_0").val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato)).change();
                $("#inputCapitalMaximo_0").val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato)).change();
            }
        }
    },

    escondeTodasModalidas: function () {
        $("#modalidadeSeguroUniforme").hide();
        $("#modalidadeSeguroEscalonado").hide();
        $("#modalidadeEscalonadoPorIdade").hide();
        $("#lblEscalonadoPorIdade").hide();
        $("#lblIdades").hide();
        $("#lblCapital").hide();
        $("#inputEscalonadoPorIdade").hide();
        $("#inputEscalonadoPorIdadelinha_0").hide();
        $("#inputIdades").hide();
        $("#inputCapital").hide();
        $("#btnsEscalonadoPorIdade").hide();
        $("#modalidadeSeguroMultiploSalarial").hide();
        $("#selectEscalonadoIdade").hide();
        $('#inputValorMultiplo').removeClass("input-validation-error");
        $('#inputValorCapitalUniforme').removeClass("input-validation-error");
    },

    verificaEscalonadoPorIdade: function () {
        if ($("#SimEscalonadoPorIdade").prop("checked")) {
            $("#modalidadeEscalonadoPorIdade").show();
            $('#btnsEscalonadoPorIdade').show();
            $("#inputIdadeInicial_0").val("").change();
            $("#inputIdadeFinal_0").val("").change();
            $("#inputCapitalMinimo_0").val("").change();
            $("#inputCapitalMaximo_0").val("").change();
            $("#inputIdadeInicial_0").removeClass("input-validation-error");
            $("#inputIdadeFinal_0").removeClass("input-validation-error");
            $("#inputCapitalMinimo_0").removeClass("input-validation-error");
            $("#inputCapitalMaximo_0").removeClass("input-validation-error");

            if (!carregandoPlano)
                window.PlanosCondicoesComerciaisFunctions.removerLimitadoresCapital();
        } else {
            $("#btnsEscalonadoPorIdade").hide();
            if (!carregandoPlano) {
                window.PlanosCondicoesComerciaisFunctions.removerLimitadoresCapital();
                for (var i = $("#inputEscalonadoPorIdade > div").length - 1; i > 0; i--) {
                    $('#inputEscalonadoPorIdadelinha_' + i).remove();
                }
            }

            if (window.PlanosCondicoesComerciaisUi.preencherLimitadoresCapitalComValoresPadrao()) {
                $("#inputIdadeInicial_0").val(ProdutoComercial.produtoComercialVida.idadeMinimoContrato).change();
                $("#inputIdadeFinal_0").val(ProdutoComercial.produtoComercialVida.idadeMaximoContrato).change();
                $("#inputCapitalMinimo_0").val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato)).change();
                $("#inputCapitalMaximo_0").val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato)).change();
            }
        }
    },

    adicionarCenario: function (abaAdicionar, numeroCenario, ativo, somenteUmCenario) {

        if (somenteUmCenario == undefined)
            somenteUmCenario = false;

        if (ativo) {
            $(abaAdicionar).closest('li').before('<li onmouseover="$(\'#tab' + numeroCenario + '\').show()" onmouseout="$(\'#tab' + numeroCenario + '\').hide()" class="active"><a href="#" data-toggle="tab" ><span >Cen.' + numeroCenario + ' </span><i id="tab' + numeroCenario + '" style="display:none;"> <i title="Copiar" class="iconfa-copy" onClick="if(confirm(\'Deseja realmente copiar o cenário?\')) window.PlanosCondicoesComerciaisEvents.OnClickCopiarCenario(this,' + numeroCenario + '); else return;"></i> <i title="Excluir" class="iconfa-trash" onClick="if(confirm(\'Ao excluir o cenário os planos e vidas vinculados ao cenários também serão excluídos. Deseja continuar?\')) window.PlanosCondicoesComerciaisEvents.OnClickExcluirCenario(this,' + numeroCenario + '); else return;" ' + (somenteUmCenario ? 'style="display:none;"' : '') + ' ></i> </a></i></li>');
        } else {
            $(abaAdicionar).closest('li').before('<li onmouseover="$(\'#tab' + numeroCenario + '\').show()" onmouseout="$(\'#tab' + numeroCenario + '\').hide()"><a data-toggle="tab" href="#" ><span> Cen.' + numeroCenario + ' </span> <i id="tab' + numeroCenario + '" style="display:none;"> <i title="Copiar" class="iconfa-copy" onClick="if(confirm(\'Deseja realmente copiar o cenário?\')) window.PlanosCondicoesComerciaisEvents.OnClickCopiarCenario(this,' + numeroCenario + '); else return;"></i> <i title="Excluir" class="iconfa-trash" onClick="if(confirm(\'Ao excluir o cenário os planos e vidas vinculados ao cenários também serão excluídos. Deseja continuar?\')) window.PlanosCondicoesComerciaisEvents.OnClickExcluirCenario(this,' + numeroCenario + '); else return;"></i> </a></i></li>');
        }
        $('#tabCenarios a').unbind('shown.bs.tab');
        $('#tabCenarios a').on('shown.bs.tab', function (e) {
            window.PlanosCondicoesComerciaisEvents.OnChangeCenario($(e.target).closest('li').index(), $(e.relatedTarget).closest('li').index());
        });
    },

    copiarCenario: function (abaCopiar, numeroCenario) {
        $(abaCopiar).closest('ul').find(' > li:nth-last-child(1)').before('<li onmouseover="$(\'#tab' + numeroCenario + '\').show()" onmouseout="$(\'#tab' + numeroCenario + '\').hide()"><a data-toggle="tab" href="#" ><span> Cen.' + numeroCenario + ' </span> <i id="tab' + numeroCenario + '" style="display:none;"> <i title="Copiar" class="iconfa-copy" onClick="if(confirm(\'Deseja realmente copiar o cenário?\')) window.PlanosCondicoesComerciaisEvents.OnClickCopiarCenario(this,' + numeroCenario + '); else return;"></i> <i title="Excluir" class="iconfa-trash" onClick="if(confirm(\'Ao excluir o cenário os planos e vidas vinculados ao cenários também serão excluídos. Deseja continuar?\')) window.PlanosCondicoesComerciaisEvents.OnClickExcluirCenario(this,' + numeroCenario + '); else return;"></i> </a></i></li>');

        $('#tabCenarios a').unbind('shown.bs.tab');
        $('#tabCenarios a').on('shown.bs.tab', function (e) {
            window.PlanosCondicoesComerciaisEvents.OnChangeCenario($(e.target).closest('li').index(), $(e.relatedTarget).closest('li').index());
        });

        $("#text_rl_TotalVidasPlano").val(0);
        $("#text_rl_TotalVidas").val(0);


    },

    adicionarPlanoCondicoesComerciais: function (numeroDoPlano) {
        $('#selectPlanoSeguro').append('<option value="' + numeroDoPlano + '">' + numeroDoPlano + '</option>');
    },

    limparPlanoCondicoesComerciais: function () {
        $("#inputNomeDoPlano").val(null);
        $('#selectTipoModalidadeCapital').val("0");
        $('#select2-selectTipoModalidadeCapital-container').prop("title", "SELECIONE UMA OPÇÃO");
        $('#select2-selectTipoModalidadeCapital-container').text("SELECIONE UMA OPÇÃO");
        for (let c = 0; c < coberturas.length; c++) {
            $("#chk_cobertura_" + coberturas[c].codigo).removeAttr("checked");
            window.PlanosCondicoesComerciaisUi.limpaCampoDeCobertura(coberturas[c].codigo);
        }
        for (let e = 0; e < 200; e++) {
            if ($('#inputEscalonadoPorIdadelinha_' + e).val() == undefined) {
                e = 200;
            } else {
                if (e == 0) {
                    $("#inputIdadeInicial_0").val("");
                    $("#inputIdadeFinal_0").val("");
                    $("#inputCapitalMinimo_0").val("");
                    $("#inputCapitalMaximo_0").val("");
                } else {
                    $('#inputEscalonadoPorIdadelinha_' + e).remove();
                }
            }
        }
        $("#inputValorMultiplo").val("");
        $("#inputValorCapitalUniforme").val("");
        window.PlanosCondicoesComerciaisUi.escondeTodasModalidas();
        for (let c = 0; c < coberturas.length; c++) {
            $("#chk_cobertura_" + coberturas[c].codigo).removeAttr("checked");
            window.PlanosCondicoesComerciaisUi.validacoesBaseCoberturas(coberturas[c].codigo, "#chk_cobertura_" + coberturas[c].codigo);
        }
        $("#text_rl_TotalVidasPlano").val("");
        $("#text_rl_TotalVidas").val("");
    },

    limpaCampoDeCobertura: function (codigoCoberturaAlterada) {

        $('#hd_cobertura_selecionado_' + codigoCoberturaAlterada).val(false);
        $('#hd_cobertura_percentualIndenizacao_' + codigoCoberturaAlterada).val("");

        if ($('#txt_QtdDiarias_' + codigoCoberturaAlterada).val() != undefined) {
            $('#txt_QtdDiarias_' + codigoCoberturaAlterada).attr('readonly', 'readonly').val("");;
        }
        if ($('#txt_ValorDiarias_' + codigoCoberturaAlterada).val() != undefined) {
            $('#txt_ValorDiarias_' + codigoCoberturaAlterada).attr('readonly', 'readonly').val("");;
        }
        if ($('#txt_cobertura_' + codigoCoberturaAlterada).val() != undefined) {
            $('#txt_cobertura_' + codigoCoberturaAlterada).attr('readonly', 'readonly').val("");
        }
    },

    successListaModalidadeCapital: function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#selectTipoModalidadeCapital").append('<option value="' + data[i].tipoModalidadeCapital + '"> ' + data[i].descricaoTipoModalidadeCapital + ' </option>');
        }
    },


    liberaImportacaoVidas: function (isSalvo) {

        if (isSalvo) {
            $("#RelacaoVidasBloqueio").hide();
            $("#RelacaoVidas").show();
        } else {
            $("#RelacaoVidasBloqueio").show();
            $("#RelacaoVidas").hide();
        }

    },

    carregarPlanosDoCenario: function () {
        $('#selectPlanoSeguro').empty();

        if (typeof cotacao.CenariosCotacao[indexCenarioSelecionado] != "undefined") {
            for (var i = 0; i < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length; i++) {
                $('#selectPlanoSeguro').append('<option value="' + cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[i].numeroPlano + '">' + cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[i].numeroPlano + '</option>');
            }
        }
    },

    preencheCamposDoPlanoNaTela: function (callback) {
        //$("#cenarios > li").first().addClass("active");

        if (typeof cotacao.CenariosCotacao[indexCenarioSelecionado] != "undefined") {

            var planoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado];
            $("#inputNomeDoPlano").val(planoSelecionado.nomePlano);

            if (planoSelecionado.tipoModalidadeCapital.codigo) {
                $("#selectTipoModalidadeCapital").val(planoSelecionado.tipoModalidadeCapital.codigo);
                $("#selectTipoModalidadeCapital").trigger("change");

                if (planoSelecionado.tipoModalidadeCapital.codigo == "MS") {
                    $("#inputValorMultiplo").val(planoSelecionado.valorMultiploSalarial);
                }
                else if (planoSelecionado.tipoModalidadeCapital.codigo == "UN") {
                    $("#inputValorCapitalUniforme").val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(planoSelecionado.valorCapitalUniforme));

                }
                else if (planoSelecionado.tipoModalidadeCapital.codigo == "ES") {
                    if (planoSelecionado.indicadorCapitalEscalonadoIdade == "S") {
                        $("#SimEscalonadoPorIdade").attr("checked", "checked");
                        $("#SimEscalonadoPorIdade").change();
                    }
                    else if (planoSelecionado.indicadorCapitalEscalonadoIdade == "N") {
                        $("#NaoEscalonadoPorIdade").attr("checked", "checked");
                        $("#NaoEscalonadoPorIdade").change();
                    }
                }
                for (var i = 0; i <= planoSelecionado.limitadoresCapital.length - 1; i++) {
                    if (i != 0) {
                        var templateIdades = $("#EscalonadoIdadeTemplate").render({ indice: i })
                        $("#inputEscalonadoPorIdade").append(templateIdades);
                    }
                    $("#inputIdadeFinal_" + i).val(planoSelecionado.limitadoresCapital[i].idadeMaxima);
                    $("#inputIdadeInicial_" + i).val(planoSelecionado.limitadoresCapital[i].idadeMinima);
                    $("#inputCapitalMaximo_" + i).val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(planoSelecionado.limitadoresCapital[i].valorCapitalMaximo));
                    $("#inputCapitalMinimo_" + i).val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(planoSelecionado.limitadoresCapital[i].valorCapitalMinimo));
                }
            }
            for (var i = 0; i < planoSelecionado.coberturas.length; i++) {
                if (planoSelecionado.coberturas[i].selecionado) {
                    $('#chk_cobertura_' + planoSelecionado.coberturas[i].codigo).attr("checked", "checked").change();
                    switch ($('#chk_cobertura_' + planoSelecionado.coberturas[i].codigo).prop("name")) {
                        case "basica":
                        case "adicionais":
                            $('#txt_cobertura_' + planoSelecionado.coberturas[i].codigo).val(planoSelecionado.coberturas[i].verbas[0].percentualIndenizacao);
                            break;
                        case "diarias":
                            $('#txt_QtdDiarias_' + planoSelecionado.coberturas[i].codigo).val(planoSelecionado.coberturas[i].verbas[0].quantidadeDiaria);
                            $('#txt_ValorDiarias_' + planoSelecionado.coberturas[i].codigo).val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(planoSelecionado.coberturas[i].verbas[0].valorDiaria));
                            break;
                        case "adicionaisFuneral":
                            $('#txt_cobertura_' + planoSelecionado.coberturas[i].codigo).val(window.PlanosCondicoesComerciaisFunctions.converterDecimalParaMoeda(planoSelecionado.coberturas[i].verbas[0].valorImportanciaSegurada));
                            break;
                        default:
                            break;
                    }
                }
            }
            $("#text_rl_TotalVidasPlano").val(planoSelecionado.totalVidas);
            $("#text_rl_TotalVidas").val(cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas);
            cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada ? $("#arquivorlAgrupadoSim").attr('checked', 'checked') : $("#arquivorlAgrupadoNão").attr('checked', 'checked');
            //carregandoPlano = false;
            carregandoPlano = true;
            onRelacaoVidasAgrupada();
            window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasAbas();
            window.ControleDeAcessoCotacaoFunctions.ValidaExibicaoDasSessoes();
            callback && callback();
        }

    },

    removerCenario: function (aba) {
        $(aba).closest('li').remove();
    },

    preencherLimitadoresCapitalComValoresPadrao: function () {
        return !cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[0] ||
            (!cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[0].idadeMaxima &&
                !cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[0].idadeMinima &&
                !cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[0].valorCapitalMaximo &&
                !cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[0].valorCapitalMinimo)
    },

    validacoesBaseCoberturas: function (idCobertura, campoCobertura) {
        if ($(campoCobertura).is(':checked')) {

            var valorPadraoCobertura = coberturasViewBag.find(function (cobertura) {
                return cobertura.CodigoCobertura == idCobertura
            }).VerbaCoberturaProdutoComercial[0].Valor

            if (valorPadraoCobertura) {
                $('#txt_cobertura_' + idCobertura).val(valorPadraoCobertura);
                $('#txt_cobertura_' + idCobertura).change();
            }
            else
                $('#txt_cobertura_' + idCobertura).removeAttr("readonly");

            if (campoCobertura.hasAttribute("exclusivas")) {
                var arrayExclusivas = ($(campoCobertura).attr('exclusivas')).split(',');

                for (var i = 0; i <= arrayExclusivas.length - 1; i++) {
                    if ($('#chk_cobertura_' + arrayExclusivas[i]).is(':checked')) {
                        $('#chk_cobertura_' + arrayExclusivas[i]).removeAttr('checked');
                        var indexCobertura = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.findIndex(function (value) {
                            return value.codigo == arrayExclusivas[i];
                        });
                        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[indexCobertura].selecionado = false;
                        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[indexCobertura].verbas[0].valorImportanciaSegurada = null;
                        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[indexCobertura].verbas[0].percentualIndenizacao = null;
                        $('#txt_cobertura_' + arrayExclusivas[i]).attr('readonly', 'readonly');
                        $('#txt_cobertura_' + arrayExclusivas[i]).val("");
                    }
                }
            }
            $(".checkCobertura").each(function () {

                if (this.hasAttribute("dependencias")) {
                    var podeDesabilitar = false;

                    if ($(this).attr('dependencias').indexOf(idCobertura) > -1) {
                        var arrayDependencias = $(this).attr('dependencias').split(',');

                        for (var i = 0; i <= arrayDependencias.length - 1; i++) {
                            if ($('#chk_cobertura_' + arrayDependencias[i]).is(':checked')) {
                                podeDesabilitar = true;
                                break;
                            }
                        }

                        if (podeDesabilitar) {
                            $(this).removeAttr("disabled");
                        }
                    }
                }
            });
        }
        else {
            $('#txt_cobertura_' + idCobertura).attr('readonly', 'readonly');
            $('#txt_cobertura_' + idCobertura).val("");

            if (!carregandoPlano)
                $('#txt_cobertura_' + idCobertura).change();
            $('#txt_cobertura_' + idCobertura).removeClass("input-validation-error");

            $(".checkCobertura").each(function () {
                if (this.hasAttribute("dependencias")) {
                    if ($(this).attr('dependencias').indexOf(idCobertura) > -1) {
                        $(this).attr('disabled', 'disabled');
                        $(this).removeAttr('checked');
                        if (!carregandoPlano) {
                            $(this).click();
                        }
                        $(this).change();

                    }
                }
            });

            //Desabilitar as coberturas quando é "desselecionado" as coberturas básicas, mas deu problema em outra parte de coberturas, por isso está comentado

            //var indexCobertura = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.findIndex(function (value) {
            //    return value.codigo == idCobertura;
            //});
            //cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[indexCobertura].selecionado = false;
            //cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[indexCobertura].verbas[0].valorImportanciaSegurada = null;
            //cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[indexCobertura].verbas[0].percentualIndenizacao = null;
        }

    },

    validacoesCoberturasBasicas: function (idCobertura, campoCobertura) {
        let proximasCobertura = [];
        let contextoCoberturaPadrao = false;
        let primeiraCoberturaComDependencia = true;

        if (!$(campoCobertura).is(':checked')) {
            /* Se uma cobertura básica foi desmarcada então irá verificar se há alguma outra cobertura básica marcada e fazer o tratamento da visualização: */
            $("input[name=basica]").each(function () {
                if ($(this).is(':checked')) {
                    idCobertura = this.value;
                    return false;
                }
            });
        }

        while (idCobertura !== "") {

            $(".checkCobertura").each(function () {

                if (this.hasAttribute("condicaoVisualizacao") &&
                    this.hasAttribute("dependencias") &&
                    this.getAttribute("dependencias").indexOf(idCobertura) >= 0) {

                    /* primeiraCoberturaComDependencia - Indentifica se a cobertura do loop atual tem dependencia da cobertura basica e assim achar o contexto */
                    if (primeiraCoberturaComDependencia) {
                        /* Contexto = Identifica se a cobertura básica selecionada corresponde a cobertura morte (cobertura morte - deverá ser mostrada quando mais de uma cobertura basica for selecionada) */
                        contextoCoberturaPadrao = this.getAttribute("dependencias") === coberturaMorte.CodigoCobertura;
                        primeiraCoberturaComDependencia = false;
                    }

                    /* Sair da função se a cobertura básica padrão estiver selecionada e o contexto indicar que a basica selecionada neste momento corresponde a outra cobertura */
                    if ($("#chk_cobertura_" + coberturaMorte.CodigoCobertura).is(':checked') && contextoCoberturaPadrao === false) {
                        return false;
                    }
                    else {
                        $("#divCobertura_" + this.value).removeClass("hide");
                        $("#chk_cobertura_" + this.value).removeAttr("checked");

                        $("#divCobertura_" + this.getAttribute("condicaoVisualizacao")).addClass("hide");
                        $("#chk_cobertura_" + this.getAttribute("condicaoVisualizacao")).removeAttr("checked");

                        proximasCobertura.push(this.value); //Adiciona esta cobertura na array para que seja feita a busca por dependentes desta cobertura e assim fazer o tratamento de visualização
                    }
                }
            });

            idCobertura = proximasCobertura.length > 0 ? proximasCobertura[0] : "";
            proximasCobertura.shift();
        }
    },

    validacoesCoberturasDiarias: function (campocobertura) {
        if ($(campocobertura).is(':checked')) {
            $('#txt_QtdDiarias_' + $(campocobertura).val()).removeAttr("readonly");
            $('#txt_ValorDiarias_' + $(campocobertura).val()).removeAttr("readonly").maskMoney({ prefix: "R$ ", decimal: ",", thousands: "." });
        }
        else {
            $('#txt_QtdDiarias_' + $(campocobertura).val()).attr('readonly', 'readonly').val("");
            $('#txt_QtdDiarias_' + $(campocobertura).val()).change();

            $('#txt_ValorDiarias_' + $(campocobertura).val()).attr('readonly', 'readonly').val("").maskMoney('destroy');
            $('#txt_ValorDiarias_' + $(campocobertura).val()).change();

            $('#txt_QtdDiarias_' + $(campocobertura).val()).removeClass("input-validation-error");
            $('#txt_ValorDiarias_' + $(campocobertura).val()).removeClass("input-validation-error");
        }
    },

    validacoesCoberturasAdicionaisFuneral: function (campocobertura) {
        if ($(campocobertura).is(':checked')) {
            // faço isso para quando clicar na coberturas Funeral que tem valor fixo vir como "disabled"
            for (var i = 0; i < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.length; i++) {
                var currentCobertura = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[i];
                var coberturasFuneral = "77,78,91,92".split(",");
                var coberturasFuneralDisabled = "88,89,90".split(",");

                if (coberturasFuneralDisabled.includes(currentCobertura.codigoTipoCobertura + "")) {
                    if (currentCobertura.selecionado && (currentCobertura.verbas[0].valorImportanciaSegurada > 1)) {
                        $('#txt_cobertura_' + currentCobertura.codigo).attr('disabled', 'disabled');

                    }
                }

                if (coberturasFuneral.includes(currentCobertura.codigoTipoCobertura + "")) {
                    if (currentCobertura.selecionado && (currentCobertura.verbas[0].valorImportanciaSegurada > 1)) {

                    }
                }
            }

            $('#txt_cobertura_' + $(campocobertura).val()).val($('#txt_cobertura_' + $(campocobertura).val()).val() + ',00'); //Necessário para a mascara abaixo 'maskMoney'
            $('#txt_cobertura_' + $(campocobertura).val()).removeAttr("readonly").maskMoney({ prefix: "R$ ", decimal: ",", thousands: "." });
            $('#txt_cobertura_' + $(campocobertura).val()).focus();
        }
        else {
            $('#txt_cobertura_' + $(campocobertura).val()).removeClass("input-validation-error");
        }
    },

    InserirLinhaEscalonadoPorIdade: function () {
        var templateIdades = $("#EscalonadoIdadeTemplate").render({ indice: cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.length - 1 })
        $("#inputEscalonadoPorIdade").append(templateIdades);
    },

    RemoverLinhaEscalonadoPorIdade: function (i) {
        $("#inputEscalonadoPorIdadelinha_" + i).remove();

    },
};

window.PlanosCondicoesComerciaisFunctions = {

    initialize: function (callback) {
        window.PlanosCondicoesComerciaisFunctions.carregaCoberturasDaTela();
        window.PlanosCondicoesComerciaisFunctions.pesquisarListaModalidadeCapital(function () {
            callback && callback();
        });
    },

    adicionarPlanoCondicoesComerciais: function (numeroDoPlano) {
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.push(
            new PlanoCondicoesComerciais(
                cotacao._id,
                numeroDoPlano,
                null,
                new TipoModalidadeCapital(null, null),
                null,
                null,
                null,
                null,
                null,
                null,
                null, [new LimitadoresCapital(null, null, null, null)],
                coberturas, false));
    },

    adicionarCenario: function (numeroCenario) {
        for (var i = 0; i < coberturas.length; i++) {
            coberturas[i].selecionado = false;
        }
        var novoPlano = [
            new PlanoCondicoesComerciais(
                cotacao._id,
                1,
                null,
                new TipoModalidadeCapital(null, null),
                null,
                null,
                null,
                null,
                null,
                null,
                null, [new LimitadoresCapital(null, null, null, null)],
                coberturas,
                false)
        ];

        var TR = [new TaxasResseguro(0, 0, 0)];

        var versaoDefault = [
            new VersaoCalculo(1, "Versão 1", 0, null, 0, 0, 0, false, TR, false)
        ]
        cotacao.CenariosCotacao.push(new CenarioCotacao(numeroCenario, null, novoPlano, false, false, versaoDefault, false));
        indexCenarioSelecionado = cotacao.CenariosCotacao.findIndex(function (value) {
            return value.numeroCenario == numeroCenario;
        });
        indexPlanoSelecionado = 0;
    },

    copiarCenario: function (cenarioCopiado) {

        cotacao.CenariosCotacao.push(window.PlanosCondicoesComerciaisFunctions.formatarCopia(cenarioCopiado));

        indexCenarioSelecionado = cotacao.CenariosCotacao.findIndex(function (value) {
            return value.numeroCenario == cenarioCopiado.numeroCenario;
        });
        window.PlanosCondicoesComerciaisFunctions.salvarCenario();
    },

    formatarCopia: function (cenarioCopiado) {

        cenarioCopiado.totalVidas = 0;

        for (var i = 0; i < cenarioCopiado.planosCondicoesComerciais.length; i++) {
            cenarioCopiado.planosCondicoesComerciais[i].totalVidas = 0;
        }
        cenarioCopiado.versoesCalculo.length = 0; //testar 

        var TR = [new TaxasResseguro(0, 0, 0)];

        cenarioCopiado.versoesCalculo.push(new VersaoCalculo(1, "Versão 1", 0, null, 0, 0, 0, false, TR, false));

        return cenarioCopiado;
    },

    salvarPlano: function (callback) {
        window.PlanosCondicoesComerciaisFunctions.verificarCampoVazio();
        window.PlanosCondicoesComerciaisFunctions.verificarTxtCoberturas(function () {
            $.ajax({
                url: '/cenarios/SalvarPlano/',
                type: 'post',
                contentType: "application/json",
                success: function (data) {
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].salvo = true;
                    callback && callback(data);
                },
                error: function (data) {
                    changePlanoOnError = true;
                    $("#selectPlanoSeguro").val(cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano).change();
                    var errors = JSON.parse(data.responseText);
                    for (var i = 0; i < errors.length; i++) {
                        notification("erro", errors[i], '');
                    }
                },
                data: JSON.stringify({
                    IdCotacao: cotacao._id,
                    NumeroCenario: cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario,
                    PlanoCondicoesComerciais: JSON.parse(JSON.stringify(cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado]))
                })
            })
        }
        )
    },

    salvarCenario: function (callback, exibirMensagemcotacaosalva) {
        window.PlanosCondicoesComerciaisFunctions.verificarCampoVazio();
        window.PlanosCondicoesComerciaisFunctions.verificarTxtCoberturas(function () {
            $.ajax({
                url: '/cenarios/SalvarCenario/',
                type: 'post',
                contentType: "application/json",
                success: function (data) {
                    closeModalWait();

                    cotacao.CenariosCotacao[indexCenarioSelecionado].salvo = true;
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].salvo = true;

                    callback && callback(data);
                },
                error: function (data) {
                    closeModalWait();
                    if (exibirMensagemcotacaosalva) {
                        notification("sucessoError", "Cotação - " + cotacao._id + ' - salva, porém contém erros que impediram o salvamento de todos os dados.', '');
                    }
                    cotacao.CenariosCotacao[indexCenarioSelecionado].salvo = false;
                    var errors = JSON.parse(data.responseText);
                    for (var i = 0; i < errors.length; i++) {
                        notification("erro", errors[i], '');
                    }
                    $("#tabCenarios > li").removeClass("active");
                    $($("#tabCenarios > li")[indexCenarioSelecionado]).addClass("active");


                },
                data: JSON.stringify({
                    IdCotacao: cotacao._id,
                    Cenario: JSON.parse(JSON.stringify(cotacao.CenariosCotacao[indexCenarioSelecionado]))
                })

            });
        }
        );
    },

    excluirPlano: function (callback) {
        $.ajax({
            url: '/cenarios/ExcluirPlano/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                callback && callback(data);
            },
            error: function (data) {
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                NumeroCenario: cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario,
                NumeroPlano: cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano,
            })
        });
    },

    excluirCenario: function (numeroCenario, callback) {
        $.ajax({
            url: '/cenarios/ExcluirCenario/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {

                callback && callback(data);
            },
            error: function (data) {

                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                NumeroCenario: numeroCenario,
            })

        });
    },

    verificaValorMultiplo: function (valor, callback) {
        let invalido = 0;
        if (ProdutoComercial != null && valor) {
            if (parseInt(valor) > ProdutoComercial.produtoComercialVida.valorMultiplicadorMaximoContrato || parseInt(valor) == 0) {
                $('#inputValorMultiplo').addClass("input-validation-error");
                invalido = 1;
                notification("erro", "Limite de Múltiplo Salarial é de no minimo 1 e no máximo " + ProdutoComercial.produtoComercialVida.valorMultiplicadorMaximoContrato + ".", "");
            } else {
                $('#inputValorMultiplo').removeClass("input-validation-error");
            }
        }
        if (invalido == 0) {
            $('#inputValorMultiplo').removeClass("input-validation-error");
            callback && callback();
        }
    },

    verificaValorCapitalUniforme: function (valor, callback) {
        let invalido = 0;
        if ((ProdutoComercial != null) && ($('#inputValorCapitalUniforme').val() != "") && (invalido == 0)) {
            if (parseFloat(valor) > ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato) {
                $('#inputValorCapitalUniforme').addClass("input-validation-error");
                invalido = 1;
                notification("erro", "Limite de Capital Uniforme é no máximo " + ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato + ".", "inputValorCapitalUniforme");
            } else if (parseFloat(valor) < ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato) {
                $('#inputValorCapitalUniforme').addClass("input-validation-error");
                invalido = 1;
                notification("erro", "Limite de Capital Uniforme é no minimo " + ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato + ".", "inputValorCapitalUniforme");
            } else {
                $('#inputValorCapitalUniforme').removeClass("input-validation-error");
            }
        }
        if (invalido == 0) {
            $('#inputValorCapitalUniforme').removeClass("input-validation-error");
            callback && callback();
        }
    },

    verificaIdadeInicial: function (indice, callback) {
        let tamanhoLista = indice;
        var idade = $("#inputIdadeInicial_" + indice).val();
        var idadeFinal = $("#inputIdadeFinal_" + indice).val();
        let invalido = 0;
        if ((ProdutoComercial != null) && ($('#inputIdadeInicial_' + indice).val() != "") && (invalido == 0)) {
            if ((parseInt(idade) < ProdutoComercial.produtoComercialVida.idadeMinimoContrato) || (parseInt(idade) > ProdutoComercial.produtoComercialVida.idadeMaximoContrato)) {
                $('#inputIdadeInicial_' + indice).addClass("input-validation-error");
                notification("erro", "O limite de idade permitido é mínimo " + ProdutoComercial.produtoComercialVida.idadeMinimoContrato + " e máximo " + ProdutoComercial.produtoComercialVida.idadeMaximoContrato + ".", "#" + $(this).attr("id"));
                invalido = 1;
            } else {
                $('#inputIdadeInicial_' + indice).removeClass("input-validation-error");
            }
            if ((idadeFinal != "") && (invalido == 0)) {
                if (parseInt(idade) > parseInt(idadeFinal)) {
                    $('#inputIdadeInicial_' + indice).addClass("input-validation-error");
                    invalido = 1;
                    notification("erro", "A Idade Inicial não pode ser maior que a Idade Final", "#" + $(this).attr("id"));
                }
            }
            if (invalido == 0) {
                for (let i = 0; i < tamanhoLista; i++) {
                    if (i != parseInt(indice)) {
                        if ((parseInt(idade) > parseInt($("#inputIdadeInicial_" + i).val())) && (parseInt(idade) <= parseInt($("#inputIdadeFinal_" + i).val()))) {
                            $('#inputIdadeInicial_' + indice).addClass("input-validation-error");
                            invalido = 1;
                            notification("erro", "Faixa de idade já cadastrada.", "#" + $(this).attr("id"));
                            break;
                        }
                    }
                    if (invalido == 0) {
                        $('#inputIdadeInicial_' + indice).removeClass("input-validation-error");
                    }
                }
            }
        }
        if (invalido == 0) {
            $('#inputIdadeInicial_' + indice).removeClass("input-validation-error");
            callback && callback();
        }
    },

    verificaIdadeFinal: function (indice, callback) {
        let tamanhoLista = indice;
        var idade = $('#inputIdadeFinal_' + indice).val();
        var idadeInicial = $("#inputIdadeInicial_" + indice).val();
        let invalido = 0;
        if ((ProdutoComercial != null) && ($('#inputIdadeFinal_' + indice).val() != "") && (invalido == 0)) {
            if (parseInt(idade) > ProdutoComercial.produtoComercialVida.idadeMaximoContrato || (parseInt(idade) < ProdutoComercial.produtoComercialVida.idadeMinimoContrato)) {
                $('#inputIdadeFinal_' + indice).addClass("input-validation-error");
                invalido = 1;
                notification("erro", "O limite de idade permitido é mínimo " + ProdutoComercial.produtoComercialVida.idadeMinimoContrato + " e máximo " + ProdutoComercial.produtoComercialVida.idadeMaximoContrato + ".", "#" + $(this).attr("id"));
            } else {
                $('#inputIdadeFinal_' + indice).removeClass("input-validation-error");
            }
            if ((idadeInicial != "") && (invalido == 0)) {
                if (parseInt(idade) < parseInt(idadeInicial)) {
                    $('#inputIdadeFinal_' + indice).addClass("input-validation-error");
                    invalido = 1;
                    notification("erro", "Idade Final não pode ser menor que a Idade Inicial", "#" + $(this).attr("id"));
                }
            }
            if (invalido == 0) {
                for (let i = 0; i < tamanhoLista; i++) {
                    if (i != parseInt(indice)) {
                        if ((parseInt(idade) >= parseInt($("#inputIdadeInicial_" + i).val())) && (parseInt(idade) <= parseInt($("#inputIdadeFinal_" + i).val()))) {
                            $('#inputIdadeFinal_' + indice).addClass("input-validation-error");
                            invalido = 1;
                            notification("erro", "Faixa de idade já cadastrada.", "#" + $(this).attr("id"));
                            break;
                        }
                    }
                }
            }
            if (invalido == 0) {
                $('#inputIdadeFinal_' + indice).removeClass("input-validation-error");
                callback && callback();
            }
        }
    },

    verificaCapitalMinimo: function (indice, callback) {
        var capital = $('#inputCapitalMinimo_' + indice).val();
        var capitalMaximo = $('#inputCapitalMaximo_' + indice).val();
        let invalido = 0;
        capital = window.PlanosCondicoesComerciaisFunctions.trataValorMoeda(capital);
        capitalMaximo = window.PlanosCondicoesComerciaisFunctions.trataValorMoeda(capitalMaximo);
        if ((ProdutoComercial != null) && ($('#inputCapitalMinimo_' + indice).val() != "") && (invalido == 0)) {
            if (parseInt(capital) < ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato) {
                $('#inputCapitalMinimo_' + indice).addClass("input-validation-error");
                invalido = 1;
                notification("erro", "Limite de capital permitido é mínimo " + ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato + " e máximo " + ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato + ".", "#" + $(this).attr("id"));
            } else {
                $('#inputCapitalMinimo_' + indice).removeClass("input-validation-error");
            }
        }
        if ((capitalMaximo != "") && (invalido == 0)) {
            if (parseFloat(capital) > parseFloat(capitalMaximo)) {
                $('#inputCapitalMinimo_' + indice).addClass("input-validation-error");
                invalido = 1;
                notification("erro", "O Capital Mínimo não pode ser maior que o Capital Máximo", "#" + $(this).attr("id"));
            }
        }
        if (invalido == 0) {
            $('#inputCapitalMinimo_' + indice).removeClass("input-validation-error");
            callback && callback();
        }
    },

    verificaCapitalMaximo: function (indice, callback) {
        var capital = $('#inputCapitalMaximo_' + indice).val();
        var capitalMinimo = $('#inputCapitalMinimo_' + indice).val();
        let invalido = 0;
        capital = window.PlanosCondicoesComerciaisFunctions.trataValorMoeda(capital);
        capitalMinimo = window.PlanosCondicoesComerciaisFunctions.trataValorMoeda(capitalMinimo);
        if ((ProdutoComercial != null) && ($('#inputCapitalMaximo_' + indice).val() != "") && (invalido == 0)) {
            if (parseFloat(capital) > ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato) {
                $('#inputCapitalMaximo_' + indice).addClass("input-validation-error");
                invalido = 1;
                notification("erro", "Limite de capital permitido é mínimo " + ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato + " e máximo " + ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato + ".", "#" + $(this).attr("id"));
            } else {
                $('#inputCapitalMaximo_' + indice).removeClass("input-validation-error");
            }
        }
        if ((capitalMinimo != "") && (invalido == 0)) {
            if (parseFloat(capital) < parseFloat(capitalMinimo)) {
                $('#inputCapitalMaximo_' + indice).addClass("input-validation-error");
                invalido = 1;
                notification("erro", "O Capital Máximo não pode ser menor que o Capital Mínimo", "#" + $(this).attr("id"));
            }
        }
        if (invalido == 0) {
            $('#inputCapitalMaximo_' + indice).removeClass("input-validation-error");
            callback && callback();
        }
    },

    pesquisarListaModalidadeCapital: function (callback) {
        $.ajax({
            url: '/ObterListaModalidadeCapital',
            async: true,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            success: function (data) {
                window.PlanosCondicoesComerciaisUi.successListaModalidadeCapital(data);
                callback && callback();
            },
            error: function (result) {
                onFailed(result)
            }
        });
    },

    carregaCoberturasDaTela: function () {

        for (let c = 0; c < coberturasViewBag.length; c++) {

            let verbas = [new Verba(coberturasViewBag[c].VerbaCoberturaProdutoComercial[0].CodigoVerba, coberturasViewBag[c].VerbaCoberturaProdutoComercial[0].NomeVerba)];
            coberturas.push(new Cobertura(coberturasViewBag[c].CodigoCobertura, coberturasViewBag[c].TipoCoberturaProdutoComercial, coberturasViewBag[c].SiglaTipoCobertura, coberturasViewBag[c].NomeCobertura, verbas, false));
        }
    },

    trataValorMoeda: function (valor) {
        valor = valor.replace(" ", "");
        valor = valor.replace("R$", "");
        valor = valor.replace(/\./g, "");
        valor = valor.replace(",", ".");
        return valor;
    },

    converterDecimalParaMoeda: function (numero) {
        var numeroDecimal = parseFloat(numero);
        var stringDecimal = numeroDecimal.toFixed(2);
        stringDecimal = stringDecimal.replace(".", ",");
        var posicao = 1;
        var stringDecimalFinal = "";
        for (nd = (stringDecimal.length - 1); nd >= 0; nd--) {
            if ((posicao == 7) || (((posicao == 11) && (nd > 0)))) {
                stringDecimalFinal += ("." + stringDecimal[nd]);
            } else {
                stringDecimalFinal += stringDecimal[nd];
            }
            posicao++;
        }
        stringDecimalFinal = stringDecimalFinal.split('').reverse().join('');
        stringDecimalFinal = ("R$ " + stringDecimalFinal);
        return stringDecimalFinal;
    },

    removerLimitadoresCapital: function () {
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital = [];
        window.PlanosCondicoesComerciaisFunctions.InserirLinhaEscalonadoPorIdade();
    },

    InserirLinhaEscalonadoPorIdade: function () {
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.push(new LimitadoresCapital(null, null, null, null));
    },

    RemoverLinhaEscalonadoPorIdade: function (i) {
        //var i = cotacao.CenariosCotacao[0].planosCondicoesComerciais[0].limitadoresCapital.length - 1;
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.splice(i, 1);
    },

    VerificaCoberturaAP: function () {
        if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].tipoModalidadeCapital.codigo == "UN") {

            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].indicadorPlanoAP = true;

            var coberturasAP = ProdutoComercial.agrupamentoCoberturaVida.flatMap(function (value) { return value.codigoCobertura });

            var coberturasSelecionadas = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.filter(function (value) {
                return value.selecionado
            });
            coberturasSelecionadas.forEach(function (v) {
                if (coberturasAP.indexOf(v.codigo) < 0) {
                    cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorSomentePlanosAP = false;
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].indicadorPlanoAP = false;
                }
            });

            var planosNaoAP = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.filter(function (value) {
                return !value.indicadorPlanoAP
            });

            if (planosNaoAP.length == 0) {
                cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorSomentePlanosAP = true;
            }

        } else {
            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].indicadorPlanoAP = false;
            cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorSomentePlanosAP = false;
        }
        if ($('#hdCotacaoId').val() > 0)
            validaOpcoesDeImportacaoDeVidas();
    },

    verificarTxtCoberturas: function (callback) {
        var executarCallback = true;

        for (var i = 0; i < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.length; i++) {
            var currentCobertura = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[i];
            var currentCenario = cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario;
            var currentPlano = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
            var coberturasAdicionais = "53,54,55,56,57,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76".split(",");
            var coberturasDiarias = "81,82,83".split(",");
            var coberturasFuneral = "77,78,88,89,90,91,92".split(",");

            if (coberturasAdicionais.includes(currentCobertura.codigoTipoCobertura + "")) {
                if (currentCobertura.selecionado && (currentCobertura.verbas[0].percentualIndenizacao == null || isNaN(currentCobertura.verbas[0].percentualIndenizacao))) {
                    $("#txt_cobertura_" + currentCobertura.codigo).addClass("input-validation-error");
                    notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + " - Cobertura " + currentCobertura.siglaTipoCobertura  + " - O campo % Ind é de preenchimento obrigatório.");

                }
            }

            if (coberturasDiarias.includes(currentCobertura.codigoTipoCobertura + "")) {
                if (currentCobertura.selecionado && (currentCobertura.verbas[0].percentualIndenizacao == null || isNaN(currentCobertura.verbas[0].percentualIndenizacao))) {

                    if ($("#txt_QtdDiarias_" + currentCobertura.codigo).val() == "") {
                        $("#txt_QtdDiarias_" + currentCobertura.codigo).addClass("input-validation-error");
                        notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + " - Cobertura " + currentCobertura.siglaTipoCobertura  + " - O campo Qtde diárias é de preenchimento obrigatório.");
                    } if ($("#txt_ValorDiarias_" + currentCobertura.codigo).val() == "") {
                        $("#txt_ValorDiarias_" + currentCobertura.codigo).addClass("input-validation-error");
                        notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + " - Cobertura " + currentCobertura.siglaTipoCobertura  + " - O campo Valor diária é de preenchimento obrigatório.");
                    }

                }

            }

            if (coberturasFuneral.includes(currentCobertura.codigoTipoCobertura + "")) {
                if (currentCobertura.selecionado && (currentCobertura.verbas[0].valorImportanciaSegurada == null || isNaN(currentCobertura.verbas[0].valorImportanciaSegurada))) {
                    $("#txt_cobertura_" + currentCobertura.codigo).addClass("input-validation-error");
                    notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + " - Cobertura " + currentCobertura.siglaTipoCobertura  + " - O campo Valor é de preenchimento obrigatório.");
                }
            }

        }

        if ($(".input-validation-error").length > 0) {
            executarCallback = false;
            carregandoPlano = false;
            $('#selectPlanoSeguro').val(cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano);
            $('#select2-selectPlanoSeguro-container').text(cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano);
            executarCallback = false;
        }

        if (executarCallback == true) {
            callback && callback();
        } else {
            $("#tabCenarios > li").removeClass("active");
            $($("#tabCenarios > li")[indexCenarioSelecionado]).addClass("active");
            closeModalWait();
        }
    },

    verificarCampoVazio: function (callback) {
        var executarCallback = true;
        var currentCenario = cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario;
        var currentPlano = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;

        if ($("#inputNomeDoPlano").val() == "") {
            $("#inputNomeDoPlano").addClass("input-validation-error");
            notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + " - Nome do plano deve ser preenchido ");
        } else {
            $('#inputNomeDoPlano').removeClass("input-validation-error");
        }


        if ($("#selectTipoModalidadeCapital").val() == 0) {
            $("#selectTipoModalidadeCapital").addClass("input-validation-error");
            notification("erro", "Cenário " + currentCenario + " - Plano " + currentPlano + "- Campo Modalidade deve ser informado.");
        } else {
            $('#selectTipoModalidadeCapital').removeClass("input-validation-error");
        }


        if ($(".input-validation-error").length > 0) {
            executarCallback = false;
            carregandoPlano = false;
            $('#selectPlanoSeguro').val(cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano);
            $('#select2-selectPlanoSeguro-container').text(cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano);
        }

        if (executarCallback == true) {
            callback && callback();
        } else {
            $("#tabCenarios > li").removeClass("active");
            $($("#tabCenarios > li")[indexCenarioSelecionado]).addClass("active");
            closeModalWait();
        }
    },

};

window.PlanosCondicoesComerciaisEvents = {

    initialize: function () {

    },

    OnChangePlano: function (plano) {
        if (changePlanoOnError) {
            changePlanoOnError = false;
        } else {
            window.PlanosCondicoesComerciaisFunctions.salvarPlano(function () {
                indexPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.findIndex(function (value) {
                    return value.numeroPlano == $(plano).val();
                });

                idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
                nomePlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].nomePlano;
                carregandoPlano = true;
                validFile = false;
                window.PlanosCondicoesComerciaisUi.limparPlanoCondicoesComerciais();
                window.PlanosCondicoesComerciaisUi.preencheCamposDoPlanoNaTela(function () {
                    carregandoPlano = false;
                });
                if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].salvo) {
                    $("#RelacaoVidasBloqueio").hide();
                    $("#RelacaoVidas").show();
                    let agrupado = $('input[name="arquivorlAgrupado"]:checked').val();
                    if (agrupado == "true") {
                        $('#text_plano_selecionado').val("Todos os Planos");
                    } else {
                        $('#text_plano_selecionado').val(idPlanoSelecionado + " - " + nomePlanoSelecionado);
                    }
                    cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada ? $("#arquivorlAgrupadoSim").attr('checked', 'checked') : $("#arquivorlAgrupadoNão").attr('checked', 'checked');
                } else {
                    $("#RelacaoVidasBloqueio").show();
                    $("#RelacaoVidas").hide();
                    cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada ? $("#arquivorlAgrupadoSim").attr('checked', 'checked') : $("#arquivorlAgrupadoNão").attr('checked', 'checked');
                }
            });
        }
    },

    OnChangeNomePlano: function (plano) {
        var nomePlano = $(plano).val();
        let agrupado = $('input[name="arquivorlAgrupado"]:checked').val();
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].nomePlano = nomePlano;
        idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
        if (agrupado == "true") {
            $('#text_plano_selecionado').val("Todos os Planos");
        } else {
            $('#text_plano_selecionado').val(idPlanoSelecionado + " - " + nomePlano);
        }
    },

    OnChangeModalidade: function (modalidade) {
        var modalidade = $(modalidade).val();

        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].tipoModalidadeCapital.codigo = modalidade;
        switch (modalidade) {
            case "ES":
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].tipoModalidadeCapital.descricao = "ESCALONADO";
                break
            case "MS":
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].tipoModalidadeCapital.descricao = "MULTIPLO SALARIAL";
                break
            case "UN":
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].tipoModalidadeCapital.descricao = "UNIFORME";
                break
            default:
                break;
        }
        if (!carregandoPlano) {
            for (var i = $("#inputEscalonadoPorIdade > div").length - 1; i > 0; i--) {
                $('#inputEscalonadoPorIdadelinha_' + i).remove();
            }
            if (modalidade == "ES") {
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].indicadorCapitalEscalonadoIdade = "N";
                $("#NaoEscalonadoPorIdade").attr("checked", "checked");
                $("#NaoEscalonadoPorIdade").change();
            }
            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital = [new LimitadoresCapital(null, null, null, null)];

        }

        window.PlanosCondicoesComerciaisUi.verificaModalidadeSeguro();
        window.PlanosCondicoesComerciaisFunctions.VerificaCoberturaAP();
    },

    OnChangeValorMultiplo: function (valorMultiplo) {
        var valor = $(valorMultiplo).val();

        if (valor == '') {
            $('#inputValorMultiplo').addClass("input-validation-error");
            invalido = 1;
            notification("erro", "Cenário " + cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario + " - Plano " + cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano + " - campo Valor Múltiplo deve ser informado.");
        } else {
            $('#inputValorMultiplo').removeClass("input-validation-error");
        }

        valor && window.PlanosCondicoesComerciaisFunctions.verificaValorMultiplo(valor, function () {
            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].valorMultiploSalarial = parseInt(valor);
        });
    },

    OnChangeValorCapitalUniforme: function (valorCapital) {
        var valor = $(valorCapital).val();
        if (valor == '') {
            $('#inputValorCapitalUniforme').addClass("input-validation-error");
            invalido = 1;
            notification("erro", "Cenário " + cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario + " - Plano " + cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano + " - Campo Valor Capital Uniforme deve ser informado.");
        } else {
            $('#inputValorCapitalUniforme').removeClass("input-validation-error");
        }
        valor = parseFloat(window.PlanosCondicoesComerciaisFunctions.trataValorMoeda(valor));
        valor && window.PlanosCondicoesComerciaisFunctions.verificaValorCapitalUniforme(valor, function () {
            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].valorCapitalUniforme = valor;
        });
    },

    OnChangeEscalonadoPorIdade: function (escalonado) {
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].indicadorCapitalEscalonadoIdade = $("input[name='EscalonadoPorIdade']:checked").val();
        window.PlanosCondicoesComerciaisUi.verificaEscalonadoPorIdade();
    },

    OnChangeIdadeInicial: function (indice) {
        var valor = parseInt($("#inputIdadeInicial_" + indice).val());
        if ((valor !== "") && !Number.isNaN(valor)) {
            window.PlanosCondicoesComerciaisFunctions.verificaIdadeInicial(indice, function () {
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice] ?
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice].idadeMinima = valor :
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice] = new LimitadoresCapital(valor, null, null, null);
            });
        }
    },

    OnChangeIdadeFinal: function (indice) {
        var valor = parseInt($("#inputIdadeFinal_" + indice).val());
        if ((valor !== "") && !Number.isNaN(valor)) {
            window.PlanosCondicoesComerciaisFunctions.verificaIdadeFinal(indice, function () {
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice] ?
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice].idadeMaxima = valor :
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice] = new LimitadoresCapital(null, valor, null, null);
            });
        }
    },

    OnChangeCapitalMinimo: function (indice) {
        var valor = $("#inputCapitalMinimo_" + indice).val();
        valor = parseFloat(window.PlanosCondicoesComerciaisFunctions.trataValorMoeda(valor));
        if ((valor !== "") && !Number.isNaN(valor)) {
            window.PlanosCondicoesComerciaisFunctions.verificaCapitalMinimo(indice, function () {
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice] ?
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice].valorCapitalMinimo = valor :
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice] = new LimitadoresCapital(null, null, valor, null);
            });
        }
    },

    OnChangeCapitalMaximo: function (indice) {
        var valor = $("#inputCapitalMaximo_" + indice).val();
        valor = parseFloat(window.PlanosCondicoesComerciaisFunctions.trataValorMoeda(valor));
        if ((valor !== "") && !Number.isNaN(valor)) {
            window.PlanosCondicoesComerciaisFunctions.verificaCapitalMaximo(indice, function () {
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice] ?
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice].valorCapitalMaximo = valor :
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital[indice] = new LimitadoresCapital(null, null, null, valor);
            });
        }
    },

    OnClickCobertura: function (idCobertura, campoCobertura) {
        for (var j = 0; j < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.length; j++) {
            if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].codigo == idCobertura) {
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].selecionado = $(campoCobertura).prop('checked');
            }
        }
    },

    OnChangeCobertura: function (idCobertura, campoCobertura) {
        window.PlanosCondicoesComerciaisUi.validacoesBaseCoberturas(idCobertura, campoCobertura);
        switch ($(campoCobertura).prop("name")) {
            case "basica":
                window.PlanosCondicoesComerciaisUi.validacoesCoberturasBasicas(idCobertura, campoCobertura);
                break;
            case "diarias":
                window.PlanosCondicoesComerciaisUi.validacoesCoberturasDiarias(campoCobertura);
                break;
            case "adicionaisFuneral":
                window.PlanosCondicoesComerciaisUi.validacoesCoberturasAdicionaisFuneral(campoCobertura);
                break;
            default:
                break;
        }
        window.PlanosCondicoesComerciaisFunctions.VerificaCoberturaAP();
    },

    OnChangePercentualCobertura: function (idCobertura, txtCobertura) {
        for (var j = 0; j < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.length; j++) {
            if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].codigo == idCobertura) {
                if ($(txtCobertura).val() == "")
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].verbas[0].percentualIndenizacao = null
                else
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].verbas[0].percentualIndenizacao = parseInt($(txtCobertura).val());
            }
        }
    },

    OnChangeQuantidadeDiarias: function (idCobertura, txtCobertura) {
        var valor = $(txtCobertura).val();
        if ((valor !== "") && !Number.isNaN(valor)) {
            for (var j = 0; j < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.length; j++) {
                if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].codigo == idCobertura) {
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].verbas[0].quantidadeDiaria = parseInt($(txtCobertura).val());
                }
            }
        }
    },

    OnChangeValorDiarias: function (idCobertura, txtCobertura) {
        var valor = $(txtCobertura).val();
        valor = parseFloat(window.PlanosCondicoesComerciaisFunctions.trataValorMoeda(valor));
        if ((valor !== "") && !Number.isNaN(valor)) {
            for (var j = 0; j < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.length; j++) {
                if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].codigo == idCobertura) {
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].verbas[0].valorDiaria = valor;
                }
            }
        }
    },

    OnChangeValorImportancia: function (idCobertura, txtCobertura) {
        var valor = $(txtCobertura).val();
        if (!valor == "") {
            valor = parseFloat(window.PlanosCondicoesComerciaisFunctions.trataValorMoeda(valor));
            if ((valor !== "") && !Number.isNaN(valor)) {
                for (var j = 0; j < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.length; j++) {
                    if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].codigo == idCobertura) {
                        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].verbas[0].valorImportanciaSegurada = valor;
                    }
                }

            }
        } else {
            for (var j = 0; j < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas.length; j++) {

                if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].codigo == idCobertura) {
                    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].coberturas[j].verbas[0].valorImportanciaSegurada = null;
                }

            }
        }
    },

    OnChangeCenario: function (indexAbaAtual, indexAbaAnterior) {

        if ($(".input-validation-error").length > 0 && ($("#tabCenarios li").length - 1) == indexAbaAtual) {
            $("#tabCenarios > li").removeClass("active");
            $($("#tabCenarios > li")[indexAbaAnterior]).addClass("active");

        } else {
            openModalWait();
            indexCenarioSelecionado = indexAbaAnterior;

            window.PlanosCondicoesComerciaisFunctions.salvarCenario(function () {
                carregandoPlano = true;
                window.PlanosCondicoesComerciaisUi.limparPlanoCondicoesComerciais();

                if ((cotacao.CenariosCotacao.length - 1) >= indexAbaAtual)
                    indexCenarioSelecionado = indexAbaAtual;

                indexPlanoSelecionado = 0;
                window.PlanosCondicoesComerciaisUi.carregarPlanosDoCenario();
                window.PlanosCondicoesComerciaisUi.preencheCamposDoPlanoNaTela(function () {
                    carregandoPlano = false;
                });
                atualizaVariaveisRelacaoVidas();
            });
        }
    },


    OnClickNovoPlano: function () {
        if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length >= ProdutoComercial.produtoComercialVida.quantidadeMaximaPlanosPorCenario) {
            notification("erro", "Quantidade total de planos por cenário não deve ser maior que " + ProdutoComercial.produtoComercialVida.quantidadeMaximaPlanosPorCenario + ".", "");
            return false;
        }

        if (cotacao._id == null) {
            $("#frmCotacao").submit();
            criarPlanoDepoisDoSubmit = true;
        } else {
            if (cotacao.CenariosCotacao[indexCenarioSelecionado].salvo) {
                window.PlanosCondicoesComerciaisFunctions.salvarPlano(function () {
                    var numeroDoPlano = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length - 1].numeroPlano + 1;
                    window.PlanosCondicoesComerciaisFunctions.adicionarPlanoCondicoesComerciais(numeroDoPlano);
                    window.PlanosCondicoesComerciaisUi.adicionarPlanoCondicoesComerciais(numeroDoPlano);
                    $('#selectPlanoSeguro').val(numeroDoPlano).trigger('change');
                });
            }
            else {
                window.PlanosCondicoesComerciaisFunctions.salvarCenario(function () {
                    var numeroDoPlano = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length - 1].numeroPlano + 1;
                    window.PlanosCondicoesComerciaisFunctions.adicionarPlanoCondicoesComerciais(numeroDoPlano);
                    window.PlanosCondicoesComerciaisUi.adicionarPlanoCondicoesComerciais(numeroDoPlano);
                    $('#selectPlanoSeguro').val(numeroDoPlano).trigger('change');
                });
            }
        }
    },

    OnClickCopiarCenario: function (abaCopiar, numeroCenario) {
        if (cotacao.CenariosCotacao.length >= ProdutoComercial.produtoComercialVida.quantidadeMaximaCenarioPorCotacao) {
            notification("erro", "Quantidade total de cenários por cotação não deve ser maior que " + ProdutoComercial.produtoComercialVida.quantidadeMaximaCenarioPorCotacao + ".", "");
            return false;
        }

        if (cotacao._id === null) {
            $("#frmCotacao").submit();
            copiarCenarioDepoisDoSubmit = true;
        } else {
            window.PlanosCondicoesComerciaisFunctions.salvarCenario(function () {
                var cenarioCopiado = JSON.parse(JSON.stringify(cotacao.CenariosCotacao.filter(function (value) { return value.numeroCenario == numeroCenario; })[0]));
                var numeroCenarioCopia = cotacao.CenariosCotacao[cotacao.CenariosCotacao.length - 1].numeroCenario + 1;
                cenarioCopiado.numeroCenario = numeroCenarioCopia;

                window.PlanosCondicoesComerciaisFunctions.copiarCenario(cenarioCopiado);
                window.PlanosCondicoesComerciaisUi.copiarCenario(abaCopiar, numeroCenarioCopia);
                atualizaVariaveisRelacaoVidas();

                $("#tabCenarios > li").removeClass("active");
                $($("#tabCenarios > li")[indexCenarioSelecionado]).addClass("active");
                //mostrar/esconder botão de exluir cenarios, dependendo da qtde de cenarios
                if (cotacao.CenariosCotacao.length === 1)
                    $($("#tabCenarios > li > a > i > i")[1]).hide();
                else
                    $($("#tabCenarios > li > a > i > i")[1]).show();
            });
        }
    },

    OnClickExcluirPlano: function (_id) {
        if (confirm("Deseja realmente remover o plano?")) {
            //verifica se existe vidas vinculadas ao plano a ser excluido
            if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas > 0) {
                if (confirm("As vidas importadas para o plano serão excluídas.")) {
                    var id = numeroDoPlano = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length - 1].numeroPlano + 1;
                    if (id != '') {

                        window.PlanosCondicoesComerciaisFunctions.excluirPlano(function () {//chamar função ajax de excluir plano
                            notification("sucesso", "Planos excluído com sucesso.", "");
                            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.splice(indexPlanoSelecionado, 1);
                            indexPlanoSelecionado = 0;
                            carregandoPlano = true;
                            calcularTotalVidasCenario();
                            window.PlanosCondicoesComerciaisUi.limparPlanoCondicoesComerciais();
                            window.PlanosCondicoesComerciaisUi.carregarPlanosDoCenario();
                            window.PlanosCondicoesComerciaisUi.preencheCamposDoPlanoNaTela(function () {
                                carregandoPlano = false;
                            });
                        });
                    } else {
                        return false;
                    }
                }
            }
            else {
                var id = numeroDoPlano = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length - 1].numeroPlano + 1;
                if (id != '') {

                    window.PlanosCondicoesComerciaisFunctions.excluirPlano(function () {//chamar função ajax de excluir plano
                        notification("sucesso", "Planos excluído com sucesso.", "");
                        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.splice(indexPlanoSelecionado, 1);
                        indexPlanoSelecionado = 0;
                        carregandoPlano = true;
                        calcularTotalVidasCenario();
                        window.PlanosCondicoesComerciaisUi.limparPlanoCondicoesComerciais();
                        window.PlanosCondicoesComerciaisUi.carregarPlanosDoCenario();
                        window.PlanosCondicoesComerciaisUi.preencheCamposDoPlanoNaTela(function () {
                            carregandoPlano = false;
                        });
                    });
                } else {
                    return false;
                }
            }
        }
    },

    OnClickAdicionarCenario: function (abaAdicionar) {
        if (cotacao.CenariosCotacao.length >= ProdutoComercial.produtoComercialVida.quantidadeMaximaCenarioPorCotacao) {
            notification("erro", "Quantidade total de cenários por cotação não deve ser maior que " + ProdutoComercial.produtoComercialVida.quantidadeMaximaCenarioPorCotacao + ".", "");
            return false;
        }

        if (cotacao._id === null) {
            $("#frmCotacao").submit();
            criarCenarioDepoisDoSubmit = true;
        } else {
            if ($(".input-validation-error").length > 1) {
                window.PlanosCondicoesComerciaisFunctions.verificarCampoVazio()
            } else {
                window.PlanosCondicoesComerciaisFunctions.salvarCenario(function () {


                    var numeroCenario = cotacao.CenariosCotacao[cotacao.CenariosCotacao.length - 1].numeroCenario + 1;
                    window.PlanosCondicoesComerciaisUi.adicionarCenario(abaAdicionar, numeroCenario, true);
                    window.PlanosCondicoesComerciaisFunctions.adicionarCenario(numeroCenario); // novo metodo copiar
                    window.PlanosCondicoesComerciaisUi.limparPlanoCondicoesComerciais();
                    window.PlanosCondicoesComerciaisUi.carregarPlanosDoCenario();
                    window.PlanosCondicoesComerciaisUi.preencheCamposDoPlanoNaTela();
                    window.PlanosCondicoesComerciaisUi.liberaImportacaoVidas(false);

                    $("#tabCenarios > li").removeClass("active");
                    $($("#tabCenarios > li")[indexCenarioSelecionado]).addClass("active");

                    atualizaVariaveisRelacaoVidas();

                    //mostrar/esconder botão de exluir cenarios, dependendo da qtde de cenarios
                    if (cotacao.CenariosCotacao.length == 1)
                        $($("#tabCenarios > li > a > i > i")[1]).hide()
                    else
                        $($("#tabCenarios > li > a > i > i")[1]).show()
                });
            }
        }
    },

    OnClickExcluirCenario: function (aba, numeroCenario) {
        //TODO: Popup solicitando confirmação
        if (cotacao.CenariosCotacao[indexCenarioSelecionado].salvo) {
            window.PlanosCondicoesComerciaisFunctions.excluirCenario(numeroCenario, function () {//chamar função ajax de excluir plano

                var cenarioRemovido = cotacao.CenariosCotacao.filter(function (value) {
                    return value.numeroCenario == numeroCenario;
                });

                indexCenarioSelecionado = 0;
                indexPlanoSelecionado = 0;

                cotacao.CenariosCotacao.splice($.inArray(cenarioRemovido[0], cotacao.CenariosCotacao), 1);
                window.PlanosCondicoesComerciaisUi.removerCenario(aba);
                window.PlanosCondicoesComerciaisUi.preencheCamposDoPlanoNaTela();

                $("#tabCenarios > li").removeClass("active");
                $($("#tabCenarios > li")[0]).addClass("active");

                //mostrar/esconder botão de exluir cenarios, dependendo da qtde de cenarios
                if (cotacao.CenariosCotacao.length == 1)
                    $($("#tabCenarios > li > a > i > i")[1]).hide()
                else
                    $($("#tabCenarios > li > a > i > i")[1]).show()

                //carregar os planos da aba selecionada
                window.PlanosCondicoesComerciaisUi.carregarPlanosDoCenario();
            });
        }
        else {
            var cenarioRemovido = cotacao.CenariosCotacao.filter(function (value) {
                return value.numeroCenario == numeroCenario;
            });
            cotacao.CenariosCotacao.splice($.inArray(cenarioRemovido[0], cotacao.CenariosCotacao), 1);
            window.PlanosCondicoesComerciaisUi.removerCenario(aba);
        }

        indexCenarioSelecionado = 0;
        indexPlanoSelecionado = 0;
        atualizaVariaveisRelacaoVidas();

        $("#tabCenarios > li").removeClass("active");
        //marcar a primeira aba do cenario como selecionado
        $($("#tabCenarios > li")[0]).addClass("active");

        //carregar os planos da aba selecionada
        window.PlanosCondicoesComerciaisUi.carregarPlanosDoCenario();
        window.PlanosCondicoesComerciaisUi.preencheCamposDoPlanoNaTela();

    },

    OnClickInserirLinhaEscalonadoPorIdade: function () {
        if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.length == 0) {
            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.push(new LimitadoresCapital(null, null, null, null));
        }
        window.PlanosCondicoesComerciaisFunctions.InserirLinhaEscalonadoPorIdade();
        window.PlanosCondicoesComerciaisUi.InserirLinhaEscalonadoPorIdade();
        window.PlanosCondicoesComerciaisUi.addMasks();
    },

    OnClickRemoverLinhaEscalonadoPorIdade: function () {
        if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.length > 0) {
            var i = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].limitadoresCapital.length - 1;
            window.PlanosCondicoesComerciaisUi.RemoverLinhaEscalonadoPorIdade(i);
            window.PlanosCondicoesComerciaisFunctions.RemoverLinhaEscalonadoPorIdade(i);

        }
    }
};
