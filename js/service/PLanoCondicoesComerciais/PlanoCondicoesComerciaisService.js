$(document).ready(function () {

    $('#inputIdadeInicial_0').mask('999');
    $('#inputIdadeFinal_0').mask('999');
    $('#inputCapitalMinimo_0').maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });
    $('#inputCapitalMaximo_0').maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });
    $('#inputValorCapitalUniforme').maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });
    $('#inputValorMultiplo').mask('999');

    $("#NaoEscalonadoPorIdade").prop('checked', true);
    carregaCoberturasDaTela();
    $("#btnSalvar").hover(salvarPlanoCondicoesComerciais());
    $("#btnSalvar").click(function () {
        salvarPlanoCondicoesComerciais();
        gravaDadosPlanoCondicoesComerciais();
    });
    //window.PlanosCondicoesComerciaisUi.verificaModalidadeSeguro();
    verificaEscalonadoPorIdade();
});

//classes
var PlanoCondicoesComerciais = /** @class */ (function () {
    function PlanoCondicoesComerciais(cotacao, numero, nome, modalidadeCapital, capitalUniforme, capitalEscalonadoIdade, multiploSalarial, vidas, pMasculino, pFeminino, iMedia, lCapital, cobertura) {
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
        this.cobertura = cobertura;
    }
    return PlanoCondicoesComerciais;
}());

var TipoModalidadeCapital = (function () {
    function TipoModalidadeCapital() {
        this.codigo;
        this.descricao;
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
    function Cobertura(codigo, codigoTipoCobertura, nome, verbas) {
        this.codigo = codigo;
        this.codigoTipoCobertura = codigoTipoCobertura;
        this.nome = nome;
        this.verbas = verbas;
    }
    return Cobertura;
}());

var Verba = (function () {
    function Verba(codigo, nome, valorImportanciaSegura, valorTotalPremio, percentualIndenizacao, quantidadeDiaria, valorDiaria, coeficienteTaxaLiberty, coeficienteTaxaResseguro, coeficienteTaxaComercial) {
        this.codigo = codigo;
        this.nome = nome;
        this.valorImportanciaSegura = valorImportanciaSegura;
        this.valorTotalPremio = valorTotalPremio;
        this.percentualIndenizacao = percentualIndenizacao;
        this.quantidadeDiaria = quantidadeDiaria;
        this.valorDiaria = valorDiaria;
        this.coeficienteTaxaLiberty = coeficienteTaxaLiberty;
        this.coeficienteTaxaResseguro = coeficienteTaxaResseguro;
        this.coeficienteTaxaComercial = coeficienteTaxaComercial;
    }
    return Verba;
}());

//Variaveis globais
var planoComercialPadrao = new PlanoCondicoesComerciais("", 1, "");
var planosCondicoesComerciais = [planoComercialPadrao];
var indiceEscalonadoPorIdade = 0;
var indicePlanosCondicoesComerciais = 0;
var coberturas = [];
var ultimoPlanoSalvo = "0";

//grava os dados dos Planos de Condiçoes Comerciais no model de cotacao
function gravaDadosPlanoCondicoesComerciais() {
    $("#DadosPlanosCondicoesComerciais").empty();

    for (x = 0; x < planos.length; x++) {
        if (planos[x].NumeroPlano != null)
            if ($("#rd_relacao_vidas_Simpl").prop("checked") == true)
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + x + "].TotalVidas' type='hidden' value='" + planos[x].TotalVidas + "'>");
            else
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + x + "].TotalVidas' type='hidden' value='" + $("#text_rl_TotalVidasPlano").val() + "'>");
    }

    var i = 0;
    if (planosCondicoesComerciais != undefined) {

        //for (let p = 1; p <= planosCondicoesComerciais.length; p++) {
        //    i = (p - 1);
        for (let p = 0; p < planosCondicoesComerciais.length; p++) {
            i = p;
            $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].NumeroPlano' type='hidden' value='" + planosCondicoesComerciais[i].numeroPlano + "'>");
            $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].NomePlano' type='hidden' value='" + planosCondicoesComerciais[i].nomePlano + "'>");
            $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].IndicadorPlanoAP' type='hidden' value='" + $('input[name="rd_relacao_vidas"]:checked').val() + "'>");

            $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].TipoModalidadeCapital.Codigo' type='hidden' value='" + planosCondicoesComerciais[i].tipoModalidadeCapital + "'>");
            let descricaoModalidade = "";
            if (planosCondicoesComerciais[i].tipoModalidadeCapital == "UN") {
                descricaoModalidade = "UNIFORME";
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].ValorCapitalUniforme' type='hidden' value='" + planosCondicoesComerciais[i].valorCapitalUniforme + "'>");
            } else if (planosCondicoesComerciais[i].tipoModalidadeCapital == "ES") {
                descricaoModalidade = "ESCALONADO";
                if (planosCondicoesComerciais[i].indicadorCapitalEscalonadoIdade == "true") {
                    $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].IndicadorCapitalEscalonadoIdade' type='hidden' value='S'>");
                    if (planosCondicoesComerciais[i].limitadoresCapital != null) {
                        for (let e = 0; e < planosCondicoesComerciais[i].limitadoresCapital.length; e++) {
                            $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].LimitadoresCapital[" + e + "].IdadeMinima' type='hidden' value='" + planosCondicoesComerciais[i].limitadoresCapital[e].idadeMinima + "'>");
                            $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].LimitadoresCapital[" + e + "].IdadeMaxima' type='hidden' value='" + planosCondicoesComerciais[i].limitadoresCapital[e].idadeMaxima + "'>");
                            $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].LimitadoresCapital[" + e + "].ValorCapitalMinimo' type='hidden' value='" + planosCondicoesComerciais[i].limitadoresCapital[e].valorCapitalMinimo + "'>");
                            $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].LimitadoresCapital[" + e + "].ValorCapitalMaximo' type='hidden' value='" + planosCondicoesComerciais[i].limitadoresCapital[e].valorCapitalMaximo + "'>");
                        }
                    }
                }
            } else if (planosCondicoesComerciais[i].tipoModalidadeCapital == "MS") {
                descricaoModalidade = "MULTIPLO SALARIAL";
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].ValorMultiploSalarial' type='hidden' value='" + planosCondicoesComerciais[i].valorMultiploSalarial + "'>");
            }

            if (planosCondicoesComerciais[i].indicadorCapitalEscalonadoIdade != "true") {
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].IndicadorCapitalEscalonadoIdade' type='hidden' value='N'>");
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].LimitadoresCapital[0].IdadeMinima' type='hidden' value='" + ProdutoComercial.produtoComercialVida.idadeMinimoContrato + "'>");
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].LimitadoresCapital[0].IdadeMaxima' type='hidden' value='" + ProdutoComercial.produtoComercialVida.idadeMaximoContrato + "'>");
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].LimitadoresCapital[0].ValorCapitalMinimo' type='hidden' value='" + ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato + "'>");
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].LimitadoresCapital[0].ValorCapitalMaximo' type='hidden' value='" + ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato + "'>");
            }

            $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].TipoModalidadeCapital.Descricao' type='hidden' value='" + descricaoModalidade + "'>");
            for (let c = 0; c < planosCondicoesComerciais[i].cobertura.length; c++) {
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].Coberturas[" + c + "].Codigo' type='hidden' value='" + planosCondicoesComerciais[i].cobertura[c].codigo + "'>");
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].Coberturas[" + c + "].CodigoTipoCobertura' type='hidden' value='" + planosCondicoesComerciais[i].cobertura[c].codigoTipoCobertura + "'>");
                $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].Coberturas[" + c + "].Nome' type='hidden' value='" + planosCondicoesComerciais[i].cobertura[c].nome + "'>");
                for (let v = 0; v < planosCondicoesComerciais[i].cobertura[c].verbas.length; v++) {
                    $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].Coberturas[" + c + "].Verbas[" + v + "].Codigo' type='hidden' value='" + planosCondicoesComerciais[i].cobertura[c].verbas[v].codigo + "'>");
                    if (planosCondicoesComerciais[i].cobertura[c].verbas[v].valorImportanciaSegura != undefined) {
                        $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].Coberturas[" + c + "].Verbas[" + v + "].ValorImportanciaSegurada' type='hidden' value='" + planosCondicoesComerciais[i].cobertura[c].verbas[v].valorImportanciaSegura + "'>");
                    }
                    if (planosCondicoesComerciais[i].cobertura[c].verbas[v].percentualIndenizacao != undefined) {
                        $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].Coberturas[" + c + "].Verbas[" + v + "].PercentualIndenizacao' type='hidden' value='" + planosCondicoesComerciais[i].cobertura[c].verbas[v].percentualIndenizacao + "'>");
                    }
                    if (planosCondicoesComerciais[i].cobertura[c].verbas[v].valorDiaria != undefined) {
                        $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].Coberturas[" + c + "].Verbas[" + v + "].ValorDiaria' type='hidden' value='" + planosCondicoesComerciais[i].cobertura[c].verbas[v].valorDiaria + "'>");
                    }
                    if (planosCondicoesComerciais[i].cobertura[c].verbas[v].percentualIndenizacao != undefined) {
                        $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].Coberturas[" + c + "].Verbas[" + v + "].PercentualIndenizacao' type='hidden' value='" + planosCondicoesComerciais[i].cobertura[c].verbas[v].percentualIndenizacao + "'>");
                    }
                    if (planosCondicoesComerciais[i].cobertura[c].verbas[v].quantidadeDiaria != undefined) {
                        $("#DadosPlanosCondicoesComerciais").append("<input name='PlanosCondicoesComerciais[" + p + "].Coberturas[" + c + "].Verbas[" + v + "].QuantidadeDiaria' type='hidden' value='" + planosCondicoesComerciais[i].cobertura[c].verbas[v].quantidadeDiaria + "'>");
                    }
                }
            }
        }
    }
}

