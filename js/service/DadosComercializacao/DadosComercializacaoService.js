$(document).ready(function () {
    inicializaCorretorParaCocorretagem();
    $("#cotacaoTotalPercentualCorretagem").change(function () {
        verificaTotalPercentualCorretagem();
    });
    $("#cotacaoTotalPercentualAgenciamento").change(function () {
        verificaTotalPercentualAgenciamento();
    });
    $('#cotacaoTotalPercentualProLabore').change(function () {
        verificaTotalPercentualProLabore();
    });
    
    cargaInicialCorretoresCorretagem();

    $('.maskMoneyPercent2').maskMoney({
        precision: 2, decimal: ","
    });

});

//Classes
var Corretagem = /** @class */ (function () {
    function Corretagem() {
        this.corretor = new Array();
    }
    return Corretagem;
}());

var Corretor = /** @class */ (function () {
    function Corretor(codigo, descricao, codigoClienteOperacional, estabelecimento, tipoCliente, participacaoComissao) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.codigoClienteOperacional = codigoClienteOperacional;
        this.estabelecimento = estabelecimento;
        this.tipoCliente = tipoCliente;
        this.participacaoComissao = participacaoComissao;
    }
    return Corretor;
}());

//Variaveis Globais
var totalPercentualCorretagem;
var problemaPercentualCorretagem = false;
var problemaPercentualProLabore = false;
var problemaPercentualAgenciamento = false;
var corretagem;
var corretorCorretagemTemporario;

function inicializaCorretorParaCocorretagem() {
    if ($("#Comissionamentos_0__CodigoClienteOperacional").val() != "") {
        $("#inputNomeCorretorPrincipal").val($("#CorretorPrincipal_Nome").val());
        corretagem = new Corretagem();
        corretagem.corretor.push(new Corretor($("#Comissionamentos_0__CodigoCliente").val(), $("#CorretorPrincipal_Nome").val(), $('#CorretorPrincipal_CodigoOperacional').val(), $("#Comissionamentos_0__CodigoEstabelecimento").val(), $("#Comissionamentos_0__CodigoTipoComissao").val(), $("#Comissionamentos_0__PercentualParticipacao").val()));
        $('#inputParticipacaoCorretorPrincipal').val(corretagem.corretor[0].participacaoComissao + "%");
        preencheTabelaCocorretagem();
    }
}

function cargaInicialCorretoresCorretagem() {
    var index = 1;
    $("#tabelaCorretoresCorretagem tr").each(function () {
        corretorCorretagemTemporario = new Corretor($("#comissionamentoCliente" + index).text(), $("#comissionamentoNome" + index).text(), $("#comissionamentoCodigoCliente" + index).text(), $("#comissionamentoCodigoEstabelecimento" + index).text(), $("#comissionamentoCodigoTipoComissao" + index).text(), $("#comissionamentoPercentural" + index).text());
        corretagem.corretor.push(corretorCorretagemTemporario);
        index++;
    });
}

function preencheTabelaCocorretagem() {
    if (corretagem.corretor.length > 1) {
        for (var co = 1; co < corretagem.corretor.length; co++) {
            $("#tabelaCorretoresCorretagem").append("<tr><th scope='row'>" + co + "</th><td>" + corretagem.corretor[co].descricao + "</td><td>" + converteDecimalParaPorcentagem(corretagem.corretor[co].participacaoComissao) + "</td><td><span onclick='excluiLinhaCorretor(" + co + ")' class='glyphicon glyphicon-trash'></span></td></tr>");
        }
    }
}

function verificaTotalPercentualCorretagem() {
    var percenturalCorretagemDigitado = $('#cotacaoTotalPercentualCorretagem').maskMoney('unmasked')[0];
    if ((isNaN(percenturalCorretagemDigitado)) || (percenturalCorretagemDigitado > ProdutoComercial.comissaoProdutoComercial.percentualMaximoComissao) || (percenturalCorretagemDigitado < ProdutoComercial.comissaoProdutoComercial.percentualMinimoComissao)) {
        $("#cotacaoTotalPercentualCorretagem").addClass("input-validation-error");
        problemaPercentualCorretagem = true;
        notification("erro", "Valor informado ultrapassa o limite permitido. Limite de " + ProdutoComercial.comissaoProdutoComercial.percentualMinimoComissao + " até " + ProdutoComercial.comissaoProdutoComercial.percentualMaximoComissao + ".", "");
    } else {
        $("#cotacaoTotalPercentualCorretagem").removeClass("input-validation-error");
        problemaPercentualCorretagem = false;
    }
    calcularLimiteMaximoDeCarregamento();
}

