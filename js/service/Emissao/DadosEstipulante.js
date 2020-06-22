//Inicialização de objetos
var estipulantePrincipalDCE = null;

//Classes

window.DadosEstipulanteUi = {
    //Alterações da Tela: Bloqueio/Show/Hide/Preencher/Limpar
    initialize: function (callback) {
        window.DadosEstipulanteUi.layoutEstrutura();
        window.DadosEstipulanteUi.layoutPessoaFisicaJuridica();
        window.DadosEstipulanteUi.popularPlanos();
        window.DadosEstipulanteUi.popularDadosIniciais();
    },

    layoutEstrutura: function () {
        $('#cepDCE').mask("00000-000");

        $('#telefoneDCE').mask("(00) 0000-0009")
        $('#telefoneDCE').blur(function (event) {
            if ($(this).val().length == 15) {
                $('#telefoneDCE').mask('(00) 00000-0009');
            } else {
                $('#telefoneDCE').mask('(00) 0000-00009');
            }
        });

        $('emailDCE').mask("A", {
            translation: {
                "A": { pattern: /[\w@\-.+]/, recursive: true }
            }
        });
    },

    layoutPessoaFisicaJuridica: function () {

        if (estipulantePrincipalDCE == null)
            return;

        if (estipulantePrincipalDCE.TipoPessoa == "F") {
            $("#divMeiCei").show();
            $("#divDadosPessoaFisica").show();
            $("#identificacaoTipoDCE").text("Nome");
            $("#documentoTipoDCE").text("CPF");
            $("#documentoNumeroDCE").mask("000.000.000-00");
        }
        else {
            $("#divMeiCei").hide();
            $("#divDadosPessoaFisica").hide();
            $("#identificacaoTipoDCE").text("Razão Social");
            $("#documentoTipoDCE").text("CNPJ");
            $("#documentoNumeroDCE").mask("00.000.000/0000-00");
        }
    },

    popularDadosIniciais: function () {
        $("#identificacaoDCE").text(estipulantePrincipalDCE.Nome);
        $("#documentoNumeroDCE").text(estipulantePrincipalDCE.NumeroCpfCnpj);

        if (estipulantePrincipalDCE.TipoPessoa == "F") {
            $("#atividadeDCE").text(estipulantePrincipalDCE.Ocupacao.Descricao + " - (" + estipulantePrincipalDCE.Ocupacao.Codigo + ")");

            if (estipulantePrincipalDCE.CodigoMeiCei != null) {
                $("#meiCeiDCE").text(estipulantePrincipalDCE.CodigoMeiCei);
            }

            $("#documentoNumeroDCE").mask("000.000.000-00");
        }
        else {
            $("#atividadeDCE").text(estipulantePrincipalDCE.Cnae.Descricao + " - (" + estipulantePrincipalDCE.Cnae.Codigo + ")");
            $("#documentoNumeroDCE").mask("00.000.000/0000-00");
        }

        $("#cenarioDCE").text(cotacao.PropostaEmissao.NumeroCenario);
        $("#versaoDCE").text(cotacao.PropostaEmissao.NumeroVersao);

        if (estipulantePrincipalDCE.Telefone.Numero != null) {
            $('#telefoneDCE').val(estipulantePrincipalDCE.Telefone.DDD + estipulantePrincipalDCE.Telefone.Numero);
            if ($('#telefoneDCE').val().length == 11) {
                $('#telefoneDCE').mask('(00) 00000-0009');
            } else {
                $('#telefoneDCE').mask('(00) 0000-00009');
            }
        }

        if (estipulantePrincipalDCE.Email != null) {
            $('#emailDCE').val(estipulantePrincipalDCE.Email);
        }

        if (estipulantePrincipalDCE.Endereco.NumeroCep != null && estipulantePrincipalDCE.Endereco.NumeroCep != 0) {
            //O zero é porque alguém deixou o objeto de CEP da cotação como INT
            $('#cepDCE').val("0" + estipulantePrincipalDCE.Endereco.NumeroCep);
            $('#cepDCE').mask("00000-000");
        }

        if (estipulantePrincipalDCE.Endereco.NomeLogradouro != null) {
            $('#logradouroDCE').val(estipulantePrincipalDCE.Endereco.NomeLogradouro);
        }

        if (estipulantePrincipalDCE.Endereco.NumeroLogradouro != null) {
            $('#numeroLogradouroDCE').val(estipulantePrincipalDCE.Endereco.NumeroLogradouro);
            
        }

        if (estipulantePrincipalDCE.Endereco.Complemento != null) {
            $('#complementoLogradouroDCE').val(estipulantePrincipalDCE.Endereco.Complemento);
        }

        if (estipulantePrincipalDCE.Endereco.NomeBairro != null) {
            $('#bairroDCE').val(estipulantePrincipalDCE.Endereco.NomeBairro);
        }

        if (estipulantePrincipalDCE.Endereco.NomeCidade != null) {
            $('#cidadeDCE').val(estipulantePrincipalDCE.Endereco.NomeCidade);
        }
    },

    popularPlanos: function () {

        var numeroPlanoCondicoesComerciais = cotacao.Itens.filter(function (item) {
            return item.Estipulante.NumeroCpfCnpj == cotacao.EstipulantePrincipal.NumeroCPFCNPJ;
        })[0].NumeroPlanoCondicoesComerciais;

        var planosDCE = cotacao.CenariosCotacao.filter(x => x.numeroCenario == cotacao.PropostaEmissao.NumeroCenario)[0].planosCondicoesComerciais;

        $('#selectPlanoDCE').empty();
        $('#selectPlanoDCE').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < planosDCE.length; i++) {
            $('#selectPlanoDCE').append('<option value="' + planosDCE[i].numeroPlano + '">' + planosDCE[i].numeroPlano + " - " + planosDCE[i].nomePlano + '</option>');
        }

        if (numeroPlanoCondicoesComerciais != null && numeroPlanoCondicoesComerciais != 0) {
            $('#selectPlanoDCE').val(numeroPlanoCondicoesComerciais);
        }
    },

    popularTipoLogradouro: function (data) {
        $('#selectTipoLogradouroDCE').empty();
        $('#selectTipoLogradouroDCE').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < data.length; i++) {
            $('#selectTipoLogradouroDCE').append('<option value="' + data[i].codigoDominio + '">' + data[i].descricaoDominio.toUpperCase() + '</option>');
        }

        if (estipulantePrincipalDCE.Endereco.TipoLogradouro != null) {
            $('#selectTipoLogradouroDCE').val(estipulantePrincipalDCE.Endereco.TipoLogradouro).change();
        }
    },

    popularListaUF: function (data) {

        $('#selectUFDCE').empty();
        $('#selectUFDCE').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < data.length; i++) {
            $('#selectUFDCE').append('<option value="' + data[i].value + '">' + data[i].text + '</option>');
        }

        if (estipulantePrincipalDCE.Endereco.SiglaUF != null) {
            $('#selectUFDCE').val(estipulantePrincipalDCE.Endereco.SiglaUF).change();
        }
    },

    popularFaixaRenda: function (data) {

        var dataOrdem = data.sort(function (a, b) {
            return a.codigoDominio - b.codigoDominio;
        });

        $('#selectFaixaRendaDCE').empty();
        $('#selectFaixaRendaDCE').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < dataOrdem.length; i++) {
            $('#selectFaixaRendaDCE').append('<option value="' + dataOrdem[i].codigoDominio + '">' + dataOrdem[i].descricaoDominio + '</option>');
        }

        if (estipulantePrincipalDCE.CodigoFaixaRenda != null) {
            $('#selectFaixaRendaDCE').val(estipulantePrincipalDCE.CodigoFaixaRenda).change();
        }
    },

    popularEndereco: function (data) {

        if (data.endereco.tipoLogradouro != null)
            $('#selectTipoLogradouroDCE').val($("#selectTipoLogradouroDCE option:contains(" + data.endereco.tipoLogradouro + ")").val()).change();

        if (data.endereco.nomeLogradouro != null)
            $('#logradouroDCE').val(data.endereco.nomeLogradouro);

        if (data.endereco.nomeBairro != null)
            $('#bairroDCE').val(data.endereco.nomeBairro);

        if (data.endereco.nomeCidade != null)
            $('#cidadeDCE').val(data.endereco.nomeCidade);

        if (data.endereco.siglaUF != null)
            $('#selectUFDCE').val($("#selectUFDCE option:contains(" + data.endereco.siglaUF + ")").val()).change();
    },

    limparEndereco: function () {
        $('#selectTipoLogradouroDCE').val("-1");
        $('#logradouroDCE').val("");
        $('#numeroLogradouroDCE').val("");
        $('#complementoLogradouroDCE').val("");
        $('#bairroDCE').val("");
        $('#cidadeDCE').val("");
        $('#selectUFDCE').val("-1");
    }
}

