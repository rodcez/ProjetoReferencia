//Variaveis globais
var validFile = false;
var base64String = "";
var dataTotalPlanoImportado = null;
var planos = null;
var idPlanoSelecionado = null;

$(document).ready(function () {
    validaExibicaoRelacaoVidas();
    atualizaVariaveisRelacaoVidas();
});

//function onDropDownListPlanosRelacaoVida() {
//    let _idCotacao = $('#hdCotacaoId').val();
//    if (_idCotacao > 0) {
//        if ((typeof planosCondicoesComerciais !== "undefined") && planosCondicoesComerciais.length >= 1) {
//            for (let i = 0; i < planosCondicoesComerciais.length-1; i++) {
//                var optn = document.createElement("OPTION");
//                optn.text = planosCondicoesComerciais[i].nomePlano;
//                optn.value = planosCondicoesComerciais[i].numeroPlano;
//                //select_rl_Planos.options.add(optn);
//            }
//        }
//    }
//}
function validaExibicaoRelacaoVidas() {
    if ($('#hdCotacaoId').val() > 0 && indexPlanoSelecionado == 0) {
        $("#RelacaoVidasBloqueio").hide();
        $("#RelacaoVidas").show();
    }
    validaOpcoesDeImportacaoDeVidas(true);
}
function onImportarPlanilhaRelacaoVidas() {
    openModalWait();
    let _idCotacao = $('#hdCotacaoId').val();
    var agrupado = $('input[name="arquivorlAgrupado"]:checked').val();
    idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
    idCenarioSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario;
    if (_idCotacao === null || _idCotacao <= 0) {
        notification("erro", "Atenção! Por favor salvar a cotação antes de importar a planilha.");
        closeModalWait();
    }
    else if (agrupado === null) {
        notification("erro", "Atenção! Informe se a importação é agrupada.", "arquivorlAgrupadoNão");
        closeModalWait();
    }
    else if ((idPlanoSelecionado === null || idPlanoSelecionado <= 0) && agrupado === "false") {
        notification("erro", "Atenção! Informe o plano da importação da planilha.");
        closeModalWait();
    }
    else {
        $.ajax({
            url: '/ImportarPlanilha',
            async: true,
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            data: {
                _idCotacao: _idCotacao,
                _base64: base64String,
                _numeroPlano: cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada ? null : idPlanoSelecionado,
                _numeroCenario: idCenarioSelecionado
            },
            success: function (data) {
                successImportarPlanilha(data);
            },
            error: function (result) {
                onFailedImportar(result);
                closeModalWait();
            }
        });
    }
}
function onDeletarRelacaoVidas() {
    let _idCotacao = $('#hdCotacaoId').val();
    idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
    idCenarioSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario;
    $.ajax({
        url: '/DeletarPlanilhaRelacaoVidas',
        async: true,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        data: {
            _idCotacao: _idCotacao,
            _numeroPlano: cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada ? null : idPlanoSelecionado,
            _numeroCenario: idCenarioSelecionado,
            //_numeroVersao: 1
        },
        success: function (result) {
            successDeletarRelacaoVida(result);
            closeModalWait();
            validaBotoes();
        },
        error: function (result) {
            onFailedDeletar(result);
            closeModalWait();
        }
    });
}