function adicionarPlanoCondicoesComerciais() {
    salvarPlanoCondicoesComerciais();
    var planoComercialTemporario = new PlanoCondicoesComerciais("", (parseInt(planosCondicoesComerciais[planosCondicoesComerciais.length - 1].numeroPlano) + 1), "");
    $('#selectPlanoSeguro').append('<option value="' + planoComercialTemporario.numeroPlano + '">' + planoComercialTemporario.numeroPlano + '</option>');
    limparPlanoCondicoesComerciais();
    carregaCamposPlanoCondicoesComerciais(planoComercialTemporario);
    salvarPlanoCondicoesComerciais();
    ultimoPlanoSalvo = planoComercialTemporario.numeroPlano;
    //onDropDownListPlanosRelacaoVida();
}

function removerPlanoCondicoesComerciais() {
    var indice = (parseInt($('#selectPlanoSeguro').val()) - 1);
    if ((planosCondicoesComerciais[indice] == undefined) || (planosCondicoesComerciais.length == 1)) {
        carregaCamposPlanoCondicoesComerciais(planosCondicoesComerciais[0]);
    } else {
        $("#selectPlanoSeguro option").remove();

        if (planosCondicoesComerciais[indice].numeroCotacao >= 0) {
            excluirPlanoCondicoesComerciais(planosCondicoesComerciais[indice].numeroCotacao, planosCondicoesComerciais[indice].numeroPlano);
        }

        planosCondicoesComerciais.splice(indice, 1);
        for (let i = 0; i < planosCondicoesComerciais.length; i++) {
            $('#selectPlanoSeguro').append('<option value="' + planosCondicoesComerciais[i].numeroPlano + '">' + planosCondicoesComerciais[i].numeroPlano + '</option>');
        }
        carregaCamposPlanoCondicoesComerciais(planosCondicoesComerciais[0]);
    }
}