function verificaTotalPercentualProLabore() {
    var percenturalCorretagemDigitado = $('#cotacaoTotalPercentualProLabore').maskMoney('unmasked')[0];
    if ((isNaN(percenturalCorretagemDigitado)) || (percenturalCorretagemDigitado > ProdutoComercial.comissaoProdutoComercial.percentualMaximoProlabore) || (percenturalCorretagemDigitado < ProdutoComercial.comissaoProdutoComercial.percentualMinimoProlabore)) {
        $("#cotacaoTotalPercentualProLabore").addClass("input-validation-error");
        problemaPercentualProLabore = true;
        notification("erro", "Valor informado ultrapassa o limite permitido. Limite de " + ProdutoComercial.comissaoProdutoComercial.percentualMinimoProlabore + " até " + ProdutoComercial.comissaoProdutoComercial.percentualMaximoProlabore + ".", "");
    } else {
        $("#cotacaoTotalPercentualProLabore").removeClass("input-validation-error");
        problemaPercentualProLabore = false;
    }
    calcularLimiteMaximoDeCarregamento();
}

function verificaTotalPercentualAgenciamento() {
    var percenturalCorretagemDigitado = $('#cotacaoTotalPercentualAgenciamento').maskMoney('unmasked')[0];
    if ((isNaN(percenturalCorretagemDigitado)) || (percenturalCorretagemDigitado > ProdutoComercial.comissaoProdutoComercial.percentualMaximoAgenciamento) || (percenturalCorretagemDigitado < ProdutoComercial.comissaoProdutoComercial.percentualMinimoAgenciamento)) {
        $("#cotacaoTotalPercentualAgenciamento").addClass("input-validation-error");
        problemaPercentualAgenciamento = true;
        notification("erro", "Valor informado ultrapassa o limite permitido. Limite de " + ProdutoComercial.comissaoProdutoComercial.percentualMinimoAgenciamento + " até " + ProdutoComercial.comissaoProdutoComercial.percentualMaximoAgenciamento + ".", "");
    } else {
        $("#cotacaoTotalPercentualAgenciamento").removeClass("input-validation-error");
        problemaPercentualAgenciamento = false;
    }
    calcularLimiteMaximoDeCarregamento();
}

function abreModalParticipantesComissionamento() {
    if (corretagem === undefined) {
        notification("erro", "É preciso selecionar um corretor principal antes de definir a co-corretagem.", "pesquisaCorretorCorretagemtxt");
    } else {
        $('#modalCorretagem').modal('show');
    }

}

function salvaParticipantesComissionamento() {
    gravaDadosComercializacao();
    $('#modalCorretagem').modal('hide');
}

function calcularLimiteMaximoDeCarregamento() {
    carregamentoInformado = calcularCarregamentoInformado();
    if (carregamentoInformado > ProdutoComercial.comissaoProdutoComercial.percentualMaximoComissao) {
        $("#cotacaoTotalPercentualCorretagem").addClass("input-validation-error");
        $("#cotacaoTotalPercentualProLabore").addClass("input-validation-error");
        $("#cotacaoTotalPercentualAgenciamento").addClass("input-validation-error");
        notification("erro", "Valor do carregamento informado ultrapassa o limite máximo do produto. Limite de " + ProdutoComercial.comissaoProdutoComercial.percentualMaximoComissao + ".", "");
    }
    else {
        if (problemaPercentualCorretagem == false) {
            $("#cotacaoTotalPercentualCorretagem").removeClass("input-validation-error");
        }
        if (problemaPercentualProLabore == false) {
            $("#cotacaoTotalPercentualProLabore").removeClass("input-validation-error");
        }
        if (problemaPercentualAgenciamento == false) {
            $("#cotacaoTotalPercentualAgenciamento").removeClass("input-validation-error");
        }
    }
}