function onExcluirRelacaoVidas() {
    let _idCotacao = $('#hdCotacaoId').val();
    idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
    idCenarioSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario;

    $.ajax({
        url: '/DeletarPlanilhaRelacaoVidas',
        async: true,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        data: {
            _idCotacao: _idCotacao,
            _numeroCenario: idCenarioSelecionado,
        },
        success: function (result) {
            successExluirRelacaoVida(result);
            closeModalWait();
            validaBotoes();
        },
        error: function (result) {
            onFailedDeletar(result);
            closeModalWait();
        }
    });
}
function onFailedExportar(result) {
    notification("erro", "Erro ao exportar a planilha! Contatar o suporte técnico.", "");
}
function onFailedImportar(result) {
    closeModalWait();
    var mensagens = result.responseText.replace("[", "").replace("]", "").split(',');
    if (mensagens.length < 1)
        notification("erro", "Erro ao importar a planilha! " + result.responseText, "");
    else {
        var Results = [
            ["Inconsistências"]
        ];
        for (var x = 0; x < mensagens.length; x++) {
            Results.push(mensagens[x])
        }
        exportToCsv(Results);
    }
}
function onFailedDeletar(result) {
    notification("erro", "Erro ao tentar excluir a relação de vidas do plano! " + result, "");
}
function exportToCsv(Results) {
    notification("erro", "Importação não permitida! Por favor, verificar o arquivo de inconsistências.", "");
    let _idCotacao = $('#hdCotacaoId').val();
    idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
    var nomeArquivo = "Cotacao" + _idCotacao + "Plano" + idPlanoSelecionado + "_Validar" + ".csv";
    let csvContent = "data:text/csv;charset=utf-8,%EF%BB%BF";
    Results.forEach(function (rowArray) {
        let row = rowArray;
        csvContent += row + "\r\n";
    });
    var x = document.createElement("A");
    x.setAttribute("href", csvContent);
    x.setAttribute("download", nomeArquivo);
    document.body.appendChild(x);
    x.click();
}
function onFailedDownload(result) {
    closeModalWait();
    notification("erro", "Erro ao tentar fazer o Download da planilha! " + result.responseText, "");
}
function onFailedDeletarRelacaoVida(result) {
    closeModalWait();
    notification("erro", "Erro ao tentar deletar a relação de vidas! " + result.responseText, "");
}
function onExportarPlanilhaRelacaoVidas() {
    let _idCotacao = $('#hdCotacaoId').val();
    if (cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada) {
        idPlanoSelecionado = null;
    } else {
        idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
    }

    idCenarioSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].numeroCenario;
    //if ((idPlanoSelecionado == null || idPlanoSelecionado <= 0))

    //else {
    $.ajax({
        url: '/ExportarPlanilha',
        async: true,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        data: {
            _idCotacao: _idCotacao,
            _numeroPlano: idPlanoSelecionado,
            _numeroCenario: idCenarioSelecionado,
            _numeroVersao: 1
        },
        success: successExportarPlanilha,
        error: function (result) {
            onFailedExportar(result)
        }
    });
    //}
}
function onDownloadPlanilhaRelacaoVidas() {
    $.ajax({
        url: '/DownloadPlanilha',
        async: true,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: successDownloadPlanilha,
        error: function (result) {
            onFailedDownload(result)
        }
    });
}