function limparPlanoCondicoesComerciais() {
    var planoCondicoesComerciaisVazio = new PlanoCondicoesComerciais("", $('#selectPlanoSeguro').val(), "", "0", null, null, null, null, null, null, null, null, null);
    carregaCamposPlanoCondicoesComerciais(planoCondicoesComerciaisVazio);
    $('#selectTipoModalidadeCapital').val("0");
    $('#select2-selectTipoModalidadeCapital-container').prop("title", "SELECIONE UMA OPÇÃO");
    $('#select2-selectTipoModalidadeCapital-container').text("SELECIONE UMA OPÇÃO");
    for (let c = 0; c < coberturas.length; c++) {
        $("#chk_cobertura_" + coberturas[c].codigo).prop('checked', false);
        limpaCampoDeCobertura(coberturas[c].codigo);
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
}

function salvarPlanoCondicoesComerciais() {
    let numero = $('#selectPlanoSeguro').val();
    let nome = $('#inputNomeDoPlano').val();
    let modalidadeCapital = $('#selectTipoModalidadeCapital').val();
    let capitalUniforme = null;
    let capitalEscalonadoIdade = null;
    let multiploSalarial = null;
    let vidas = null;
    let pMasculino = null;
    let pFeminino = null;
    let iMedia = null;
    let lCapital = [];
    let cobertura = [];

    var indice = (parseInt($('#selectPlanoSeguro').val()) - 1);

    $('[id*="txt_ValorDiarias_"]').each(function () {
        $(this).val(converterMoedaParaDecimal($(this).val()));
    });

    $('.valorImportanciaSegurada').each(function () {
        if (!$(this).is('[readOnly]')) {
            $(this).val(converterMoedaParaDecimalComQuatroCasas($(this).val()));
        }
    });

    switch (modalidadeCapital) {
        case "ES":
            if ($("#SimEscalonadoPorIdade").prop('checked') == true) {
                capitalEscalonadoIdade = "true";
            } else {
                capitalEscalonadoIdade = "false";
            }
            break;
        case "MS":
            multiploSalarial = $('#inputValorMultiplo').val();
            break;
        case "UN":
            capitalUniforme = converterMoedaParaDecimal($('#inputValorCapitalUniforme').val());
            break;
        default:
    }
    for (let i = 0; i < coberturas.length; i++) {
        if ($("#chk_cobertura_" + coberturas[i].codigo).prop('checked')) {
            cobertura.push(new Cobertura(coberturas[i].codigo, coberturas[i].codigoTipoCobertura, coberturas[i].nome, [new Verba(coberturas[i].verbas[0].codigo, coberturas[i].verbas[0].nome, $("#hd_cobertura_valorImportanciaSegurada_" + coberturas[i].codigo).val() === undefined ? null : converterMoedaParaDecimalComQuatroCasas($("#hd_cobertura_valorImportanciaSegurada_" + coberturas[i].codigo).val()), null, $("#hd_cobertura_percentualIndenizacao_" + coberturas[i].codigo).val(), $("#txt_QtdDiarias_" + coberturas[i].codigo).val() === undefined ? null : $("#txt_QtdDiarias_" + coberturas[i].codigo).val(), $("#txt_ValorDiarias_" + coberturas[i].codigo).val() === undefined ? null : converterMoedaParaDecimal($("#txt_ValorDiarias_" + coberturas[i].codigo).val()))]));
        }
    }
    for (let e = 0; e < 200; e++) {
        if ($('#inputEscalonadoPorIdadelinha_' + e).val() == undefined) {
            e = 200;
        } else {
            lCapital.push(new LimitadoresCapital($("#inputIdadeInicial_" + e).val(), $("#inputIdadeFinal_" + e).val(), converterMoedaParaDecimal($("#inputCapitalMinimo_" + e).val()), converterMoedaParaDecimal($("#inputCapitalMaximo_" + e).val())));
        }
    }

    //cobertura = coberturas;
    var planoComercialTemporario = new PlanoCondicoesComerciais("", numero, nome, modalidadeCapital, capitalUniforme, capitalEscalonadoIdade, multiploSalarial, vidas, pMasculino, pFeminino, iMedia, lCapital, cobertura);
    if (planosCondicoesComerciais[indice] == undefined) {
        planosCondicoesComerciais.push(planoComercialTemporario);
    } else {
        planosCondicoesComerciais[indice] = planoComercialTemporario;
    }
    ultimoPlanoSalvo = numero;
    //gravaDadosPlanoCondicoesComerciais();
    // onDropDownListPlanosRelacaoVida();
}

//function onDropDownListPlanosRelacaoVida() {
//    let _idCotacao = $('#hdCotacaoId').val();
//    if (_idCotacao > 0) {
//        if ((typeof planosCondicoesComerciais != "undefined") && planosCondicoesComerciais.length >= 1) {
//            for (let i = 0; i < planosCondicoesComerciais.length - 1; i++) {
//                var optn = document.createElement("OPTION");
//                optn.text = planosCondicoesComerciais[i].nomePlano;
//                optn.value = planosCondicoesComerciais[i].numeroPlano;
//                select_rl_Planos.options.add(optn);
//            }
//        }
//    }
//}

function converterMoedaParaDecimal(moeda) {
    moeda = moeda.replace(/\./g, "");
    moeda = moeda.replace(" ", "");
    moeda = moeda.replace("R$", "");
    moeda = moeda.replace(",", ".");
    return moeda;
}

function converterMoedaParaDecimalComQuatroCasas(moeda) {
    moeda = moeda.replace(/\./g, "");
    moeda = moeda.replace(" ", "");
    moeda = moeda.replace("R$", "");
    moeda = moeda.replace(",", ".");
    moeda = parseFloat(moeda).toFixed(4);
    return moeda;
}

function converterDecimalParaMoeda(numero) {
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
}

function salvarPlanoCondicoesComerciaisAnterior(indice) {
    let numero = indice.toString(); //$('#selectPlanoSeguro').val();
    let nome = $('#inputNomeDoPlano').val();
    let modalidadeCapital = $('#selectTipoModalidadeCapital').val();
    let capitalUniforme = null;
    let capitalEscalonadoIdade = null;
    let multiploSalarial = null;
    let vidas = null;
    let pMasculino = null;
    let pFeminino = null;
    let iMedia = null;
    let lCapital = [];
    let cobertura = [];

    //var indice = (parseInt($('#selectPlanoSeguro').val()) - 1);

    switch (modalidadeCapital) {
        case "ES":
            if ($("#SimEscalonadoPorIdade").prop('checked') == true) {
                capitalEscalonadoIdade = "true";
            } else {
                capitalEscalonadoIdade = "false";
            }
            break;
        case "MS":
            multiploSalarial = $('#inputValorMultiplo').val();
            break;
        case "UN":
            capitalUniforme = converterMoedaParaDecimal($('#inputValorCapitalUniforme').val());
            break;
        default:
    }
    for (let i = 0; i < coberturas.length; i++) {
        if ($("#chk_cobertura_" + coberturas[i].codigo).prop('checked')) {
            let percentual = null;
            let importancia = null;
            if ((coberturas[i].codigo == 93020) || (coberturas[i].codigo == "93020") || (coberturas[i].codigo == 93111) || (coberturas[i].codigo == "93111") || (coberturas[i].codigo == 93110) || (coberturas[i].codigo == "93110") || (coberturas[i].codigo == 93021) || (coberturas[i].codigo == "93021") || (coberturas[i].codigo == 81030) || (coberturas[i].codigo == "81030")) {
                percentual = 100;
            } else if ((coberturas[i].codigo == 93036) || (coberturas[i].codigo == "93036") || (coberturas[i].codigo == 93037) || (coberturas[i].codigo == "93037") || (coberturas[i].codigo == 93101) || (coberturas[i].codigo == "93101") || (coberturas[i].codigo == 29006) || (coberturas[i].codigo == "29006") || (coberturas[i].codigo == 29005) || (coberturas[i].codigo == "29005") || (coberturas[i].codigo == 29016) || (coberturas[i].codigo == "29016") || (coberturas[i].codigo == 29017) || (coberturas[i].codigo == "29017")) {
                importancia = $("#txt_cobertura_" + coberturas[i].codigo).val();
            } else {
                if ($("#txt_cobertura_" + coberturas[i].codigo).val() != undefined) {
                    percentual = $("#txt_cobertura_" + coberturas[i].codigo).val();
                }
            }
            cobertura.push(new Cobertura(coberturas[i].codigo, coberturas[i].codigoTipoCobertura, coberturas[i].nome, [new Verba(coberturas[i].verbas[0].codigo, coberturas[i].verbas[0].nome, importancia, null, percentual, $("#txt_QtdDiarias_" + coberturas[i].codigo).val() == undefined ? null : $("#txt_QtdDiarias_" + coberturas[i].codigo).val(), $("#txt_ValorDiarias_" + coberturas[i].codigo).val() == undefined ? null : $("#txt_ValorDiarias_" + coberturas[i].codigo).val())]));
        }
    }
    for (let e = 0; e < 200; e++) {
        if ($('#inputEscalonadoPorIdadelinha_' + e).val() == undefined) {
            e = 200;
        } else {
            lCapital.push(new LimitadoresCapital($("#inputIdadeInicial_" + e).val(), $("#inputIdadeFinal_" + e).val(), converterMoedaParaDecimal($("#inputCapitalMinimo_" + e).val()), converterMoedaParaDecimal($("#inputCapitalMaximo_" + e).val())));
        }
    }

    //cobertura = coberturas;
    var planoComercialTemporario = new PlanoCondicoesComerciais("", numero, nome, modalidadeCapital, capitalUniforme, capitalEscalonadoIdade, multiploSalarial, vidas, pMasculino, pFeminino, iMedia, lCapital, cobertura);
    for (let p = 0; p < planosCondicoesComerciais.length; p++) {
        if (planosCondicoesComerciais[p].numeroPlano == indice.toString()) {
            planosCondicoesComerciais[p] = planoComercialTemporario;
        }
    }
    ultimoPlanoSalvo = numero;
    //gravaDadosPlanoCondicoesComerciais();
    //onDropDownListPlanosRelacaoVida();
}

function carregaCamposPlanoCondicoesComerciais(planoCondicoesComerciais) {
    $('#selectPlanoSeguro').val(planoCondicoesComerciais.numeroPlano);
    let indicePlano = (planoCondicoesComerciais.numeroPlano - 1);
    $('#inputNomeDoPlano').val(planoCondicoesComerciais.nomePlano);

    if (planoCondicoesComerciais.tipoModalidadeCapital === "ES") {
        $('#select2-selectTipoModalidadeCapital-container').prop("title", " ESCALONADO ");
        $('#select2-selectTipoModalidadeCapital-container').text(" ESCALONADO ");
        $('#selectTipoModalidadeCapital').val("ES");
        if (planoCondicoesComerciais.indicadorCapitalEscalonadoIdade === "S") {
            $("#SimEscalonadoPorIdade").prop('checked', true);
            for (let l = 0; l < planoCondicoesComerciais.limitadoresCapital.length; l++) {
                if (l == 0) {
                    $("#inputIdadeInicial_" + l).val(planoCondicoesComerciais.limitadoresCapital[l].idadeMinima);
                    $("#inputIdadeFinal_" + l).val(planoCondicoesComerciais.limitadoresCapital[l].idadeMaxima);
                    $("#inputCapitalMinimo_" + l).val(converterDecimalParaMoeda(planoCondicoesComerciais.limitadoresCapital[l].valorCapitalMinimo));
                    $("#inputCapitalMaximo_" + l).val(converterDecimalParaMoeda(planoCondicoesComerciais.limitadoresCapital[l].valorCapitalMaximo));
                    $("#inputCapitalMinimo_" + l).maskMoney({
                        prefix: "R$ ",
                        decimal: ",",
                        thousands: "."
                    });
                    $("#inputCapitalMaximo_" + l).maskMoney({
                        prefix: "R$ ",
                        decimal: ",",
                        thousands: "."
                    });
                } else {
                    inserirInputEscalonadoPorIdadelinhaPreenchida(l, planoCondicoesComerciais.limitadoresCapital[l].idadeMinima, planoCondicoesComerciais.limitadoresCapital[l].idadeMaxima, planoCondicoesComerciais.limitadoresCapital[l].valorCapitalMinimo, planoCondicoesComerciais.limitadoresCapital[l].valorCapitalMaximo);
                }
            }
        } else {
            $("#NaoEscalonadoPorIdade").prop('checked', true);
        }
    } else if (planoCondicoesComerciais.tipoModalidadeCapital === "MS") {
        $('#select2-selectTipoModalidadeCapital-container').prop("title", " MULTIPLO SALARIAL ");
        $('#select2-selectTipoModalidadeCapital-container').text(" MULTIPLO SALARIAL ");
        $('#selectTipoModalidadeCapital').val("MS");
        $('#inputValorMultiplo').val(planoCondicoesComerciais.valorMultiploSalarial);
        $('#inputValorMultiplo').focus();
    } else if (planoCondicoesComerciais.tipoModalidadeCapital === "UN") {
        $('#select2-selectTipoModalidadeCapital-container').prop("title", " UNIFORME ");
        $('#select2-selectTipoModalidadeCapital-container').text(" UNIFORME ");
        $('#selectTipoModalidadeCapital').val("UN");
        $('#inputValorCapitalUniforme').val(planoCondicoesComerciais.valorCapitalUniforme);
        $('#inputValorCapitalUniforme').focus();
    } else {
        $('#select2-selectTipoModalidadeCapital-container').prop("title", "SELECIONE UMA OPÇÃO");
        $('#select2-selectTipoModalidadeCapital-container').text("SELECIONE UMA OPÇÃO");
        $('#selectTipoModalidadeCapital').val("0");
    }
    verificaModalidadeSeguro();
    verificaEscalonadoPorIdade();
    if (planoCondicoesComerciais.cobertura != null) {
        for (let co = 0; co < planoCondicoesComerciais.cobertura.length; co++) {
            $("#chk_cobertura_" + planoCondicoesComerciais.cobertura[co].codigo).prop('checked', true);
            if (planoCondicoesComerciais.cobertura[co].verbas[0].quantidadeDiaria != null) {
                $("#txt_QtdDiarias_" + planoCondicoesComerciais.cobertura[co].codigo).val(planoCondicoesComerciais.cobertura[co].verbas[0].quantidadeDiaria);
            }
            if (planoCondicoesComerciais.cobertura[co].verbas[0].valorDiaria != null) {
                $("#txt_ValorDiarias_" + planoCondicoesComerciais.cobertura[co].codigo).val(planoCondicoesComerciais.cobertura[co].verbas[0].valorDiaria);
            }
            if (planoCondicoesComerciais.cobertura[co].verbas[0].valorImportanciaSegura != null) {
                $("#txt_cobertura_" + planoCondicoesComerciais.cobertura[co].codigo).val(planoCondicoesComerciais.cobertura[co].verbas[0].valorImportanciaSegura);
            }
            if (planoCondicoesComerciais.cobertura[co].verbas[0].valorTotalPremio != null) {
                $("#txt_cobertura_" + planoCondicoesComerciais.cobertura[co].codigo).val(planoCondicoesComerciais.cobertura[co].verbas[0].valorTotalPremio);
            }
        }
    }

    planosCondicoesComerciais.push(planoCondicoesComerciais);
}

function carregaCoberturasDaTela() {
    for (let c = 0; c < 999; c++) {
        if ($("#PlanosCondicoesComerciais_0__Coberturas_" + c + "__Codigo").val() == undefined) {
            if (c < 6) {
                continue;
            } else {
                c = 999;
            }
        } else {
            let verbas = [new Verba($("#PlanosCondicoesComerciais_0__Coberturas_" + c + "__Verbas_0__Codigo").val(), $("#PlanosCondicoesComerciais_0__Coberturas_" + c + "__Verbas_0__Nome").val())];
            coberturas.push(new Cobertura($("#PlanosCondicoesComerciais_0__Coberturas_" + c + "__Codigo").val(), $("#PlanosCondicoesComerciais_0__Coberturas_" + c + "__CodigoTipoCobertura").val(), $("#PlanosCondicoesComerciais_0__Coberturas_" + c + "__Nome").val(), verbas));
        }
    }
}

function verificaPlanoSeguro() {
    if (($('#hdCotacaoId').val() !== "") && ($('#hdCotacaoId').val() !== undefined)) {
        atualizarCamposDoPlanoComDadosDaModel();
    } else {

        var indice = (parseInt($('#selectPlanoSeguro').val()) - 1);
        if (planosCondicoesComerciais[indice] != undefined) {
            salvarPlanoCondicoesComerciaisAnterior(ultimoPlanoSalvo);
            limparPlanoCondicoesComerciais();
            carregaCamposPlanoCondicoesComerciais(planosCondicoesComerciais[indice]);
        } else {
            limparPlanoCondicoesComerciais();
        }
        ultimoPlanoSalvo = $('#selectPlanoSeguro').val();
        //onDropDownListPlanosRelacaoVida();
    }
}

function inserirInputEscalonadoPorIdadelinha(indice) {
    let invalido = 0;
    verificaIdadeInicial(indice);
    verificaIdadeFinal(indice);
    verificaCapitalMinimo(indice);
    verificaCapitalMinimo(indice);
    if ($("#inputIdadeInicial_" + indice).val() === "") {
        $('#inputIdadeInicial_' + indice).addClass("input-validation-error");
        notification("erro", "O campo de Idade Inicial deve ser preenchido", $(this).attr("id"));
        invalido = 1;
    }
    if ($('#inputIdadeFinal_' + indice).val() === "") {
        $('#inputIdadeFinal_' + indice).addClass("input-validation-error");
        invalido = 1;
        notification("erro", "O campo de Idade Final deve ser preenchido", $(this).attr("id"));
    }
    if ($('#inputCapitalMinimo_' + indice).val() === "") {
        $('#inputCapitalMinimo_' + indice).addClass("input-validation-error");
        invalido = 1;
        notification("erro", "O campo de Capital Mínimo deve ser preenchido", $(this).attr("id"));
    }
    if ($('#inputCapitalMaximo_' + indice).val() === "") {
        $('#inputCapitalMaximo_' + indice).addClass("input-validation-error");
        invalido = 1;
        notification("erro", "O campo de Capital Máximo deve ser preenchido", $(this).attr("id"));
    }

    if ((invalido === 0) && !($('#inputCapitalMaximo_' + indice).hasClass("input-validation-error")) && !($('#inputIdadeInicial_' + indice).hasClass("input-validation-error")) && !($('#inputIdadeFinal_' + indice).hasClass("input-validation-error")) && !($('#inputCapitalMinimo_' + indice).hasClass("input-validation-error"))) {
        indiceEscalonadoPorIdade++;
        indice++;
        $("#inputEscalonadoPorIdade").append('<div id="inputEscalonadoPorIdadelinha_' + indice + '" class="col-md-12 col-sm-12"><div class="form-group col-md-3 col-sm-3 col-xs-12"><input onfocusout="verificaIdadeInicial(' + indice + ')" class="form-control" maxlength="3" type="text" id="inputIdadeInicial_' + indice + '" placeholder="Idade Inicial"></div><div class="form-group col-md-3 col-sm-3 col-xs-12"><input onfocusout="verificaIdadeFinal(' + indice + ')" class="form-control" maxlength="3" type="text" id="inputIdadeFinal_' + indice + '" placeholder="Idade final"></div><div class="form-group col-md-3 col-sm-3 col-xs-12"><input onfocusout="verificaCapitalMinimo(' + indice + ')" class="form-control" maxlength="20" type="text" id="inputCapitalMinimo_' + indice + '" placeholder="Capital mínimo"></div><div class="form-group col-md-3 col-sm-3 col-xs-12"><input onfocusout="verificaCapitalMaximo(' + indice + ')" class="form-control" maxlength="20" type="text" id="inputCapitalMaximo_' + indice + '" placeholder="Capital máximo"></div></div>');
        $('#inputIdadeInicial_' + indice).mask('999');
        $('#inputIdadeFinal_' + indice).mask('999');
        $('#inputCapitalMinimo_' + indice).maskMoney({
            prefix: "R$ ",
            decimal: ",",
            thousands: "."
        });
        $('#inputCapitalMaximo_' + indice).maskMoney({
            prefix: "R$ ",
            decimal: ",",
            thousands: "."
        });
    } else {
        notification("erro", "Para inclusão da faixa é necessário o preenchimento de todos os campos.", $(this).attr("id"));
    }
}

function inserirInputEscalonadoPorIdadelinhaPreenchida(indice, iminima, imaxima, cminima, cmaxima) {
    $("#inputEscalonadoPorIdade").append('<div id="inputEscalonadoPorIdadelinha_' + indice + '" class="col-md-12 col-sm-12"><div class="form-group col-md-3 col-sm-3 col-xs-12"><input onfocusout="verificaIdadeInicial(' + indice + ')" class="form-control" maxlength="3" type="text" id="inputIdadeInicial_' + indice + '" placeholder="Idade Inicial"></div><div class="form-group col-md-3 col-sm-3 col-xs-12"><input onfocusout="verificaIdadeFinal(' + indice + ')" class="form-control" maxlength="3" type="text" id="inputIdadeFinal_' + indice + '" placeholder="Idade final"></div><div class="form-group col-md-3 col-sm-3 col-xs-12"><input onfocusout="verificaCapitalMinimo(' + indice + ')" class="form-control" maxlength="20" type="text" id="inputCapitalMinimo_' + indice + '" placeholder="Capital mínimo"></div><div class="form-group col-md-3 col-sm-3 col-xs-12"><input onfocusout="verificaCapitalMaximo(' + indice + ')" class="form-control" maxlength="20" type="text" id="inputCapitalMaximo_' + indice + '" placeholder="Capital máximo"></div></div>');
    $('#inputIdadeInicial_' + indice).mask('999');
    $('#inputIdadeFinal_' + indice).mask('999');
    $('#inputCapitalMinimo_' + indice).maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });
    $('#inputCapitalMaximo_' + indice).maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });
    $("#inputIdadeInicial_" + indice).val(iminima);
    $("#inputIdadeFinal_" + indice).val(imaxima);
    $("#inputCapitalMinimo_" + indice).val(converterDecimalParaMoeda(cminima));
    $("#inputCapitalMaximo_" + indice).val(converterDecimalParaMoeda(cmaxima));
}

