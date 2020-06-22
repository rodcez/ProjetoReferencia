//Inicialização de objetos
var estipulanteDSE = null;
var listaUFData = null;
var listaTipoLogradouroData = null;
var listaFaixaRendaData = null;
var NumeroItemEstipulante = "";

//Classes

window.DadosSubEstipulanteUi = {
    //Alterações da Tela: Bloqueio/Show/Hide/Preencher/Limpar
    initialize: function (callback) {

    },

    layoutEstrutura: function () {

        $('#cepDSE').mask("00000-000");

        $('#telefoneDSE').mask("(00) 0000-0009")
        $('#telefoneDSE').blur(function (event) {
            if ($(this).val().length == 15) {
                $('#telefoneDSE').mask('(00) 00000-0009');
            } else {
                $('#telefoneDSE').mask('(00) 0000-00009');
            }
        });

        $('emailDSE').mask("A", {
            translation: {
                "A": { pattern: /[\w@\-.+]/, recursive: true }
            }
        });

        if ($("input[name='TipoPessoaDSE']:checked").val() == "F") {
            $("#documentoNumeroDSE").mask("000.000.000-00");
        } else {
            $("#documentoNumeroDSE").mask("00.000.000/0000-00");
        }
    },

    criarEstruturaTable: function () {

        $('#divTableEstipulante').empty();

        $('#divTableEstipulante').html(
            '<table class="dataTable lista-selected" cellspacing="0" cellpadding="0" id="tableEstipulante">' +
            '   <thead>' +
            '       <tr style="font-size:13px;">' +
            '           <th class="col-md-1 col-sm-1" style="padding: 10px; color: white; border: 1px solid white;"></th>' +
            '           <th class="col-md-2 col-sm-2" style="padding: 10px; color: white; border: 1px solid white;">CPF/CNPJ</th>' +
            '           <th class="col-md-2 col-sm-2" style="padding: 10px; color: white; border: 1px solid white;">Estipulante/Subestipulante</th>' +
            '           <th class="col-md-2 col-sm-2" style="padding: 10px; color: white; border: 1px solid white;">Plano</th>' +
            '           <th class="col-md-1 col-sm-1" style="padding: 10px; color: white; border: 1px solid white;"></th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody></tbody>' +
            '</table>');
    },

    popularGridEstipulantes: function () {

        window.DadosSubEstipulanteUi.criarEstruturaTable();

        for (var i = 0; i < cotacao.Itens.length; i++) {

            var estipulante = cotacao.Itens[i].Estipulante;

            //Concatenar nome do plano com número
            var nomePlano = "";
            var cenarioEmissao = cotacao.CenariosCotacao.filter(x => x.numeroCenario == cotacao.PropostaEmissao.NumeroCenario)[0];
            if (cotacao.Itens[i].NumeroPlanoCondicoesComerciais != null) {
                var nomePlanoTemp = cenarioEmissao.planosCondicoesComerciais.filter(y => y.numeroPlano == cotacao.Itens[i].NumeroPlanoCondicoesComerciais)[0].nomePlano;
                nomePlano = cotacao.Itens[i].NumeroPlanoCondicoesComerciais + " - " + nomePlanoTemp;
            }

            //Identificar CPF/CNPJ e aplicar a máscara correspondente
            var cpf_cnpj = estipulante.NumeroCpfCnpj.replace(".", "").replace("-", "").replace("/", "");
            if (estipulante.TipoPessoa == "F")
                cpf_cnpj = cpf_cnpj.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
            else
                cpf_cnpj = cpf_cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, "$1.$2.$3/$4-$5")

            //Verificar se é o estiúlante principal para não apresentar os botões excluir/editar
            var estipulantePrincipal = cotacao.EstipulantePrincipal.NumeroCPFCNPJ == estipulante.NumeroCpfCnpj;
            var botoes = estipulantePrincipal ? '' :
                '<span class="glyphicon glyphicon-pencil" title="Editar" onclick="window.DadosSubEstipulanteEvents.onClickEditarSub(' + cotacao.Itens[i].NumeroItem + ')"> </span> ' +
                '<span class="glyphicon glyphicon-trash" title="Excluir" onclick="window.DadosSubEstipulanteEvents.onClickExcluirSub(' + cotacao.Itens[i].NumeroItem + ')"></span>';

            //Montar a tabela
            $('#tableEstipulante > tbody').append(
                '<tr id="' + cotacao.Itens[i].NumeroItem + '">' +
                '   <td class="col-md-1 col-sm-1 text-center" style="padding: 0px;">' + (i + 1) + '</td>' +
                '   <td class="col-md-3 col-sm-1 text-left">' + cpf_cnpj + '</td>' +
                '   <td class="col-md-4 col-sm-1 text-left">' + estipulante.Nome + '</td>' +
                '   <td class="col-md-3 col-sm-1 text-left">' + nomePlano + '</td>' +
                '   <td class="col-md-2 col-sm-1 text-center" style="padding: 0px;">' + botoes + '</td>' +
                '</tr> ');
        };

        window.DadosSubEstipulanteUi.aplicarEstruturaTable();
        window.FavorecidosComissionamentoFunctions.carregarFavorecidos();

    },

    aplicarEstruturaTable: function () {
        $('#tableEstipulante').DataTable({
            "language": {
                "sEmptyTable": "Nenhum registro encontrado",
                "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "",
                "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                "sInfoPostFix": "",
                "sInfoThousands": ".",
                "sLengthMenu": "_MENU_ resultados por página",
                "sLoadingRecords": "Carregando...",
                "sProcessing": "Processando...",
                "sZeroRecords": "Nenhum registro encontrado",
                "sSearch": "Filtrar: &nbsp;",
                "oPaginate": {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                },
                "oAria": {
                    "sSortAscending": ": Ordenar colunas de forma ascendente",
                    "sSortDescending": ": Ordenar colunas de forma descendente"
                },
                "select": {
                    "rows": {
                        "_": "Selecionado %d linhas",
                        "0": "Nenhuma linha selecionada",
                        "1": "Selecionado 1 linha"
                    }
                }
            }
        });
    },

    alterarTipoPessoa: function () {
        if ($("input[name='TipoPessoaDSE']:checked").val() == "F") {
            $("#modal-body-estipulante").height(950);
            $("#divAtividade").removeClass("col-md-12 col-sm-12 pl-0");
            $("#divAtividade").addClass("col-md-8 col-sm-8 pl-0");

            $('#divMeiCeiDSE').show();
            $('#divDadosPessoaFisicaDSE').show();

            $('#documentoTipoDSE').text("CPF");
            $("#documentoNumeroDSE").mask("000.000.000-00");
            $('#identificacaoTipoDSE').text("Nome");

            window.DadosSubEstipulanteFunctions.obterFaixaRenda();
            window.DadosSubEstipulanteFunctions.obterOcupacoesPF();
        } else {
            $("#modal-body-estipulante").height(850);
            $("#divAtividade").removeClass("col-md-8 col-sm-8 pl-0");
            $("#divAtividade").addClass("col-md-12 col-sm-12 pl-0");

            $('#divMeiCeiDSE').hide();
            $('#divDadosPessoaFisicaDSE').hide();

            $('#documentoTipoDSE').text("CNPJ");
            $("#documentoNumeroDSE").mask("00.000.000/0000-00");
            $('#identificacaoTipoDSE').text("Razão Social");

            window.DadosSubEstipulanteFunctions.obterOcupacoesPJ();
        }

        window.DadosSubEstipulanteFunctions.obterListaUF();
        window.DadosSubEstipulanteFunctions.obterTipoLogradouro();
    },

    popularEndereco: function (data) {

        if (data.endereco.tipoLogradouro != null)
            $('#selectTipoLogradouroDSE').val($("#selectTipoLogradouroDSE option:contains(" + data.endereco.tipoLogradouro + ")").val()).change();

        if (data.endereco.nomeLogradouro != null)
            $('#logradouroDSE').val(data.endereco.nomeLogradouro);

        if (data.endereco.nomeBairro != null)
            $('#bairroDSE').val(data.endereco.nomeBairro);

        if (data.endereco.nomeCidade != null)
            $('#cidadeDSE').val(data.endereco.nomeCidade);

        if (data.endereco.siglaUF != null)
            $('#selectUFDSE').val($("#selectUFDSE option:contains(" + data.endereco.siglaUF + ")").val()).change();
    },

    popularDadosSubEstipulante: function () {

        if (estipulanteDSE == null) {
            return;
        }

        $("#identificacaoDSE").val(estipulanteDSE.Nome);
        $("#documentoNumeroDSE").val(estipulanteDSE.NumeroCpfCnpj);

        if (estipulanteDSE.TipoPessoa == "F") {
            $('#FTipoPessoaDSE').prop("checked", true);

            $("#selectAtividadeDSE").val(estipulanteDSE.Ocupacao.Codigo);
            $("#selectFaixaRendaDSE").val(estipulanteDSE.CodigoFaixaRenda);

            if (estipulanteDSE.CodigoMeiCei != null) {
                $("#meiCeiDSE").val(estipulanteDSE.CodigoMeiCei);
            }

            if (estipulanteDSE.IndicadorPEP) {
                $('#SimRelacionamentoPoliticoDSE').prop("checked", true);
            } else {
                $('#NaoRelacionamentoPoliticoDSE').prop("checked", true);
            }

            $("#documentoNumeroDSE").mask("000.000.000-00");
        }
        else {
            $('#JTipoPessoaDSE').prop("checked", true);

            $("#selectAtividadeDSE").val(estipulanteDSE.Cnae.Codigo);
            $("#documentoNumeroDSE").mask("00.000.000/0000-00");
        }

        $("#selectTipoPessoaDSE").change();

        $("#cenarioDSE").text(cotacao.PropostaEmissao.NumeroCenario);
        $("#versaoDSE").text(cotacao.PropostaEmissao.NumeroVersao);

        if (estipulanteDSE.Telefone.Numero != null) {
            $('#telefoneDSE').val(estipulanteDSE.Telefone.DDD + estipulanteDSE.Telefone.Numero);
            if ($('#telefoneDSE').val().length == 11) {
                $('#telefoneDSE').mask('(00) 00000-0009');
            } else {
                $('#telefoneDSE').mask('(00) 0000-00009');
            }
        }

        if (estipulanteDSE.Email != null) {
            $('#emailDSE').val(estipulanteDSE.Email);
        }

        if (estipulanteDSE.Endereco.NumeroCep != null && estipulanteDSE.Endereco.NumeroCep != 0) {
            //O zero é porque alguém deixou o objeto de CEP da cotação como INT
            $('#cepDSE').val("0" + estipulanteDSE.Endereco.NumeroCep);
            $('#cepDSE').mask("00000-000");
        }

        if (estipulanteDSE.Endereco.TipoLogradouro != null) {
            $('#selectTipoLogradouroDSE').val(estipulanteDSE.Endereco.TipoLogradouro);
        }

        if (estipulanteDSE.Endereco.NomeLogradouro != null) {
            $('#logradouroDSE').val(estipulanteDSE.Endereco.NomeLogradouro);
        }

        if (estipulanteDSE.Endereco.NumeroLogradouro != null) {
            $('#numeroLogradouroDSE').val(estipulanteDSE.Endereco.NumeroLogradouro);
        }

        if (estipulanteDSE.Endereco.Complemento != null) {
            $('#complementoLogradouroDSE').val(estipulanteDSE.Endereco.Complemento);
        }

        if (estipulanteDSE.Endereco.NomeBairro != null) {
            $('#bairroDSE').val(estipulanteDSE.Endereco.NomeBairro);
        }

        if (estipulanteDSE.Endereco.NomeCidade != null) {
            $('#cidadeDSE').val(estipulanteDSE.Endereco.NomeCidade);
        }
    },

    popularPlanos: function () {
        var numeroPlanoCondicoesComerciais = 0;
        if (estipulanteDSE != null) {
            numeroPlanoCondicoesComerciais = cotacao.Itens.filter(function (item) {
                return item.Estipulante.NumeroCpfCnpj == estipulanteDSE.NumeroCpfCnpj;
            })[0].NumeroPlanoCondicoesComerciais;
        }

        $("#cenarioDSE").text(cotacao.PropostaEmissao.NumeroCenario);
        $("#versaoDSE").text(cotacao.PropostaEmissao.NumeroVersao);

        var planosDSE = cotacao.CenariosCotacao.filter(x => x.numeroCenario == cotacao.PropostaEmissao.NumeroCenario)[0].planosCondicoesComerciais;

        $('#selectPlanoDSE').empty();
        $('#selectPlanoDSE').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < planosDSE.length; i++) {
            $('#selectPlanoDSE').append('<option value="' + planosDSE[i].numeroPlano + '">' + planosDSE[i].numeroPlano + " - " + planosDSE[i].nomePlano + '</option>');
        }

        if (numeroPlanoCondicoesComerciais != null && numeroPlanoCondicoesComerciais != 0) {
            $('#selectPlanoDSE').val(numeroPlanoCondicoesComerciais);
        }

        $('#selectPlanoDSE').select2({ dropdownParent: $('#modalEstipulante') });
    },

    popularTipoLogradouro: function (data) {
        $('#selectTipoLogradouroDSE').empty();
        $('#selectTipoLogradouroDSE').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < data.length; i++) {
            $('#selectTipoLogradouroDSE').append('<option value="' + data[i].codigoDominio + '">' + data[i].descricaoDominio.toUpperCase() + '</option>');
        }

        if (estipulanteDSE != null && estipulanteDSE.Endereco.TipoLogradouro != null) {
            $('#selectTipoLogradouroDSE').val(estipulanteDSE.Endereco.TipoLogradouro).change();
        }

        $('#selectTipoLogradouroDSE').select2({ dropdownParent: $('#modalEstipulante') });
        $('#selectPlanoDSE').select2({ dropdownParent: $('#modalEstipulante') });
    },

    popularListaUF: function (data) {

        $('#selectUFDSE').empty();
        $('#selectUFDSE').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < data.length; i++) {
            $('#selectUFDSE').append('<option value="' + data[i].value + '">' + data[i].text + '</option>');
        }

        if (estipulanteDSE != null && estipulanteDSE.Endereco.SiglaUF != null) {
            $('#selectUFDSE').val(estipulanteDSE.Endereco.SiglaUF).change();
        }

        $('#selectUFDSE').select2({ dropdownParent: $('#modalEstipulante') });
    },

    popularFaixaRenda: function (data) {

        var dataOrdem = data.sort(function (a, b) {
            return a.codigoDominio - b.codigoDominio;
        });

        $('#selectFaixaRendaDSE').empty();
        $('#selectFaixaRendaDSE').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < dataOrdem.length; i++) {
            $('#selectFaixaRendaDSE').append('<option value="' + dataOrdem[i].codigoDominio + '">' + dataOrdem[i].descricaoDominio + '</option>');
        }

        if (estipulanteDSE != null && estipulanteDSE.CodigoFaixaRenda != null) {
            $('#selectFaixaRendaDSE').val(estipulanteDSE.CodigoFaixaRenda).change();
        }

        $('#selectFaixaRendaDSE').select2({ dropdownParent: $('#modalEstipulante') });
    },

    popularAtividades: function (data) {
        $('#selectAtividadeDSE').empty();
        $('#selectAtividadeDSE').append('<option value="-1">Selecione</option>');

        for (var i = 0; i < data.length; i++) {
            $('#selectAtividadeDSE').append('<option value="' + data[i].id + '">' + data[i].text + '</option>');
        }

        if (estipulanteDSE != null) {
            if (estipulanteDSE.TipoPessoa == "F") {
                $('#selectAtividadeDSE').val(estipulanteDSE.Ocupacao.Codigo).change();
            } else {
                $('#selectAtividadeDSE').val(estipulanteDSE.Cnae.Codigo).change();
            }
        }

        $('#selectAtividadeDSE').select2({ dropdownParent: $('#modalEstipulante') });
    },

    limparModal: function () {
        $('#JTipoPessoaDSE').prop("checked", true).change();

        $("#documentoNumeroDSE").val("");
        $('#identificacaoDSE').val("");
        $('#meiCeiDSE').val("");
        $('#telefoneDSE').val("");
        $('#emailDSE').val("");
        $('#cepDSE').val("");

        $('#selectAtividadeDSE').empty();
        $('#selectAtividadeDSE').append('<option value="-1">Selecione</option>');
        $('#selectPlanoDSE').empty();
        $('#selectPlanoDSE').append('<option value="-1">Selecione</option>');

        $('#logradouroDSE').val("");
        $('#numeroLogradouroDSE').val("");
        $('#complementoLogradouroDSE').val("");
        $('#bairroDSE').val("");
        $('#cidadeDSE').val("");

        $('#selectTipoLogradouroDSE').empty();
        $('#selectTipoLogradouroDSE').append('<option value="-1">Selecione</option>');
        $('#selectUFDSE').empty();
        $('#selectUFDSE').append('<option value="-1">Selecione</option>');
    },

    limparEndereco: function () {

        $('#logradouroDSE').val("");
        $('#numeroLogradouroDSE').val("");
        $('#complementoLogradouroDSE').val("");
        $('#bairroDSE').val("");
        $('#cidadeDSE').val("");

        $('#selectTipoLogradouroDSE').val("-1")
        $('#selectUFDSE').val("-1");
    },

    limparErros: function () {
        $("#documentoNumeroDSE").removeClass("input-validation-error");
        $('#identificacaoDSE').removeClass("input-validation-error");
        $('#telefoneDSE').removeClass("input-validation-error");
        $('#emailDSE').removeClass("input-validation-error");

        $('#cepDSE').removeClass("input-validation-error");
        $('#logradouroDSE').removeClass("input-validation-error");
        $('#numeroLogradouroDSE').removeClass("input-validation-error");
        $('#bairroDSE').removeClass("input-validation-error");
        $('#cidadeDSE').removeClass("input-validation-error");

        $('#selectAtividadeDSE').removeClass("input-validation-error");
        $('#selectPlanoDSE').removeClass("input-validation-error");
        $('#selectTipoLogradouroDSE').removeClass("input-validation-error");
        $('#selectUFDSE').removeClass("input-validation-error");
    },

    validarBotaoAddSubEstipulante: function () {
        var ItemEstipulantePrincipal = cotacao.Itens.filter(function (item) {
            return item.Estipulante.NumeroCpfCnpj == cotacao.EstipulantePrincipal.NumeroCPFCNPJ;
        })[0];

        if (ItemEstipulantePrincipal.NumeroPlanoCondicoesComerciais != null) {
            $('#btAddEstipulante').removeAttr('disabled');
        }
    }
}

