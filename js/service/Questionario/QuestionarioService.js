$(document).ready(function () {

    checkInputPagamento();

    $("#justificativaFacultativa").hide();

    $("#230").change(function () {
        if ($("#2301544").prop("checked")) {
            $("#justificativaFacultativa").show();

            if ($('#inputJustificativaFacultativa').val() == "") {
                $('#inputJustificativaFacultativa').addClass("input-validation-error");
                notification("erro", "Campo Motivo de adesão facultativa deve ser informado.");
            } else {
                $('#inputJustificativaFacultativa').removeClass("input-validation-error");
            }
        } else {
            $('#inputJustificativaFacultativa').removeClass("input-validation-error");
            $("#inputJustificativaFacultativa").val('');
            $("#justificativaFacultativa").hide();
        }
    });

    $("#231").change(function () {
        checkInputPagamento();
    });

    $("#2381546").change(function () {
        verificaPagamentoSegurado();
    });

    $("#2381547").change(function () {
        verificaPagamentoEmpresa();
    });

    $("#btnSalvar").click(function () {
        manipularDadosQuestionario();
    });

    $("#btnSolicitar").click(function () {
        manipularDadosQuestionario();
    });

    if ($('#hdCotacaoId').val() === "") {
        $("#2281543").prop('checked', true);
        $("#2291543").prop('checked', true);
        $("#2301545").prop('checked', true);
    }
    else {
        atualizarCamposDoQuestionarioComDadosDaModel();
    }

    $('.maskMoneyPercent0').maskMoney({ suffix: '%', precision: 0, affixesStay: false, decimal: "," });

});

// Funções
function pesquisarQuestionario() {
    $.ajax({
        type: "GET",
        url: "/ObterListaQuestionario",
        async: true,
        success: successQuestionario,
        error: function (result) {
            onFailed(result)
        }
    });
}

function carregaViewQuestionario() {
    $.ajax({
        type: "GET",
        url: "/questionario",
        async: true,
    });
}

function successQuestionario(data) {
    for (var i = 0; i < data.questionarios.length; i++) {
        $("#formQuestionario").append('<p>"' + data.questionarios[i].descricaoPergunta + '</p>');
    }
}

function verificaPagamentoSegurado() {
    var valorDigitado = $('#2381546').val().replace("%", "");
    if ((isNaN(valorDigitado)) || (valorDigitado >= 100) || (valorDigitado <= 0)) {
        $('#2381546').val(0 + '%');
        $('#2381547').val(0 + '%')
    } else {
        var p = 100 - valorDigitado;
        $('#2381547').val(p + '%');
        $('#2381546').val(valorDigitado + '%');
    }
}

function verificaPagamentoEmpresa() {
    var valorDigitado = $('#2381547').val().replace("%", "");
    if ((isNaN(valorDigitado)) || (valorDigitado >= 100) || (valorDigitado <= 0)) {
        $('#2381546').val(0 + '%');
        $('#2381547').val(0 + '%');
    } else {
        var p = 100 - valorDigitado;
        $('#2381546').val(p + '%');
        $('#2381547').val(valorDigitado + '%');
    }
}

function checkInputPagamento() {
    if ($('#231').val() === "Empresa") {
        $('#2381546').prop('disabled', true);
        $('#2381547').prop('disabled', true);
        $('#2381547').val("100%");
        $('#2381546').val("0%");
    }
    if ($('#231').val() === "Segurado") {
        $('#2381546').prop('disabled', true);
        $('#2381547').prop('disabled', true);
        $('#2381546').val("100%");
        $('#2381547').val("0%");
    }
    if ($('#231').val() === "Segurado/Empresa") {
        $('#2381546').prop('disabled', false);
        $('#2381547').prop('disabled', false);
        $('#2381546').val("0%");
        $('#2381547').val("0%");
    }
}