function removerInputEscalonadoPorIdadelinha(indice) {
    if (indice > 0) {
        $("#inputEscalonadoPorIdadelinha_" + indice).remove();
        indiceEscalonadoPorIdade--;
    }
}

function verificaIdadeInicial(indice) {
    let tamanhoLista = indiceEscalonadoPorIdade;
    var idade = $("#inputIdadeInicial_" + indice).val();
    var idadeFinal = $("#inputIdadeFinal_" + indice).val();
    let invalido = 0;
    if ((ProdutoComercial != null) && ($('#inputIdadeInicial_' + indice).val() != "") && (invalido == 0)) {
        if ((parseInt(idade) < ProdutoComercial.produtoComercialVida.idadeMinimoContrato) || (parseInt(idade) > ProdutoComercial.produtoComercialVida.idadeMaximoContrato)) {
            $('#inputIdadeInicial_' + indice).addClass("input-validation-error");
            notification("erro", "O limite de idade permitido é mínimo " + ProdutoComercial.produtoComercialVida.idadeMinimoContrato + " e máximo " + ProdutoComercial.produtoComercialVida.idadeMaximoContrato + ".", $(this).attr("id"));
            invalido = 1;
        } else {
            $('#inputIdadeInicial_' + indice).removeClass("input-validation-error");
        }
        if ((idadeFinal != "") && (invalido == 0)) {
            if (parseInt(idade) > parseInt(idadeFinal)) {
                $('#inputIdadeInicial_' + indice).addClass("input-validation-error");
                invalido = 1;
                notification("erro", "A Idade Inicial não pode ser maior que a Idade Final", $(this).attr("id"));
            }
        }
        if (invalido === 0) {
            for (let i = 0; i < tamanhoLista; i++) {
                if (i !== parseInt(indice)) {
                    if ((parseInt(idade) > parseInt($("#inputIdadeInicial_" + i).val())) && (parseInt(idade) <= parseInt($("#inputIdadeFinal_" + i).val()))) {
                        $('#inputIdadeInicial_' + indice).addClass("input-validation-error");
                        invalido = 1;
                        notification("erro", "Faixa de idade já cadastrada.", $(this).attr("id"));
                        break;
                    }
                }
                if (invalido == 0) {
                    $('#inputIdadeFinal_' + indice).removeClass("input-validation-error");
                }
            }
        }
    }
}