window.DadosSubEstipulanteFunctions = {
    //Funcionalidades/Ajax/Alterações De Comportamento/Objeto
    initialize: function (callback) {
        window.DadosSubEstipulanteUi.validarBotaoAddSubEstipulante();
        window.DadosSubEstipulanteUi.popularGridEstipulantes();

        callback && callback();
    },

    obterFaixaRenda: function (callback) {
        if ($("input[name='TipoPessoaDSE']:checked").val() == "F") {
            $.ajax({
                url: '/emissao/ObterFaixaRenda/',
                type: 'get',
                contentType: "application/json",
                success: function (data) {
                    closeModalWait();
                    window.DadosSubEstipulanteUi.popularFaixaRenda(data);
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
                window.DadosSubEstipulanteUi.popularTipoLogradouro(data);
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
                window.DadosSubEstipulanteUi.popularListaUF(data);
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

    obterOcupacoesPJ: function (callback) {
        $.ajax({
            url: '/ObterOcupacoesPJ/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosSubEstipulanteUi.popularAtividades(data);
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

    obterOcupacoesPF: function (callback) {
        $.ajax({
            url: '/ObterOcupacoesPF/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosSubEstipulanteUi.popularAtividades(data);
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
            url: '/emissao/BuscarCEP/' + $('#cepDSE').val(),
            type: 'get',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                window.DadosSubEstipulanteUi.popularEndereco(data);
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

    salvarEstipulante: function (callback) {
        $.ajax({
            url: '/emissao/AtualizarEstipulante/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                notification("sucesso", "Subestipulante salvo com sucesso.", "");
                $('#modalEstipulante').modal('hide');

                var item = {
                    NumeroItem: NumeroItemEstipulante,
                    NumeroPlanoCondicoesComerciais: parseInt($('#selectPlanoDSE').val()),
                    Estipulante: estipulanteDSE
                };

                var itemEncontrado = false;

                for (var i = 0; i < cotacao.Itens.length; i++) {
                    if (cotacao.Itens[i].NumeroItem == NumeroItemEstipulante) {
                        cotacao.Itens[i] = item;
                        itemEncontrado = true;
                        break;
                    }
                }

                if (!itemEncontrado) {
                    cotacao.Itens.push(item);
                }

                window.DadosSubEstipulanteUi.popularGridEstipulantes();
                window.DadosSubEstipulanteUi.limparModal();

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
                NumeroItem: NumeroItemEstipulante,
                NumeroPlano: parseInt($('#selectPlanoDSE').val()),
                Estipulante: estipulanteDSE
            })
        })
    },

    excluirSubEstipulante: function (numeroItem, callback) {
        $.ajax({
            url: '/emissao/ExcluirEstipulante/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                closeModalWait();
                notification("sucesso", "Subestipulante excluído com sucesso.", "");

                $('#tableEstipulante').find("tbody > tr#" + numeroItem).remove();

                var item = cotacao.Itens.filter(function (item) {
                    return item.NumeroItem == numeroItem;
                })[0];

                cotacao.Itens.splice(cotacao.Itens.indexOf(item), 1);

                window.DadosSubEstipulanteUi.limparModal();
                $('#modalEstipulante').modal('hide');
                window.DadosSubEstipulanteUi.popularGridEstipulantes();

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
                NumeroItem: numeroItem + ""
            })
        })
    },

    obterDadosSubEstipulante: function (numeroItem) {

        var item = cotacao.Itens.filter(function (item) {
            return item.NumeroItem == numeroItem;
        })[0];

        NumeroItemEstipulante = item.NumeroItem;
        estipulanteDSE = item.Estipulante;
    },

    validarCEP: function () {
        var cep = $('#cepDSE').val().replace(/^\s+|\s+$/g, '');
        var regexCEP = /^[0-9]{2}\.[0-9]{3}-[0-9]{3}$/;

        if (cep.length <= 0 && !regexCEP.test(cep)) {
            notification("erro", "CEP inválido.", '');
            return false;
        }

        return true;
    },

    validarDadosSubEstipulante: function () {

        var validacao = true;

        if ($("input[name='TipoPessoaDSE']:checked").val() == "F") {
            if (!window.helperValidacao.validarCPF($('#documentoNumeroDSE').val())) {
                $("#documentoNumeroDSE").addClass("input-validation-error");
                notification("erro", "CPF Inválido.", '');
                validacao = false;
            } else {
                $('#documentoNumeroDSE').removeClass("input-validation-error");
            }

            if ($("#identificacaoDSE").val() == "") {
                $("#identificacaoDSE").addClass("input-validation-error");
                notification("erro", "Nome Inválido.", '');
                validacao = false;
            } else {
                $('#identificacaoDSE').removeClass("input-validation-error");
            }
        }
        else {
            if (!window.helperValidacao.validarCNPJ($('#documentoNumeroDSE').val())) {
                $("#documentoNumeroDSE").addClass("input-validation-error");
                notification("erro", "CNPJ Inválido.", '');
                validacao = false;
            } else {
                $('#documentoNumeroDSE').removeClass("input-validation-error");
            }

            if ($("#identificacaoDSE").val() == "") {
                $("#identificacaoDSE").addClass("input-validation-error");
                notification("erro", "Razão Social Inválido.", '');
                validacao = false;
            } else {
                $('#identificacaoDSE').removeClass("input-validation-error");
            }
        }

        if ($('#selectAtividadeDSE').val() == "-1") {
            $('#selectAtividadeDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo Atividade é obrigatório.", '');
            validacao = false;
        }
        else
            $('#selectAtividadeDSE').removeClass("input-validation-error");


        if ($('#selectFaixaRendaDSE').val() == "-1") {
            $('#selectFaixaRendaDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo Faixa de Renda é obrigatório.", '');
            validacao = false;
        }
        else
            $('#selectFaixaRendaDSE').removeClass("input-validation-error");

        if ($('#telefoneDSE').val().length < 14) {
            $('#telefoneDSE').addClass("input-validation-error");
            notification("erro", "Telefone inválido.", '');
            validacao = false;
        }
        else
            $('#telefoneDSE').removeClass("input-validation-error");

        $('#telefoneDSE').blur();
        if ($('#telefoneDSE').val() == "") {
            $('#telefoneDSE').addClass("input-validation-error");
            notification("erro", "O prenchimento do campo Telefone é obrigatório.", '');
            validacao = false;
        }
        else
            $('#telefoneDSE').removeClass("input-validation-error");

        var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regexEmail.test($('#emailDSE').val().toLowerCase())) {
            $('#emailDSE').addClass("input-validation-error");
            notification("erro", "E-mail inválido.", '');
            validacao = false;
        }
        else
            $('#emailDSE').removeClass("input-validation-error");

        if ($('#emailDSE').val() == "") {
            $('#emailDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo E-mail é obrigatório.", '');
            validacao = false;
        }
        else
            $('#emailDSE').removeClass("input-validation-error");

        if ($('#selectPlanoDSE').val() == "-1") {
            $('#selectPlanoDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo Plano é obrigatório.", '');
            validacao = false;
        }
        else
            $('#selectPlanoDSE').removeClass("input-validation-error");

        var cep = $('#cepDSE').val().replace(/^\s+|\s+$/g, '');
        var regexCEP = /^[0-9]{2}\.[0-9]{3}-[0-9]{3}$/;

        if (cep.length <= 0 && !regexCEP.test(cep)) {
            $('#cepDSE').addClass("input-validation-error");
            notification("erro", "CEP inválido.", '');
            validacao = false;
        }
        else
            $('#cepDSE').removeClass("input-validation-error");

        if ($('#cepDSE').val() == "") {
            $('#cepDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo CEP é obrigatório.", '');
            validacao = false;
        }
        else
            $('#cepDSE').removeClass("input-validation-error");

        if ($('#selectTipoLogradouroDSE').val() == "-1") {
            $('#selectTipoLogradouroDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo tipo logradouro é obrigatório.", '');
            validacao = false;
        }
        else
            $('#selectTipoLogradouroDSE').removeClass("input-validation-error");

        if ($('#numeroLogradouroDSE').val() == "") {
            $('#numeroLogradouroDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo número é obrigatório.", '');
            validacao = false;
        }
        else
            $('#numeroLogradouroDSE').removeClass("input-validation-error");

        if ($('#bairroDSE').val() == "") {
            $('#bairroDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo bairro é obrigatório.", '');
            validacao = false;
        }
        else
            $('#bairroDSE').removeClass("input-validation-error");

        if ($('#cidadeDSE').val() == "") {
            $('#cidadeDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo cidade é obrigatório.", '');
            validacao = false;
        }
        else
            $('#cidadeDSE').removeClass("input-validation-error");

        if ($('#selectUFDSE').val() == "-1") {
            $('#selectUFDSE').addClass("input-validation-error");
            notification("erro", "O preenchimento do campo UF é obrigatório.", '');
            validacao = false;
        }
        else
            $('#selectUFDSE').removeClass("input-validation-error");

        return validacao;
    },

    validarDocumento: function () {
        if ($("input[name='TipoPessoaDSE']:checked").val() == "F") {
            if (!window.helperValidacao.validarCPF($('#documentoNumeroDSE').val())) {
                $("#documentoNumeroDSE").addClass("input-validation-error");
                notification("erro", "CPF Inválido.", '');
            } else {
                $('#documentoNumeroDSE').removeClass("input-validation-error");
            }
        }
        else {
            if (!window.helperValidacao.validarCNPJ($('#documentoNumeroDSE').val())) {
                $("#documentoNumeroDSE").addClass("input-validation-error");
                notification("erro", "CNPJ Inválido.", '');
            } else {
                $('#documentoNumeroDSE').removeClass("input-validation-error");
            }
        }
    },

    popularObjetoEstipulante: function () {
        estipulanteDSE = {};
        estipulanteDSE.Nome = $('#identificacaoDSE').val();
        estipulanteDSE.NumeroCpfCnpj = $('#documentoNumeroDSE').val().replace(".", "").replace("-", "").replace("/", "");
        estipulanteDSE.TipoPessoa = $("input[name='TipoPessoaDSE']:checked").val();

        estipulanteDSE.Email = $('#emailDSE').val();

        var telefoneFormatado = $('#telefoneDSE').val().replace("(", "").replace("-", "").replace(" ", "");
        estipulanteDSE.Telefone = {};
        estipulanteDSE.Telefone.DDD = telefoneFormatado.split(")")[0];
        estipulanteDSE.Telefone.Numero = telefoneFormatado.split(")")[1];

        estipulanteDSE.Endereco = {};
        estipulanteDSE.Endereco.NumeroCep = parseInt($('#cepDSE').val().replace("-", ""));
        estipulanteDSE.Endereco.TipoLogradouro = $('#selectTipoLogradouroDSE').val();
        estipulanteDSE.Endereco.NomeLogradouro = $('#logradouroDSE').val();
        estipulanteDSE.Endereco.NumeroLogradouro = $('#numeroLogradouroDSE').val();
        estipulanteDSE.Endereco.Complemento = $('#complementoLogradouroDSE').val();
        estipulanteDSE.Endereco.NomeBairro = $('#bairroDSE').val();
        estipulanteDSE.Endereco.NomeCidade = $('#cidadeDSE').val();
        estipulanteDSE.Endereco.SiglaUF = $('#selectUFDSE').val();

        if (estipulanteDSE.TipoPessoa == "F") {
            estipulanteDSE.CodigoMeiCei = $('#meiCeiDSE').val();
            estipulanteDSE.CodigoFaixaRenda = $('#selectFaixaRendaDSE').val();
            estipulanteDSE.IndicadorPEP = $('input[name="RelacionamentoPolitico"]:checked').val() == "true";

            estipulanteDSE.Ocupacao = {};
            estipulanteDSE.Ocupacao.Codigo = $('#selectAtividadeDSE').val();
            estipulanteDSE.Ocupacao.Descricao = $('#selectAtividadeDSE option:selected').text();
        } else {
            estipulanteDSE.Cnae = {};
            estipulanteDSE.Cnae.Codigo = $('#selectAtividadeDSE').val();
            estipulanteDSE.Cnae.Descricao = $('#selectAtividadeDSE option:selected').text();
        }

        if (NumeroItemEstipulante == "") {
            NumeroItemEstipulante = (parseInt(cotacao.Itens[cotacao.Itens.length - 1].NumeroItem) + 1) + "";
        }
    }
}

window.DadosSubEstipulanteEvents = {
    //OnCLick/OnChange/OnBlur/On's
    initialize: function (callback) {

    },

    onClickAddEstipulante: function () {
        if (cotacao.Itens.length >= ProdutoComercial.produtoComercialVida.quantidadeMaximaItensPorCotacao) {
            notification("erro", "Quantidade total de subestipulantes não deve ser maior que " + ProdutoComercial.produtoComercialVida.quantidadeMaximaItensPorCotacao + ".", "");
            return false;
        }

        $('#modalEstipulante').modal('show');
        window.DadosSubEstipulanteUi.limparModal();
        window.DadosSubEstipulanteUi.layoutEstrutura();
        window.DadosSubEstipulanteUi.limparErros();

        window.DadosSubEstipulanteFunctions.obterTipoLogradouro();
        window.DadosSubEstipulanteFunctions.obterListaUF();
        window.DadosSubEstipulanteFunctions.obterOcupacoesPJ();

        window.DadosSubEstipulanteUi.popularPlanos();
    },

    onClickFecharModal: function () {
        if (confirm("Ao fechar a tela os dados cadastrados serão perdidos. Deseja continuar?")) {
            window.DadosSubEstipulanteUi.limparModal();
            $('#modalEstipulante').modal('hide');
        }
    },

    onClickCEP: function () {
        if (window.DadosSubEstipulanteFunctions.validarCEP()) {
            window.DadosSubEstipulanteUi.limparEndereco();
            window.DadosSubEstipulanteFunctions.buscarCEP();
        }
    },

    onClickSalvarSub: function () {
        if (cotacao.Itens.length >= ProdutoComercial.produtoComercialVida.quantidadeMaximaItensPorCotacao) {
            notification("erro", "Quantidade total de subestipulantes não deve ser maior que " + ProdutoComercial.produtoComercialVida.quantidadeMaximaItensPorCotacao + ".", "");
            return false;
        }
        if (window.DadosSubEstipulanteFunctions.validarDadosSubEstipulante()) {
            window.DadosSubEstipulanteFunctions.popularObjetoEstipulante();
            window.DadosSubEstipulanteFunctions.salvarEstipulante();
        }
    },

    onChangeTipoPessoa: function () {
        window.DadosSubEstipulanteUi.alterarTipoPessoa();
    },

    onChangeNumeroDocumento: function () {
        window.DadosSubEstipulanteFunctions.validarDocumento($('#documentoNumeroDSE').val());
    },

    onClickEditarSub: function (numeroItem) {
        window.DadosSubEstipulanteFunctions.obterDadosSubEstipulante(numeroItem);
        window.DadosSubEstipulanteEvents.onClickAddEstipulante();
        window.DadosSubEstipulanteUi.popularDadosSubEstipulante();
    },

    onClickExcluirSub: function (numeroItem) {
        if (confirm("Deseja realmente excluir o subestipulante?")) {
            window.DadosSubEstipulanteFunctions.excluirSubEstipulante(numeroItem);
        }
    }
}

$(document).ready(function () {

});