function onRelacaoVidasAgrupada() {
    let agrupado = $('input[name="arquivorlAgrupado"]:checked').val();
    idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
    nomePlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].nomePlano;

    if (carregandoPlano === false) {

        if (cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas > 0) {
            if (confirm("Ao alterar o tipo de importação as vidas já importadas serão excluídas. Deseja continuar?")) {
                if (agrupado == "true") {
                    $("#btn_rl_DesfazerPlanCenario").show();
                    $("#btn_rl_DesfazerPlan").hide();
                    $('#dv_total_vidas_planos').hide();
                    idPlanoSelecionado = $('#selectPlanoSeguro').val();
                    onExcluirRelacaoVidas()
                    calcularTotalVidasCenario();
                    cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada = true;
                    $('#text_plano_selecionado').val('Todos os Planos');

                }
                else {
                    $("#btn_rl_DesfazerPlanCenario").hide();
                    $("#btn_rl_DesfazerPlan").show();
                    //onDropDownListPlanosRelacaoVida();
                    $('#dv_total_vidas_planos').show();
                    //$('#select_rl_Planos').val('first').change();
                    trocarPlanoSelecionado();
                    calcularTotalVidasCenario();
                    onExcluirRelacaoVidas()
                    cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada = false;
                    $('#text_plano_selecionado').val(idPlanoSelecionado + " - " + nomePlanoSelecionado);
                }
            }
            else {
                cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada ? $("#arquivorlAgrupadoSim").attr('checked', 'checked') : $("#arquivorlAgrupadoNão").attr('checked', 'checked');
                return false;
            }

        } else {
            idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
            nomePlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].nomePlano;
            if (agrupado == "true") {
                $("#btn_rl_DesfazerPlanCenario").show();
                $("#btn_rl_DesfazerPlan").hide();
                $('#dv_total_vidas_planos').hide();
                idPlanoSelecionado = $('#selectPlanoSeguro').val();
                calcularTotalVidasCenario();
                cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada = true;
                $('#text_plano_selecionado').val('Todos os Planos');
            }
            else {
                $("#btn_rl_DesfazerPlanCenario").hide();
                $("#btn_rl_DesfazerPlan").show();
                //onDropDownListPlanosRelacaoVida();
                $('#dv_total_vidas_planos').show();
                //$('#select_rl_Planos').val('first').change();
                trocarPlanoSelecionado();
                calcularTotalVidasCenario();
                cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada = false;
                $('#text_plano_selecionado').val(idPlanoSelecionado + " - " + nomePlanoSelecionado);
            }
            cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada ? $("#arquivorlAgrupadoSim").attr('checked', 'checked') : $("#arquivorlAgrupadoNão").attr('checked', 'checked');
            return false;
        }

    } else if (carregandoPlano) {
        idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
        nomePlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].nomePlano;
        if (agrupado == "true") {
            $("#btn_rl_DesfazerPlanCenario").show();
            $("#btn_rl_DesfazerPlan").hide();
            $('#dv_total_vidas_planos').hide();
            idPlanoSelecionado = $('#selectPlanoSeguro').val();
            calcularTotalVidasCenario();
            validaBotoes();
            cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada = true;
            $('#text_plano_selecionado').val('Todos os Planos');

        }
        else {
            $("#btn_rl_DesfazerPlanCenario").hide();
            $("#btn_rl_DesfazerPlan").show();
            //onDropDownListPlanosRelacaoVida();
            $('#dv_total_vidas_planos').show();
            //$('#select_rl_Planos').val('first').change();
            trocarPlanoSelecionado();
            calcularTotalVidasCenario()
            validaBotoes();
            cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaAgrupada = false;
            $('#text_plano_selecionado').val(idPlanoSelecionado + " - " + nomePlanoSelecionado);

        }
    }
}

function trocarPlanoSelecionado() {

    idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;

    var plano = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado];
    var checado = $('#arquivorlAgrupadoNão').is(':checked')
    if (checado == true) {
        if (plano) {
            $('#text_rl_TotalVidasPlano').val(plano.totalVidas);
            $('#text_rl_TotalVidas').val(cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas);
            $('#dv_total_vidas_planos').show();
        }
    } else {
        $('#dv_total_vidas_planos').hide();
    }

    //cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaSimplificada ? $("#rd_relacao_vidas_Simpl").click().change() : $("#rd_relacao_vidas_Compl").click().change();

    validaBotoes();
    onDesfazerPlanilhaRelacaoVidas();
}

function successDeletarRelacaoVida(responseData) {
    let agrupado = $('input[name="arquivorlAgrupado"]:checked').val();

    //aqui irá excluir todas as vidas do cenário, importação agrupada "sim"
    if (agrupado == "true") {
        if (responseData.value != true) {
            for (var i = 0; i < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length; i++) {
                cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[i].totalVidas = 0
            }
            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas -= 1
            notification('sucesso', 'Importação desfeita', '');
            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas = 0;
            $('#text_rl_TotalVidasPlano').val(0);
            calcularTotalVidasCenario();
            atualizaVariaveisRelacaoVidas()
            validaBotoes();
        } else
            notification("erro", "Erro ao tentar excluir a relação de vidas de todos plano! " + responseData, "");
    } else {

        //aqui irá excluir todas as vidas do plano selecionado, importação agrupada "não"

        if (responseData.value != true) {

            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas -= 1
            notification('sucesso', 'Importação desfeita', '');
            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas = 0;
            $('#text_rl_TotalVidasPlano').val(0);
            calcularTotalVidasCenario();
            atualizaVariaveisRelacaoVidas()
            validaBotoes();
        } else
            notification("erro", "Erro ao tentar excluir a relação de vidas do plano! " + responseData, "");
    }
}