function manipularDadosQuestionario() {
    if ($("#SeguradoraAnterior").val() !== "0") {
        $("#SeguradoraAnterior_Codigo").val($("#SeguradoraAnterior").val());
        $("#SeguradoraAnterior_Nome").val($("#select2-SeguradoraAnterior-container").attr('title'));
    }
    if ($("#2301544").prop("checked")) {
        $("#Questionarios_0__Perguntas_3__Respostas_0__Valor").val($("#inputJustificativaFacultativa").val());
        $("#Questionarios_0__Perguntas_3__Respostas_0__Descricao").val("Facultativa");
        $("#Questionarios_0__Perguntas_3__Respostas_0__Codigo").val("1544");
    } else {
        $("#Questionarios_0__Perguntas_3__Respostas_0__Descricao").val("Compulsoria");
        $("#Questionarios_0__Perguntas_3__Respostas_0__Codigo").val("1545");
    }
    $("#Questionarios_0__Perguntas_0__Respostas_0__Descricao").val($('#227').val());
    if ($('#227').val() === "Funcionário+Sócio") {
        $("#Questionarios_0__Perguntas_0__Respostas_0__Codigo").val(1540);
    } else if ($('#227').val() === "Somente funcionário") {
        $("#Questionarios_0__Perguntas_0__Respostas_0__Codigo").val(1539);
    } else if ($('#227').val() === "Func.+Sócio+Estag.") {
        $("#Questionarios_0__Perguntas_0__Respostas_0__Codigo").val(1541);
    }
    //preenchendo DataReferencia
    //$("#inputDataReferencia").prop('disabled', false);
    var dataBr = $("#inputDataReferencia").val();
    var dataShow = dataBr.split('/');
    $("#DataReferencia").val(dataShow[1] + '/' + dataShow[0] + '/' + dataShow[2]);

    //Participação do seguro
    $("#Questionarios_0__Perguntas_4__Respostas_0__Valor").val($('#2381546').val().replace("%", ""));
    $("#Questionarios_0__Perguntas_4__Respostas_1__Valor").val($('#2381547').val().replace("%", ""));

    //O seguro será pago por quem?
    $("#Questionarios_0__Perguntas_5__Respostas_0__Descricao").val($("#231").val());
    if ($("#231").val() === "Segurado") {
        $("#Questionarios_0__Perguntas_5__Respostas_0__Codigo").val(1546);
    } else if ($("#231").val() === "Empresa") {
        $("#Questionarios_0__Perguntas_5__Respostas_0__Codigo").val(1547);
    } else if ($("#231").val() === "Segurado/Empresa") {
        $("#Questionarios_0__Perguntas_5__Respostas_0__Codigo").val(1548);
    }

    //Possui afastados do trabalho por acidente ou doença?
    if ($("#2291542").prop("checked")) {
        $("#Questionarios_0__Perguntas_1__Respostas_0__Descricao").val("Sim");
        $("#Questionarios_0__Perguntas_1__Respostas_0__Codigo").val(1542);
    } else {
        $("#Questionarios_0__Perguntas_1__Respostas_0__Descricao").val("Não");
        $("#Questionarios_0__Perguntas_1__Respostas_0__Codigo").val(1543);
    }

    //Haverá participação de aposentados?
    if ($("#2281542").prop("checked")) {
        $("#Questionarios_0__Perguntas_2__Respostas_0__Descricao").val("Sim");
        $("#Questionarios_0__Perguntas_2__Respostas_0__Codigo").val(1542);
    } else {
        $("#Questionarios_0__Perguntas_2__Respostas_0__Descricao").val("Não");
        $("#Questionarios_0__Perguntas_2__Respostas_0__Codigo").val(1543);
    }
}


$("#inputJustificativaFacultativa").change(function () {
    if ($("#justificativaFacultativa").css('display') === "block" && $(this).val().length <= 0) {
        notification("erro", "Campo Motivo de adesão facultativa deve ser informado.");
        $('#inputJustificativaFacultativa').addClass("input-validation-error");
    }
    else {
        $('#inputJustificativaFacultativa').removeClass("input-validation-error");
    }
}); 