window.DadosEstipulanteFunctions = {
    //Funcionalidades/Ajax/Alterações De Comportamento/Objeto
    initialize: function (callback) {
        window.DadosEstipulanteFunctions.obterDadosEstipulante();
        window.DadosEstipulanteFunctions.obterFaixaRenda();
        window.DadosEstipulanteFunctions.obterTipoLogradouro();
        window.DadosEstipulanteFunctions.obterListaUF();
        callback && callback();
    },

    obterFaixaRenda: function (callback) {
        if (estipulantePrincipalDCE.TipoPessoa == "F") {
            $.ajax({
                url: '/emissao/ObterFaixaRenda/',
                type: 'get',
                contentType: "application/json",
                success: function (data) {
                    closeModalWait();
                    window.DadosEstipulanteUi.popularFaixaRenda(data);
                    callback && callback();
                },
                error: function (data) {
                    closeModalWait();
                    var errors = JSON.parse(data.responseText);
                    for (var i = 0; i < errors.length; i++) {
                        notification("erro", errors[i], '');
                    }
                }
            })
        }
    },

    obterTipoLogradouro: function (callback) {
        $.ajax({
            url: '/emissao/ObterTipoLogradouro/',
            type: 'get',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosEstipulanteUi.popularTipoLogradouro(data);
                callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            }
        })
    },

    obterListaUF: function (callback) {
        $.ajax({
            url: '/emissao/ObterListaUF/',
            type: 'get',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosEstipulanteUi.popularListaUF(data);
                callback && callback();
            },
            error: function (data) {
                closeModalWait();
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            }
        })
    },

    buscarCEP: function (callback) {
        $.ajax({
            url: '/emissao/BuscarCEP/' + $('#cepDCE').val(),
            type: 'get',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosEstipulanteUi.popularEndereco(data);
                callback && callback();
            },
            error: function (data) {
                closeModalWait();

                if (data.status == 500) {
                    notification("erro", "Não foi possível obter o Endereço pelo CEP, tente novamente mais tarde.", '');
                }
                else {
                    var errors = JSON.parse(data.responseText);
                    for (var i = 0; i < errors.length; i++) {
                        notification("erro", errors[i], '');
                    }
                }
            }
        })
    },

    atualizarEstipulante: function (callback) {
        $.ajax({
            url: '/emissao/AtualizarEstipulante/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                notification("sucesso", "Dados Complementares do Estipulante atualizados com sucesso.", "");

                cotacao.Itens[0].NumeroPlanoCondicoesComerciais = $('#selectPlanoDCE').val();
                cotacao.Itens[0].Estipulante = estipulantePrincipalDCE;

                window.DadosSubEstipulanteUi.popularGridEstipulantes();
                window.DadosSubEstipulanteUi.validarBotaoAddSubEstipulante();

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
                NumeroPlano: parseInt($('#selectPlanoDCE').val()),
                NumeroItem: "1",
                Estipulante: estipulantePrincipalDCE
            })
        })
    },

    obterDadosEstipulante: function () {
        estipulantePrincipalDCE = cotacao.Itens.filter(function (item) {
            return item.Estipulante.NumeroCpfCnpj == cotacao.EstipulantePrincipal.NumeroCPFCNPJ;
        })[0].Estipulante;
    },

    //TODO Colocar em um Helper
    validarCEP: function () {

        $("#cepDCE").removeClass("input-validation-error");
        var cep = $('#cepDCE').val().replace(/^\s+|\s+$/g, '');
        var regexCEP = /^[0-9]{2}\.[0-9]{3}-[0-9]{3}$/;

        if (cep.length <= 0 && !regexCEP.test(cep)) {
            $("#cepDCE").addClass("input-validation-error");
            notification("erro", "CEP inválido.", '');
            return false;
        }

        return true;
    },

    validarDadosEstipulante: function () {

        var validacao = true;

        $("#selectFaixaRendaDCE").removeClass("input-validation-error");
        if ($('#selectFaixaRendaDCE').val() == "-1") {
            $("#selectFaixaRendaDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo Faixa de Renda é obrigatório.", '');
            validacao = false;
        }

        $("#telefoneDCE").removeClass("input-validation-error");
        $('#telefoneDCE').blur();
        if ($('#telefoneDCE').val().length < 14) {
            $("#telefoneDCE").addClass("input-validation-error");
            notification("erro", "Telefone inválido.", '');
            validacao = false;
        }

        if ($('#telefoneDCE').val() == "") {
            $("#telefoneDCE").addClass("input-validation-error");
            notification("erro", "O prenchimento do campo Telefone é obrigatório.", '');
            validacao = false;
        }

        $("#emailDCE").removeClass("input-validation-error");
        var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regexEmail.test($('#emailDCE').val().toLowerCase())) {
            $("#emailDCE").addClass("input-validation-error");
            notification("erro", "E-mail inválido.", '');
            validacao = false;
        }

        if ($('#emailDCE').val() == "") {
            $("#emailDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo E-mail é obrigatório.", '');
            validacao = false;
        }

        $("#selectPlanoDCE").removeClass("input-validation-error");
        if ($('#selectPlanoDCE').val() == "-1") {
            $("#selectPlanoDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo Plano é obrigatório.", '');
            validacao = false;
        }

        $("#cepDCE").removeClass("input-validation-error");
        var cep = $('#cepDCE').val().replace(/^\s+|\s+$/g, '');
        var regexCEP = /^[0-9]{2}\.[0-9]{3}-[0-9]{3}$/;

        if (cep.length <= 0 && !regexCEP.test(cep)) {
            $("#cepDCE").addClass("input-validation-error");
            notification("erro", "CEP inválido.", '');
            validacao = false;
        }

        if ($('#cepDCE').val() == "") {
            $("#cepDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo CEP é obrigatório.", '');
            validacao = false;
        }

        $("#selectTipoLogradouroDCE").removeClass("input-validation-error");
        if ($('#selectTipoLogradouroDCE').val() == "-1") {
            $("#selectTipoLogradouroDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo tipo logradouro é obrigatório.", '');
            validacao = false;
        }

        $("#numeroLogradouroDCE").removeClass("input-validation-error");
        if ($('#numeroLogradouroDCE').val() == "") {
            $("#numeroLogradouroDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo número é obrigatório.", '');
            validacao = false;
        }

        $("#bairroDCE").removeClass("input-validation-error");
        if ($('#bairroDCE').val() == "") {
            $("#bairroDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo bairro é obrigatório.", '');
            validacao = false;
        }

        $("#cidadeDCE").removeClass("input-validation-error");
        if ($('#cidadeDCE').val() == "") {
            $("#cidadeDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo cidade é obrigatório.", '');
            validacao = false;
        }

        $("#cidadeDCE").removeClass("input-validation-error");
        if ($('#cidadeDCE').val() == "") {
            $("#cidadeDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo cidade é obrigatório.", '');
            validacao = false;
        }

        $("#selectUFDCE").removeClass("input-validation-error");
        if ($('#selectUFDCE').val() == "-1") {
            $("#selectUFDCE").addClass("input-validation-error");
            notification("erro", "O preenchimento do campo UF é obrigatório.", '');
            validacao = false;
        }

        return validacao;
    },

    popularObjetoEstipulante: function () {
        var telefoneFormatado = $('#telefoneDCE').val().replace("(", "").replace("-", "").replace(" ", "");
        estipulantePrincipalDCE.Telefone.DDD = telefoneFormatado.split(")")[0];
        estipulantePrincipalDCE.Telefone.Numero = telefoneFormatado.split(")")[1];

        estipulantePrincipalDCE.Email = $('#emailDCE').val();

        estipulantePrincipalDCE.Endereco.NumeroCep = parseInt($('#cepDCE').val().replace("-", ""));
        estipulantePrincipalDCE.Endereco.TipoLogradouro = $('#selectTipoLogradouroDCE').val();
        estipulantePrincipalDCE.Endereco.NomeLogradouro = $('#logradouroDCE').val();
        estipulantePrincipalDCE.Endereco.NumeroLogradouro = $('#numeroLogradouroDCE').val();
        estipulantePrincipalDCE.Endereco.Complemento = $('#complementoLogradouroDCE').val();
        estipulantePrincipalDCE.Endereco.NomeBairro = $('#bairroDCE').val();
        estipulantePrincipalDCE.Endereco.NomeCidade = $('#cidadeDCE').val();
        estipulantePrincipalDCE.Endereco.SiglaUF = $('#selectUFDCE').val();

        if (estipulantePrincipalDCE.TipoPessoa == "F") {
            estipulantePrincipalDCE.CodigoFaixaRenda = $('#selectFaixaRendaDCE').val();
            estipulantePrincipalDCE.IndicadorPEP = $('input[name="RelacionamentoPolitico"]:checked').val() == "true";
        }
    },
}

window.DadosEstipulanteEvents = {
    //OnCLick/OnChange/OnBlur/On's
    initialize: function (callback) {

    },

    onClickCEP: function () {
        if (window.DadosEstipulanteFunctions.validarCEP()) {
            window.DadosEstipulanteUi.limparEndereco();
            window.DadosEstipulanteFunctions.buscarCEP();
        }
    },

    onClickAtualizarDCE: function () {
        if (window.DadosEstipulanteFunctions.validarDadosEstipulante()) {
            window.DadosEstipulanteFunctions.popularObjetoEstipulante();
            window.DadosEstipulanteFunctions.atualizarEstipulante();
        }
    },

    onChangeEmail: function () {
        var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regexEmail.test($('#emailDCE').val().toLowerCase())) {
            notification("erro", "E-mail inválido.", '');
        }
    }
}

$(document).ready(function () {

});