function successExluirRelacaoVida(responseData) {

    if (responseData.value != true) {
        //faço esse for para pegar todos os planos do cenario
        for (var i = 0; i < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length; i++) {
            cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[i].totalVidas = 0
        }
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas -= 1
        notification("sucesso", "Vidas excluidas realize nova importação.", "");
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas = 0;
        $('#text_rl_TotalVidasPlano').val(0);
        calcularTotalVidasCenario();
        atualizaVariaveisRelacaoVidas()
        validaBotoes();
    }
    else
        notification("erro", "Erro ao tentar excluir a relação de vidas do plano! " + responseData, "");
}

function successExportarPlanilha(responseData) {
    let _idCotacao = $('#hdCotacaoId').val();
    idPlanoSelecionado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano;
    var nomeArquivo = "Cotacao" + _idCotacao + "Plano" + idPlanoSelecionado;
    blob = converBase64toBlob(responseData.value.base64, 'application/vnd.ms-excel');
    //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    saveFile(blob, nomeArquivo)
}
function successDownloadPlanilha(responseData) {
    blob = converBase64toBlob(responseData.value.base64, 'application/vnd.ms-excel');
    //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    saveFile(blob, "PlanilhaPadrao");
}
function successImportarPlanilha(data) {
    closeModalWait();
    //atualizarCamposDoPlanoComDadosDaModel();
    notification("sucesso", "Planilha Importada com sucesso.", "");
    onDesfazerPlanilhaRelacaoVidas();
    for (var i = 0; i < data.value.length; i++) {
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.filter(function (p) {
            return p.numeroPlano == data.value[i].numeroPlano
        })[0].totalVidas = parseInt(data.value[i].totalVida);
        if (data.value[i].numeroPlano == cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].numeroPlano)
            $("#text_rl_TotalVidasPlano").val(data.value[i].totalVida);
    }
    calcularTotalVidasCenario();
    trocarPlanoSelecionado();
    validaBotoes();
}
function saveFile(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        function onSetTimeOut() {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        setTimeout(onSetTimeOut(), 0)
        /*
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0)
        */
    }
}
function converBase64toBlob(content, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = window.atob(content);
    var byteArrays = [
    ];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {
        type: contentType
    });
    return blob;
}
function validate_fileupload() {
    var input_element = $('#bnt_rl_ImportarArquivo').val();
    if (input_element != null && input_element != "") {
        var fileName = input_element;
        var allowed_extensions = new Array("xlsx", "xls");
        var file_extension = fileName.split('.').pop();
        for (var i = 0; i < allowed_extensions.length; i++) {
            if (allowed_extensions[i] == file_extension) {
                validFile = true;
                return;
            }
        }
    }
    validFile = false;
}
function onDesfazerPlanilhaRelacaoVidas() {
    $('#bnt_rl_ImportarArquivo').val("");
}
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('bnt_rl_ImportarArquivo').addEventListener('click', clearValueImportar, false);
    document.getElementById('bnt_rl_ImportarArquivo').addEventListener('change', handleFileSelect, false);
    document.getElementById('bnt_rl_ImportarArquivo').addEventListener('change', validaBotoes, false);

}

function clearValueImportar() {
    $("#bnt_rl_ImportarArquivo").val("");
}