function verificaIdadeFinal(indice) {
    let tamanhoLista = indiceEscalonadoPorIdade;
    var idade = $('#inputIdadeFinal_' + indice).val();
    var idadeInicial = $("#inputIdadeInicial_" + indice).val();
    let invalido = 0;
    if ((ProdutoComercial != null) && ($('#inputIdadeFinal_' + indice).val() != "") && (invalido == 0)) {
        if (parseInt(idade) > ProdutoComercial.produtoComercialVida.idadeMaximoContrato || (parseInt(idade) < ProdutoComercial.produtoComercialVida.idadeMinimoContrato)) {
            $('#inputIdadeFinal_' + indice).addClass("input-validation-error");
            invalido = 1;
            notification("erro", "O limite de idade permitido é mínimo " + ProdutoComercial.produtoComercialVida.idadeMinimoContrato + " e máximo " + ProdutoComercial.produtoComercialVida.idadeMaximoContrato + ".", $(this).attr("id"));
        } else {
            $('#inputIdadeFinal_' + indice).removeClass("input-validation-error");
        }
        if ((idadeInicial != "") && (invalido == 0)) {
            if (parseInt(idade) < parseInt(idadeInicial)) {
                $('#inputIdadeFinal_' + indice).addClass("input-validation-error");
                invalido = 1;
                notification("erro", "Idade Final não pode ser menor que a Idade Inicial", $(this).attr("id"));
            }
        }
        if (invalido == 0) {
            for (let i = 0; i < tamanhoLista; i++) {
                if (i != parseInt(indice)) {
                    if ((parseInt(idade) >= parseInt($("#inputIdadeInicial_" + i).val())) && (parseInt(idade) <= parseInt($("#inputIdadeFinal_" + i).val()))) {
                        $('#inputIdadeFinal_' + indice).addClass("input-validation-error");
                        invalido = 1;
                        notification("erro", "Faixa de idade já cadastrada.", $(this).attr("id"));
                        break;
                    }
                }
            }
        }
        if (invalido == 0) {
            $('#inputIdadeFinal_' + indice).removeClass("input-validation-error");
        }
    }
}

