var dataSeguradorasService = [];

$(document).ready(function () {
    pesquisaSeguradoras();    
    $("#formSeguradora").hide();

    if ($("#hdCotacaoId").val !== "") //Consulta de cotação:
    {     
        if ($("#rbIndicadorTransferenciaSeguradoraNao").prop("checked")) {
            $("#formSeguradora").hide();
        }
        else {
            $("#formSeguradora").show();
            if ($('#SeguradoraAnterior option').length === 1) {
                pesquisaSeguradoras();
            }
            if ($("#SeguradoraAnterior_Nome").val() !== "") {
                $("#select2-SeguradoraAnterior-container").prop("innerText", $("#SeguradoraAnterior_Nome").val());
            }
        }
    }

    $("input[name=IndicadorTransferenciaSeguradora]:radio").change(function () {
        if ($("#rbIndicadorTransferenciaSeguradoraNao").prop("checked")) {
            $("#formSeguradora").hide();
        }
        else {
            $("#formSeguradora").show();
            $('#rbIndicadorSinistroNao').prop('checked', true);
            if ($('#SeguradoraAnterior option').length === 1) {
                pesquisaSeguradoras();
            }
        }
    });
});

// Funções
function pesquisaSeguradoras() {
    $.ajax({
        url: '/ObterListaSeguradora',
        async: true,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: successSeguradoras,
        error: function (result) {
            onFailed(result);
        }
    });
}

function successSeguradoras(data) {
    dataSeguradorasService = data;
    for (var i = 0; i < data.seguradoras.seguradora.length; i++) {
        $("#SeguradoraAnterior").append('<option value="' + data.seguradoras.seguradora[i].codigoSusep + '"> ' + data.seguradoras.seguradora[i].descricao + ' </option>');
        $("#selectSeguradoraAceitacao").append('<option value="' + data.seguradoras.seguradora[i].codigoSusep + '"> ' + data.seguradoras.seguradora[i].descricao + ' </option>');
        
    }

    if ($("#SeguradoraAnterior_Codigo").val() !== "") {
        $("#SeguradoraAnterior").val($("#SeguradoraAnterior_Codigo").val());
    }
}

function retornaDataAtual() {
    var today = new Date();
    var dia = today.getDate().toString();
    var mes = today.getMonth().toString();
    var ano = today.getFullYear().toString();
    return dia + "/" + mes + "/" + ano;
}

function retornaDataAtualPagina() {
    var today = new Date();
    var dia = today.getDate().toString();
    var mes = today.getMonth().toString();
    if (parseInt(mes) < 10) {
        mes = "0" + mes;
    }
    var ano = today.getFullYear().toString();
    return ano + "-" + mes + "-" + dia;
}

function verificaDataReferencia() {
    if ($("#DataReferencia").val() === "") {
        $("#inputDataReferencia").val(retornaDataAtualPagina());
        //$("#DataReferencia").val(retornaDataAtual());
    }
}