function handleFileSelect(evt) {
    base64String = "";
    var f = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = (function (f) {
        return function (e) {
            var binaryData = e.target.result;
            base64String = window.btoa(binaryData);
            return base64String;

        };
    })(f);
    reader.readAsBinaryString(f);
}
function onRelacaoVidaSimplificada() {
    $('#relacaoCompleta .completa').hide();
    $('#dv_total_vidas_planos').show();
    $('#text_rl_TotalVidasPlano').attr('readonly', true);
    $('#text_rl_TotalVidas').mask('999999');
    $("#rd_relacao_vidas_Simpl").prop("checked", true);
    document.getElementById("text_rl_TotalVidasPlano").readOnly = false;
    $('#text_rl_TotalVidasPlano').mask('999999');
    if (!cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaSimplificada) {
        cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaSimplificada = true;
        cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas -= cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas;
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas = 0;
    }
}
function onRelacaoVidaCompleta() {
    $('#relacaoCompleta .completa').show();
    $('#dv_total_vidas_planos').hide();
    $('#text_rl_TotalVidas').val('');
    $("#rd_relacao_vidas_Compl").prop("checked", true);
    document.getElementById("text_rl_TotalVidasPlano").readOnly = true;
    if (cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaSimplificada) {
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas = 0;
        calcularTotalVidasCenario();
        cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaSimplificada = false;
    }
    onRelacaoVidasAgrupada();
}
function validaBotoes() {

    if (($('#hdCotacaoId').val()) && ($('#arquivorlAgrupadoSim').is(':checked') === true) && ($('#bnt_rl_ImportarArquivo').length > 0) && (cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas > 0)) {
        $('#btn_rl_ImportarPlan').removeClass('disabled');
        $('#btn_rl_ExportarPlan').removeClass('disabled');
        $('#btn_rl_DesfazerPlan').removeClass('disabled');
        $('#btn_rl_DesfazerPlanCenario').removeClass('disabled');
    } else {
        $('#btn_rl_ImportarPlan').addClass('disabled');
        $('#btn_rl_ExportarPlan').addClass('disabled');
        $('#btn_rl_DesfazerPlan').addClass('disabled');
        $('#btn_rl_DesfazerPlanCenario').addClass('disabled');
    }
    if ($('#hdCotacaoId').val() && $('#bnt_rl_ImportarArquivo').length > 0) {
        $('#btn_rl_ImportarPlan').removeClass('disabled');
        $('#btn_rl_ExportarPlan').removeClass('disabled');
        $('#btn_rl_DesfazerPlan').removeClass('disabled');
        $('#btn_rl_DesfazerPlanCenario').removeClass('disabled');
    }
    if (cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas > 0) {
        $('#btn_rl_ExportarPlan').removeClass('disabled');
        $('#btn_rl_DesfazerPlan').removeClass('disabled');
        $('#btn_rl_DesfazerPlanCenario').removeClass('disabled');
    }
    if (!cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas > 0) {
        $("#btn_rl_ExportarPlan").addClass('disabled');
        $("#btn_rl_DesfazerPlan").addClass('disabled');
        $("#btn_rl_DesfazerPlanCenario").addClass('disabled');
    }

}
function validaOpcoesDeImportacaoDeVidas(verificaCoberturaAP) {
    if (verificaCoberturaAP && ProdutoComercial) {
        window.PlanosCondicoesComerciaisFunctions.VerificaCoberturaAP();
    }
    //if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].indicadorPlanoAP) {
    //    //$("#dv_relacao_vidas_planos_selecao").show();
    //    if (cotacao.CenariosCotacao[indexCenarioSelecionado].indicadorRelacaoVidaSimplificada) {
    //        if (!$("#rd_relacao_vidas_Simpl").is(":checked"))
    //            $("#rd_relacao_vidas_Simpl").click().change();
    //    }

    //    else {
    //        if (!$("#rd_relacao_vidas_Compl").is(":checked"))
    //            $("#rd_relacao_vidas_Compl").click().change();
    //    }
    //} //else {
    ////    $("#dv_relacao_vidas_planos_selecao").hide();
    ////}
    //onRelacaoVidasAgrupada();

}
function salvarCotacaoSimplificada(totalVidas) {

    totalVidasSimplificado = parseInt($(totalVidas).val());

    if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas) {
        cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas -= cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas;
    }
    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas = totalVidasSimplificado;
    cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas += totalVidasSimplificado;

    $("#text_rl_TotalVidas").val(cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas);
}