function verificaCapitalMinimo(indice) {
    var capital = $('#inputCapitalMinimo_' + indice).val();
    var capitalMaximo = $('#inputCapitalMaximo_' + indice).val();
    let invalido = 0;
    capital = capital.replace(" ", "");
    capital = capital.replace("R$", "");
    capital = capital.replace(/\./g, "");
    capital = capital.replace(",", ".");
    capitalMaximo = capitalMaximo.replace(" ", "");
    capitalMaximo = capitalMaximo.replace("R$", "");
    capitalMaximo = capitalMaximo.replace(/\./g, "");
    capitalMaximo = capitalMaximo.replace(",", ".");
    if ((ProdutoComercial != null) && ($('#inputCapitalMinimo_' + indice).val() != "") && (invalido == 0)) {
        if (parseInt(capital) < ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato) {
            $('#inputCapitalMinimo_' + indice).addClass("input-validation-error");
            invalido = 1;
            notification("erro", "Limite de capital permitido é mínimo " + ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato + " e máximo " + ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato + ".", $(this).attr("id"));
        } else {
            $('#inputCapitalMinimo_' + indice).removeClass("input-validation-error");
        }
    }
    if ((capitalMaximo != "") && (invalido == 0)) {
        if (parseFloat(capital) > parseFloat(capitalMaximo)) {
            $('#inputCapitalMinimo_' + indice).addClass("input-validation-error");
            invalido = 1;
            notification("erro", "O Capital Mínimo não pode ser maior que o Capital Máximo", $(this).attr("id"));
        }
    }
    if (invalido == 0) {
        $('#inputCapitalMinimo_' + indice).removeClass("input-validation-error");
    }
}

