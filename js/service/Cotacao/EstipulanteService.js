//Functions
function obterListaCNAI(codigoCNAE) {
    $.ajax({
        type: "POST",
        async: true,
        url: "/ObterOcupacoesPJ",
        success: function (result) {
            successOcupacoesPJ(result, codigoCNAE)
        },
        error: function (result) {
            onFailed(result)
        }
    });
}

function obterListaAtividade() {
    $.ajax({
        type: "POST",
        url: "/ObterOcupacoesPF",
        async: true,
        cache: true,
        success: successOcupacoesPF,
        error: function (result) {
            onFailed(result)
        }
    });
}

function successCpf(data) {
    closeModalWait();
    $("#estipulanteViewModel_Nome").val(data.nome);

    getEnderecoPF(data);
    //$("#estipulanteViewModel_Cnae_id").prop("readonly",true);;

    obterListaAtividade();


}

function getEnderecoPF(data) {
    $("#estipulanteViewModel_Endereco_NomeLogradouro").val(data.nomeLogradouro);
    $("#estipulanteViewModel_Endereco_NumeroLogradouro").val(data.numeroLogradouro);
    $("#estipulanteViewModel_Endereco_TipoLogradouro").val(data.tipoLogradouro);
    $("#estipulanteViewModel_Endereco_Complemento").val(data.complemento);
    $("#estipulanteViewModel_Endereco_NomeBairro").val(data.nomeBairro);
    $("#estipulanteViewModel_Endereco_NomeCidade").val(data.nomeCidade);
    $("#estipulanteViewModel_Endereco_NumeroCep").val(data.numeroCep);
    $("#estipulanteViewModel_Telefone_DDD").val(data.ddd);
    $("#estipulanteViewModel_Telefone_Numero").val(data.telefone);
}


function getEnderecoPJ(data) {
    $("#estipulanteViewModel_Endereco_NomeCidade").val(data.nomeCidade);
}

function successCNPJ(data) {
    closeModalWait();
    $("#estipulanteViewModel_Nome").val(data.nomeCliente);

    getEnderecoPJ(data);

    obterListaCNAI(data.codigoCNAE);
}

function successOcupacoesPF(data) {
    if ($("#estipulanteViewModel_Ocupacao option").length <= 1) {
        $("#estipulanteViewModel_Ocupacao").append(new Option(" SELECIONE UMA OPÇÃO ", "0", false, false)).trigger('change');
        popularSelect(data, "#estipulanteViewModel_Ocupacao");
    }

    if ($("#estipulanteViewModel_Ocupacao_text").val() !== "" && $("#estipulanteViewModel_Ocupacao_id").val() !== "") //...consulta de cotação
    {
        $("#select2-estipulanteViewModel_Ocupacao-container").prop("innerText", $("#estipulanteViewModel_Ocupacao_text").val() + " - (" + $("#estipulanteViewModel_Ocupacao_id").val() + ")");
        $("#estipulanteViewModel_Ocupacao").val($("#estipulanteViewModel_Ocupacao_id").val());
    }
}

function successOcupacoesPJ(data, codigoCNAE) {
    popularSelect(data, "#estipulanteViewModel_Cnae");
    $("#estipulanteViewModel_Cnae").val(codigoCNAE).trigger("change");
    $("#estipulanteViewModel_Cnae_id").val(codigoCNAE);
    var textoDoCNAE = "";
    for(var i = 0; i < data.length; i++){
        if(data[i].id === codigoCNAE){
            textoDoCNAE = (data[i].text.split(' - ')[0]);
            break;
        }
    }
    $("#estipulanteViewModel_Cnae_text").val(textoDoCNAE);
}

