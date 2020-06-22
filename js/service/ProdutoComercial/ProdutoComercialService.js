//$(document).ready(function () {

    pesquisarProdutoComercial();


//});

//Variaveis globais
var ProdutoComercial;


//Funções
function pesquisarProdutoComercial() {
    if (ProdutoComercial == undefined) {
        $.ajax({
            url: '/ObterProdutoComercial',
            async: true,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: {
                codigoProdutoComercial: 930211,
                codigoCanal: 6,
                codigoCompanhia: 1,
                codigoOrgaoEmissor: 16,
                dataReferencia: retornaDataAtual(),
                codigoFamilia: 3
            },
            success: successProdutoComercial,
            error: function (result) {
                onFailed(result)
            }
        });
    }
}

function successProdutoComercial(data) {
    ProdutoComercial = data;
    $("#NomeProdutoComercial").text(ProdutoComercial.produtoComercial.descricao);

    if ($('#cotacaoTotalPercentualCorretagem').val() == "0,00" || $('#cotacaoTotalPercentualCorretagem').val() == "") {
        $('#cotacaoTotalPercentualCorretagem').val(ProdutoComercial.comissaoProdutoComercial.percentualComissaoPessoaFisica.toFixed(2).replace('.', ','));
    }
}

function retornaDataAtual() {
    var today = new Date();
    var dia = today.getDate().toString();
    var mes = today.getMonth().toString();
    var ano = today.getFullYear().toString();
    return dia + "/" + mes + "/" + ano;
}