function verificaCapitalMaximo(indice) {
    var capital = $('#inputCapitalMaximo_' + indice).val();
    var capitalMinimo = $('#inputCapitalMinimo_' + indice).val();
    let invalido = 0;
    capital = capital.replace(" ", "");
    capital = capital.replace("R$", "");
    capital = capital.replace(/\./g, "");
    capital = capital.replace(",", ".");
    capitalMinimo = capitalMinimo.replace(" ", "");
    capitalMinimo = capitalMinimo.replace("R$", "");
    capitalMinimo = capitalMinimo.replace(/\./g, "");
    capitalMinimo = capitalMinimo.replace(",", ".");
    if ((ProdutoComercial != null) && ($('#inputCapitalMaximo_' + indice).val() != "") && (invalido == 0)) {
        if (parseFloat(capital) > ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato) {
            $('#inputCapitalMaximo_' + indice).addClass("input-validation-error");
            invalido = 1;
            notification("erro", "Limite de capital permitido é mínimo " + ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato + " e máximo " + ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato + ".", $(this).attr("id"));
        } else {
            $('#inputCapitalMaximo_' + indice).removeClass("input-validation-error");
        }
    }
    if ((capitalMinimo != "") && (invalido == 0)) {
        if (parseFloat(capital) < parseFloat(capitalMinimo)) {
            $('#inputCapitalMaximo_' + indice).addClass("input-validation-error");
            invalido = 1;
            notification("erro", "O Capital Máximo não pode ser menor que o Capital Mínimo", $(this).attr("id"));
        }
    }
    if (invalido == 0) {
        $('#inputCapitalMaximo_' + indice).removeClass("input-validation-error");
    }
}