function calcularCarregamentoInformado() {
    var totalComissao = $('#cotacaoTotalPercentualCorretagem').maskMoney('unmasked')[0];
    var totalProLabore = $('#cotacaoTotalPercentualProLabore').maskMoney('unmasked')[0];
    var totalAgenciamento = $('#cotacaoTotalPercentualAgenciamento').maskMoney('unmasked')[0];
    var carregamentoInformado = (totalComissao + totalProLabore + (totalAgenciamento / 12));
    return carregamentoInformado;
}


function pesquisarCorretorCorretagem(busca) {

    var querystring = "?buscaRealizada=" + busca;
    $('#modalCorretagem').modal('hide');
    $('#modalCotacaoCorretagem').removeData()
    $("#ifrmCotacaoCorretagem").contents().find("html").html("");
    $('#ifrmCotacaoCorretagem').attr('src', "/ObterListaCorretorCorretagem" + querystring)
    $('#modalCotacaoCorretagem').modal('show');
}

function closeIFramePesquisaCorretorCorretagem(codigo, descricao, codigoClienteOperacional, estabelecimento, tipoCliente) {
    try {
        $('#modalCotacaoCorretagem').modal('hide');
        $('#modalCotacaoCorretagem').removeData();
        $('#ifrmCotacaoCorretagem').removeAttr('src');
        $("#pesquisaCorretorCorretagemtxt").val(descricao);
        $('#modalCorretagem').modal('show');
        corretorCorretagemTemporario = new Corretor(codigo, descricao, codigoClienteOperacional, estabelecimento, tipoCliente, 0);
        verificaBotaoIncluirAlterar();
    } catch (e) {
        ExceptionHandling(e);
    }
}

function verificaBotaoIncluirAlterar() {
    var alterar = 0;
    var participacao;
    if (corretorCorretagemTemporario != undefined) {
        for (let c = 1; c < corretagem.corretor.length; c++) {
            if (corretorCorretagemTemporario.codigoClienteOperacional == corretagem.corretor[c].codigoClienteOperacional) {
                alterar = 1;
                participacao = corretagem.corretor[c].participacaoComissao;
                break;
            }
        }
        if (alterar == 1) {
            $("#btnIncluirCorretor").val("ALTERAR");
            $("#inputParticipacaoCorretorSecundario").val(converteDecimalParaPorcentagem(participacao));
        } else {
            $("#btnIncluirCorretor").val("INCLUIR");
        }
    } else {
        $("#btnIncluirCorretor").val("INCLUIR");
    }

}

function pesquisarCorretorCorretagemIncluir() {
    try {
        if ($("#pesquisaCorretorCorretagemtxt").val() != null && $("#pesquisaCorretorCorretagemtxt").val() != "" && $("#pesquisaCorretorCorretagemtxt").val().length >= 2) {
            $.ajax({
                type: "POST",
                url: "/VerificarSessao",
                async: true,
                success: function () {
                    pesquisarCorretorCorretagem($("#pesquisaCorretorCorretagemtxt").val());
                },
                error: function (result) {
                    closeModalWait();
                    VerificarAuth(result)
                    notification("erro", result.responseText, '');
                }
            });
        } else {
            if ($("#pesquisaCorretorCorretagemtxt").val().length <= 1) {
                notification("erro", "Digite no minimo 2 caracteres", "pesquisaCorretorCorretagemtxt");
            } else {
                notification("erro", "Informe um Corretor", "pesquisaCorretorCorretagemtxt");
            }

        }
    } catch (e) {
        ExceptionHandling(e);
    }
}

$("#pesquisaCorretorCorretagemtxt").keyup(function () {
    if ($(this).val().length > 3) {
        $("[data-valmsg-for='pesquisaCorretorCorretagemtxt']").removeClass("field-validation-error");
    }

    if ($(this).length = 0) {
        $("[data-valmsg-for='pesquisaCorretorCorretagemtxt']").toggleClass("field-validation-error");
    }
});