function buscarEstipulante() {
    if ($('.tipoPessoaEstipulante#rbEstipulanteJuridica').is(':checked')) {

        if ($('#Estipulante_CPFCNPJ').val() == '') {
            notification("erro", "Campo CNPJ deve ser preenchido para realizar a consulta.", "Estipulante_CPFCNPJ");
            return;
        }

        if ($('#Estipulante_CPFCNPJ').val().replace('.', '').replace('-', '').replace('.', '').replace('/', '').length < 14) {
            notification("erro", "CNPJ Incompleto", "Estipulante_CPFCNPJ");
            $('#estipulanteViewModel_Nome').val('');
            return;
        }

        $.ajax({
            type: "POST",
            url: "/ObterDadosCNPJ",
            async: true,
            contentType: 'application/x-www-form-urlencoded',
            data: { cnpj: Number($('#Estipulante_CPFCNPJ').val().replace('.', '').replace('-', '').replace('.', '').replace('/', '')) },
            success: successCNPJ,
            error: function (result) {
                closeModalWait();
                VerificarAuth(result);
                notification("erro", result.responseText, '');
                $('#Estipulante_CPFCNPJ').val('');
                $('#estipulanteViewModel_Nome').val('');
            }
        });
    }
    else {

        if ($('#Estipulante_CPFCNPJ').val() === '') {
            notification("erro", "Informe um CPF", "Estipulante_CPFCNPJ");
            return;
        }

        if ($('#Estipulante_CPFCNPJ').val().replace('.', '').replace('-', '').replace('.', '').length < 11) {
            notification("erro", "CPF Incompleto", "Estipulante_CPFCNPJ");
            $('#estipulanteViewModel_Nome').val('');
            return
        }

        $.ajax({
            type: "POST",
            url: "/ObterDadosCPF",
            async: true,
            contentType: 'application/x-www-form-urlencoded',
            data: { cpf: Number($('#Estipulante_CPFCNPJ').val().replace('.', '').replace('-', '').replace('.', '')) },
            success: successCpf,
            error: function (result) {
                VerificarAuth(result);
                notification("erro", result.responseText);
                //notification("notificationSuccess", "Cotação salva com sucesso!", "Sucesso!", raiz + "/images/Grupo 389.svg", '', true);
                //notification("notificationError", "Não foi possível salvar a Cotação!", "Erro", null, '', true);
                //notification("information", "Cotação salva com sucesso!", "Sucesso!", raiz + "/images/Grupo 389.svg", '', true);

                $('#Estipulante_CPFCNPJ').val('')
            }
        });
    }
}

//Eventos
$("#EstipulanteCPFCNPJ").click(function () {
    buscarEstipulante();

});

$('.tipoPessoaEstipulante').change(function () {
    if ($(this).attr("id") === "rbEstipulanteFisica") {
        $("#lblCNPJCPF").text("CPF");
        $("#lblRazaoNome").text("Nome");
        $('#Estipulante_CPFCNPJ').val('');
        $("#estipulanteViewModel_Nome").val('');
        $("#estipulanteViewModel_Nome").prop("readonly", false);
        $("#AtividadeEstipulante").removeClass("form-group col-md-12 col-sm-12").addClass("form-group col-md-9 col-sm-9");
        $("#AtividadePJ").hide();
        $("#AtividadePF").show();
        $("#MeiEstipulante").show();
        $('#Estipulante_CPFCNPJ').unmask();
        $('#Estipulante_CPFCNPJ').mask('999.999.999-99');
        $("#estipulanteViewModel_Ocupacao").val('');
        $("#estipulanteViewModel_Ocupacao_id").val('');
        $("#estipulanteViewModel_Ocupacao_text").val('');
    }
    else {
        $("#lblCNPJCPF").text("CNPJ");
        $("#lblRazaoNome").text("Razao Social");
        $("#AtividadePJ").show();
        $("#AtividadePF").hide();
        $("#MeiEstipulante").hide();
        $("#AtividadeEstipulante").removeClass("form-group col-md-9 col-sm-9").addClass("form-group col-md-12 col-sm-12");
        $('#Estipulante_CPFCNPJ').val('');
        $("#estipulanteViewModel_Nome").val('');
        $("#estipulanteViewModel_Nome").prop("readonly", true);
        $('#Estipulante_CPFCNPJ').unmask();
        $('#Estipulante_CPFCNPJ').mask('99.999.999/9999-99');
        $("#estipulanteViewModel_Cnae").empty().trigger('change');
        $("#estipulanteViewModel_Cnae_text").val('');
        $("#estipulanteViewModel_Cnae_id").val('');
        $("#estipulanteViewModel_Cnae").val("0");
        $("#estipulanteViewModel_Cnae").trigger('change');

    }

});