function calcularTotalVidasCenario() {
    cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas = 0;
    cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.forEach(function (p) {
        cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas += p.totalVidas;
    });

    for (var i = 0; i < cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais.length; i++) {
        cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[i].totalVidas
    }
    if (cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas > 0) {
        $('#text_rl_TotalVidasPlano').val(cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas);
    } else {
        $('#text_rl_TotalVidasPlano').val(cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais[indexPlanoSelecionado].totalVidas);
        $('#text_rl_TotalVidasPlano').val(0);
    }
    cotacao.CenariosCotacao[indexCenarioSelecionado].versoesCalculo[0].quantidadeTotalVidas = cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas;
    $("#text_rl_TotalVidas").val(cotacao.CenariosCotacao[indexCenarioSelecionado].totalVidas);
}
function atualizaVariaveisRelacaoVidas() {

    if (typeof cotacao.CenariosCotacao[indexCenarioSelecionado] != "undefined") {
        dataTotalPlanoImportado = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais;
        planos = cotacao.CenariosCotacao[indexCenarioSelecionado].planosCondicoesComerciais;
    }
}

var modalConfirm = function (callback) {

    $("#btn_rl_DesfazerPlan").on("click", function () {
        $("#deletarRelacaoVida-modal").modal('show');
    });

    $("#modal-btn-deletarRelacao-sim").on("click", function () {
        callback(true);
        $("#deletarRelacaoVida-modal").modal('hide');
    });

    $("#modal-btn-deletarRelacao-nao").on("click", function () {
        callback(false);
        $("#deletarRelacaoVida-modal").modal('hide');
    });
};

modalConfirm(function (confirm) {
    if (confirm) {
        onDeletarRelacaoVidas();
    }
});



var modalConfirmDeletar = function (callback) {

    $("#btn_rl_DesfazerPlanCenario").on("click", function () {
        $("#deletarRelacaoVidaCenario-modal").modal('show');
    });

    $("#modal-btn-deletarRelacaoCenario-sim").on("click", function () {
        callback(true);
        $("#deletarRelacaoVidaCenario-modal").modal('hide');
    });

    $("#modal-btn-deletarRelacaoCenario-nao").on("click", function () {
        callback(false);
        $("#deletarRelacaoVidaCenario-modal").modal('hide');
    });
};

modalConfirmDeletar(function (confirma) {
    if (confirma) {
        onDeletarRelacaoVidas();
    }
});


var modalConfirmImport = function (callback) {
    $("#btn_rl_ImportarPlan").on("click", function () {
        validate_fileupload();
        if (validFile === false) {
            notification("erro", "Atenção! Extensão do arquivo inválida ou arquivo não selecionado.");
            closeModalWait();
        }
        else if (validFile === true) {
            if ($("#text_rl_TotalVidasPlano").val() != undefined && ($("#text_rl_TotalVidasPlano").val() != "" && $("#text_rl_TotalVidasPlano").val() > 0)) {
                $("#importarRelacaoVida-modal").modal('show');
            }
            else if ($("#text_rl_TotalVidasPlano").val() != undefined && ($("#text_rl_TotalVidasPlano").val() == "" || $("#text_rl_TotalVidasPlano").val() <= 0))
                onImportarPlanilhaRelacaoVidas();
        }
    });

    $("#modal-btn-importarRelacao-sim").on("click", function () {
        callback(true);
        $("#importarRelacaoVida-modal").modal('hide');
    });

    $("#modal-btn-importarRelacao-nao").on("click", function () {
        callback(false);
        $("#importarRelacaoVida-modal").modal('hide');
    });


};

modalConfirmImport(function (confirm) {
    if (confirm) {
        onImportarPlanilhaRelacaoVidas();
    }
});