//TODO: Separar as validações em métodos 
function incluirCorretorCocorretagem() {

    if (validarIncluirParticipacao()) {
        $("#inputParticipacaoCorretorSecundario").removeClass("field-validation-error");
        $("#pesquisaCorretorCorretagemtxt").removeClass("field-validation-error");
        corretorCorretagemTemporario.participacaoComissao = $("#inputParticipacaoCorretorSecundario").maskMoney('unmasked')[0];
        var indiceTemporario = 0;
        for (var cc = 1; cc < corretagem.corretor.length; cc++) {
            if (corretagem.corretor[cc].codigoClienteOperacional == corretorCorretagemTemporario.codigoClienteOperacional) {
                indiceTemporario = cc;
                corretagem.corretor[cc].participacaoComissao = corretorCorretagemTemporario.participacaoComissao;
            }
        }
        if (indiceTemporario > 0) {
            $("#tabelaCorretoresCorretagem").empty();
            preencheTabelaCocorretagem();
            corretorCorretagemTemporario = undefined;
            $("#inputParticipacaoCorretorSecundario").val("0,00");
            $("#pesquisaCorretorCorretagemtxt").val("");
        } else {
            $("#tabelaCorretoresCorretagem").append("<tr><th scope='row'>" + corretagem.corretor.length + "</th><td>" + corretorCorretagemTemporario.descricao + "</td><td>" + converteDecimalParaPorcentagem(corretorCorretagemTemporario.participacaoComissao) + "</td><td><span onclick='excluiLinhaCorretor(" + corretagem.corretor.length + ")' class='glyphicon glyphicon-trash'></span></td></tr>");
            corretagem.corretor.push(corretorCorretagemTemporario);
            corretorCorretagemTemporario = undefined;
            $("#inputParticipacaoCorretorSecundario").val("0,00");
            $("#pesquisaCorretorCorretagemtxt").val("");
        }
    }

    ajustaParticipacaoComissaoCorretorPrincipal();
    verificaBotaoIncluirAlterar();
}

function validarIncluirParticipacao() {

    if ($("#inputParticipacaoCorretorSecundario").val() == "") {
        $("#inputParticipacaoCorretorSecundario").addClass("input-validation-error");
        notification("erro", "É preciso adicionar um percentual de participação para incluir um corretor.", "inputParticipacaoCorretorSecundario");
        return false;
    }

    if (($("#inputParticipacaoCorretorSecundario").maskMoney('unmasked')[0] > 99.99) ||
        ($("#inputParticipacaoCorretorSecundario").maskMoney('unmasked')[0] < 0.01)) {
        $("#inputParticipacaoCorretorSecundario").addClass("input-validation-error");
        notification("erro", "O percentual de participação do corretor não pode ser menor que 0,01% ou maior que 99,99%", "#" + "inputParticipacaoCorretorSecundario");
        return false;
    }

    if (corretorCorretagemTemporario == undefined) {
        $("#pesquisaCorretorCorretagemtxt").addClass("input-validation-error");
        notification("erro", "Pesquise um corretor antes de incluir.", "pesquisaCorretorCorretagemtxt");
        return false;
    }

    if (corretorCorretagemTemporario.codigoClienteOperacional === corretagem.corretor[0].codigoClienteOperacional) {
        $("#pesquisaCorretorCorretagemtxt").addClass("input-validation-error");
        notification("erro", "Este corretor não pode ser selecionado, pois é o corretor principal", "pesquisaCorretorCorretagemtxt");
        return false;
    }

    if ((calculaParticipacaoComissaoTotalNumeroInteiro(corretorCorretagemTemporario.codigoClienteOperacional) + $("#inputParticipacaoCorretorSecundario").maskMoney('unmasked')[0]) > 9999) {
        $("#pesquisaCorretorCorretagemtxt").addClass("input-validation-error");
        notification("erro", "A soma de todas as participações não pode ultrapassar 100%", "pesquisaCorretorCorretagemtxt");
        return false;
    }

    return true;
}