function verificaValorCapitalUniforme() {
    let valor = $('#inputValorCapitalUniforme').val();
    valor = valor.replace(" ", "");
    valor = valor.replace("R$", "");
    valor = valor.replace(/\./g, "");
    valor = valor.replace(",", ".");
    let invalido = 0;

    if ((ProdutoComercial != null) && ($('#inputValorCapitalUniforme').val() != "") && (invalido == 0)) {
        if (parseFloat(valor) > ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato) {
            $('#inputValorCapitalUniforme').addClass("input-validation-error");
            invalido = 1;
            notification("erro", "Limite de Capital Uniforme é no máximo " + ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato + ";", $(this).attr("id"));
        } else {
            $('#inputValorCapitalUniforme').removeClass("input-validation-error");
        }
    }
    if (invalido == 0) {
        $('#inputValorCapitalUniforme').removeClass("input-validation-error");
    }
}

function verificaValorMultiplo() {
    let valor = $('#inputValorMultiplo').val();
    let invalido = 0;
    if ((ProdutoComercial != null) && ($('#inputValorMultiplo').val() != "") && (invalido == 0)) {
        if (parseInt(valor) > ProdutoComercial.produtoComercialVida.valorMultiplicadorMaximoContrato) {
            $('#inputValorMultiplo').addClass("input-validation-error");
            invalido = 1;
            notification("erro", "Limite de Múltiplo Salarial é de no máximo " + ProdutoComercial.produtoComercialVida.valorMultiplicadorMaximoContrato + ".", $(this).attr("id"));
        } else {
            $('#inputValorMultiplo').removeClass("input-validation-error");
        }
    }
    if (invalido == 0) {
        $('#inputValorMultiplo').removeClass("input-validation-error");
    }
}

function verificaEscalonadoPorIdade() {
    if ($("#SimEscalonadoPorIdade").prop("checked")) {
        $("#modalidadeEscalonadoPorIdade").show();
    } else {
        $("#modalidadeEscalonadoPorIdade").hide();
    }
}

function pesquisarListaModalidadeCapital() {
    $.ajax({
        url: '/ObterListaModalidadeCapital',
        async: true,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: successListaModalidadeCapital,
        error: function (result) {
            onFailed(result)
        }
    });
}


function excluirPlanoCondicoesComerciais(data) {
    $.ajax({
        url: '/ExcluirPlanoCondicoesComerciais/' + data.numeroCotacao + '/' + data.numeroPlano,
        async: true,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        //success: successListaModalidadeCapital,
        //error: function (result) {
        //    onFailed(result)
        //}
    });
}

function successListaModalidadeCapital(data) {
    for (var i = 0; i < data.length; i++) {
        $("#selectTipoModalidadeCapital").append('<option value="' + data[i].tipoModalidadeCapital + '"> ' + data[i].descricaoTipoModalidadeCapital + ' </option>');
    }
}

function limpaCampoDeCobertura(codigoCoberturaAlterada) {

    $('#hd_cobertura_selecionado_' + codigoCoberturaAlterada).val(false);
    $('#hd_cobertura_percentualIndenizacao_' + codigoCoberturaAlterada).val("");

    if ($('#txt_QtdDiarias_' + codigoCoberturaAlterada).val() != undefined) {
        $('#txt_QtdDiarias_' + codigoCoberturaAlterada).attr('disabled', 'disabled').val("");;
    }
    if ($('#txt_ValorDiarias_' + codigoCoberturaAlterada).val() != undefined) {
        $('#txt_ValorDiarias_' + codigoCoberturaAlterada).attr('disabled', 'disabled').val("");;
    }
    if ($('#txt_cobertura_' + codigoCoberturaAlterada).val() != undefined) {
        $('#txt_cobertura_' + codigoCoberturaAlterada).attr('disabled', 'disabled').val("");
    }
}

function TemVidaNoPlano() {
    for (var i = 0; i < planosCondicoesComerciais.length; i++) {
        if (planosCondicoesComerciais[i].nomePlano == inputNomeDoPlano.value &&
            planosCondicoesComerciais[i].totalVidas != null &&
            planosCondicoesComerciais[i].totalVidas >= 0) {
            return true;
        }
    }

    return false;
}

//MODAL
var modalConfirm = function (callback) {

    $("#btnRemoverPlano").on("click", function () {
        if (TemVidaNoPlano())
            msgModal.innerHTML = "Deseja realmente remover o plano? As vidas importadas para o plano serão excluídas.";
        else
            msgModal.innerHTML = "Deseja realmente remover o plano?";

        $("#removerPlano-modal").modal('show');
    });

    $("#modal-btn-remover-sim").on("click", function () {
        callback(true);
        $("#removerPlano-modal").modal('hide');
    });

    $("#modal-btn-remover-nao").on("click", function () {
        callback(false);
        $("#removerPlano-modal").modal('hide');
    });
};

modalConfirm(function (confirm) {
    if (confirm) {
        removerPlanoCondicoesComerciais();
    }
});