//OnEvents
$("#estipulanteViewModel_Cnae").on("select2:select", function (e) {
    $("#estipulanteViewModel_Cnae_text").val($("#select2-estipulanteViewModel_Cnae-container").prop('title').split(' - ')[0])
    $("#estipulanteViewModel_Cnae_id").val($("#select2-estipulanteViewModel_Cnae-container").prop('title').split(' - ')[1].replace("(", "").replace(")", ""))
});

$("#estipulanteViewModel_Ocupacao").on("select2:select", function (e) {
    $("#estipulanteViewModel_Ocupacao_text").val($("#select2-estipulanteViewModel_Ocupacao-container").prop('title').split(' - ')[0])
    $("#estipulanteViewModel_Ocupacao_id").val($("#select2-estipulanteViewModel_Ocupacao-container").prop('title').split(' - ')[1].replace("(", "").replace(")", ""))
});

$("#Estipulante_CPFCNPJ").on("focus", function (e) {
    $(window).keyup(function (e) {
        if ($("#Estipulante_CPFCNPJ").val() != "" || $("#Estipulante_CPFCNPJ").val() != "") {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 9) {
                buscarEstipulante();
            }
        }
    })

})

function verificaTipoPessoaEstipulante(){
    if($("#rbEstipulanteFisica").prop("checked")){
        $("#estipulanteViewModel_Nome").prop("readonly", false);
    }else{
        $("#estipulanteViewModel_Nome").prop("readonly", true);
    }
}

$(document).ready(function () {
    if ($('#Estipulante_CPFCNPJ').val() === "") //NOVA COTAÇÃO
    {   
        $("#estipulanteViewModel_Nome").prop("readonly", true);
        $("#Estipulantes_Ocupacao").prop("readonly", false);
        $("#estipulanteViewModel_Cnae").prop("disabled", true);
        //$("#estipulanteViewModel_Cnae_id").select2("readonly", true)
        $('#Estipulante_CPFCNPJ').mask('99.999.999/9999-99');
        $("#lblRazaoNome").text("Razao Social");
        $(".estipulanteCnae").prop("readonly", true);

        obterListaAtividade();
    }
    else //CONSULTA DE COTAÇÃO
    {   
        if ($("#rbEstipulanteFisica").is(':checked')) {
            $("#lblCNPJCPF").text("CPF");
            $("#lblRazaoNome").text("Nome");
            $("#AtividadeEstipulante").removeClass("form-group col-md-12 col-sm-12").addClass("form-group col-md-9 col-sm-9");
            $("#AtividadePJ").hide();
            $("#AtividadePF").show();
            $("#MeiEstipulante").show();
            $('#Estipulante_CPFCNPJ').unmask();
            $('#Estipulante_CPFCNPJ').mask('999.999.999-99');

            obterListaAtividade();
        }
        else {
            $("#lblCNPJCPF").text("CNPJ");
            $("#lblRazaoNome").text("Razao Social");
            $("#AtividadePJ").show();
            $("#AtividadePF").hide();
            $("#MeiEstipulante").hide();
            $("#AtividadeEstipulante").removeClass("form-group col-md-9 col-sm-9").addClass("form-group col-md-12 col-sm-12");
            $('#Estipulante_CPFCNPJ').unmask();
            $('#Estipulante_CPFCNPJ').mask('99.999.999/9999-99');
            $("#estipulanteViewModel_Cnae").empty().trigger('change');
            $("#estipulanteViewModel_Cnae").trigger('change');


            if ($("#estipulanteViewModel_Cnae_text").val() !== "" && $("#estipulanteViewModel_Cnae_id").val() !== "") //...consulta de cotação
            {
                $("#select2-estipulanteViewModel_Cnae-container").prop("innerText", $("#estipulanteViewModel_Cnae_text").val() + " - (" + $("#estipulanteViewModel_Cnae_id").val() + ")");
                $("#estipulanteViewModel_Cnae").val($("#estipulanteViewModel_Cnae_id").val());
                $("#estipulanteViewModel_Cnae").prop("disabled", true);
            }
        }
    }
});