function excluiLinhaCorretor(indice) {
    corretagem.corretor.splice(indice, 1);
    $("#tabelaCorretoresCorretagem").empty();
    preencheTabelaCocorretagem();
    ajustaParticipacaoComissaoCorretorPrincipal();
    verificaBotaoIncluirAlterar();
}

function calculaParticipacaoComissaoTotal(codigoClienteOperacional) {
    var total = 0;
    if (corretagem.corretor.length > 1) {
        for (let c = 1; c < corretagem.corretor.length; c++) {
            if (corretagem.corretor[c].codigoClienteOperacional != codigoClienteOperacional) {
                total += converteDecimalParaInteiro(convertePorcentagemParaDecimal(corretagem.corretor[c].participacaoComissao));
            }
        }
    }
    return (total / 100);
}

function calculaParticipacaoComissaoTotalNumeroInteiro(codigoClienteOperacional) {
    var total = 0;
    if (corretagem.corretor.length > 1) {
        for (let c = 1; c < corretagem.corretor.length; c++) {
            if (corretagem.corretor[c].codigoClienteOperacional != codigoClienteOperacional) {
                total += converteDecimalParaInteiro(convertePorcentagemParaDecimal(corretagem.corretor[c].participacaoComissao));
            }
        }
    }
    return total;
}

function ajustaParticipacaoComissaoCorretorPrincipal() {
    corretagem.corretor[0].participacaoComissao = converteInteiroParaDecimal(10000 - calculaParticipacaoComissaoTotalNumeroInteiro(0));
    $("#inputParticipacaoCorretorPrincipal").val(converteDecimalParaPorcentagem(corretagem.corretor[0].participacaoComissao));
}

function convertePorcentagemParaDecimal(numeroDigitado) {
    var numero = numeroDigitado.toString();
    numero = numero.replace("%", "");
    numero = numero.replace(" ", "");
    numero = numero.replace(",", ".");
    return parseFloat(numero);
}

function convertePorcentagemParaInteiro(numeroDigitado) {

    var numero = numeroDigitado.toString();
    if (numero.indexOf(",") < 0 && numero.indexOf(".") < 0) {
        numero += ".00";
    }

    numero = numero.replace("%", "");
    numero = numero.replace(" ", "");
    numero = numero.replace(",", ".");
    numero = numero.replace(".", "");
    return parseInt(numero);
}

function converteInteiroParaDecimal(numeroDigitado) {
    var numero = (numeroDigitado / 100).toFixed(2);
    return parseFloat(numero);
}

function converteDecimalParaInteiro(numeroDigitado) {
    var numero = numeroDigitado.toFixed(2);
    numero = numero.replace(".", "");
    return parseInt(numero);
}

function converteDecimalParaPorcentagem(numeroDigitado) {
    var numero = numeroDigitado.toString();
    numero = numero.replace(",", ".");
    return numero;
}

function gravaDadosComercializacao() {
    $("#DadosDeComercializacao").empty();
    for (let dc = 0; dc < corretagem.corretor.length; dc++) {
        $("#DadosDeComercializacao").append("<input name='Comissionamentos[" + dc + "].PercentualParticipacao' type='hidden' value='" + corretagem.corretor[dc].participacaoComissao + "'>");
        $("#DadosDeComercializacao").append("<input name='Comissionamentos[" + dc + "].CodigoCliente' type='hidden' value='" + corretagem.corretor[dc].codigo + "'>");
        $("#DadosDeComercializacao").append("<input name='Comissionamentos[" + dc + "].Nome' type='hidden' value='" + corretagem.corretor[dc].descricao + "'>");
        $("#DadosDeComercializacao").append("<input name='Comissionamentos[" + dc + "].CodigoClienteOperacional' type='hidden' value='" + corretagem.corretor[dc].codigoClienteOperacional + "'>");
        $("#DadosDeComercializacao").append("<input name='Comissionamentos[" + dc + "].CodigoEstabelecimento' type='hidden' value='" + corretagem.corretor[dc].estabelecimento + "'>");
        $("#DadosDeComercializacao").append("<input name='Comissionamentos[" + dc + "].CodigoTipoComissao' type='hidden' value='" + corretagem.corretor[dc].tipoCliente + "'>");
    }
}