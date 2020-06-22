var RelacoesVida = (function () {
    function RelacoesVida(numeroCotacao, numeroCenario, numeroVersao, vidas) {
        this.numeroCotacao = numeroCotacao;
        this.numeroCenario = numeroCenario;
        this.numeroVersao = numeroVersao;
        this.vidas = vidas;
    }
    return RelacoesVida;
}());

var Vida = (function () {
    function Vida(id, numeroPlano, nome, numeroCpf, dataNascimento, sexo, indicadorExcluidoCalculo, valorCapitalSegurado, valorSalario) {
        this.id = id;
        this.numeroPlano = numeroPlano;
        this.nome = nome;
        this.numeroCpf = numeroCpf;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
        this.indicadorExcluidoCalculo = indicadorExcluidoCalculo;
        this.valorCapitalSegurado = valorCapitalSegurado;
        this.valorSalario = valorSalario;
    }
    return Vida;
}());

var currentRelacoesVida = undefined;
var alteracoesPendentes = false;

window.RelacoesVidaUi = {
    //Alterações da Tela: Bloqueio/Show/Hide/Preencher/Limpar
    initialize: function (callback) {

        $("#spNumeroCenario").html('Cenário ' + cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].numeroCenario);
        $("#spNumeroVersao").html('Versão ' + cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].numeroVersao);

        if (indiceVersaoSelecionada != 0) {
            $('#btnSalvarRelacaoVidas').prop("disabled", false);
        } else {
            $('#btnSalvarRelacaoVidas').prop("disabled", true);
        }

        window.RelacoesVidaFunctions.limparConsulta();
    }
}

window.RelacoesVidaFunctions = {
    //Funcionalidades/Ajax/Alterações De Comportamento/Objeto
    initialize: function (callback) {

    },

    consultarVidas: function (callback) {

        $.ajax({
            url: '/ObterVidas/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                window.RelacoesVidaFunctions.popularRelacoesVida(data);
                callback && callback();
            },
            error: function (data) {
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                NumeroCotacao: cotacao._id,
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].numeroCenario,
                NumeroVersao: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].numeroVersao,
                NumeroPlano: $("#selectPlanoRelacaoVidas").val() == "-1" ? null : parseInt($("#selectPlanoRelacaoVidas").val()),
                ConsiderarAfastados: $("#checkAfastados").is(':checked'),
                ConsiderarConjuge: $("#checkConjuge").is(':checked'),
                ConsiderarDesabilitados: $("#checkVidasDesconsideradas").is(':checked'),
                CapitalMinimo: $("#txtCapitalMinimo").val() == '' ? null : parseFloat($("#txtCapitalMinimo").maskMoney('unmasked')[0]),
                CapitalMaximo: $("#txtCapitalMaximo").val() == '' ? null : parseFloat($("#txtCapitalMaximo").maskMoney('unmasked')[0]),
                SalarioMinimo: $("#txtSalarioMinimo").val() == '' ? null : parseFloat($("#txtSalarioMinimo").maskMoney('unmasked')[0]),
                SalarioMaximo: $("#txtSalarioMaximo").val() == '' ? null : parseFloat($("#txtSalarioMaximo").maskMoney('unmasked')[0]),
                IdadeMinima: $("#txtIdadeMinima").val() == '' ? null : parseInt($("#txtIdadeMinima").val()),
                IdadeMaxima: $("#txtIdadeMaxima").val() == '' ? null : parseInt($("#txtIdadeMaxima").val())
            })
        })
    },

    salvarVidas: function (callback) {

        $.ajax({
            url: '/AtualizarVidas/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {
                notification("sucesso", data, "");
                callback && callback();
            },
            error: function (data) {
                var errors = JSON.parse(data.responseText);
                for (var i = 0; i < errors.length; i++) {
                    notification("erro", errors[i], '');
                }
            },
            data: JSON.stringify({
                relacoesVida: currentRelacoesVida
            })
        })
    },

    atualizarTotaldeVidas: function (callback) {

        $.ajax({
            url: '/ObterTotalVidaPorVersao/',
            type: 'post',
            contentType: "application/json",
            success: function (data) {

                let totalVida = data.value.totalVidasVersao;

                window.RelacoesVidaFunctions.atualizarCampoTotalDeVidas(totalVida);
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
                IdCotacao: cotacao._id,
                NumeroCenario: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].numeroCenario,
                NumeroVersao: cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].numeroVersao
            })
        });


    },


    atualizarCampoTotalDeVidas: function (totalVida) {

        if (typeof (totalVida) != "undefined") {
            cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].versoesCalculo[indiceVersaoSelecionada].quantidadeTotalVidas = totalVida;
            $('#TotalVidasVersao').val(helperFormatacao.formatarDecimal(totalVida, 0));
        }
    },



    popularRelacoesVida: function (relacoesVida) {
        //var vidas = [];

        //for (var i = 0; i < relacoesVida.vidas.length; i++) {
        //    var vida = new Vida(relacoesVida.vidas[i].Id,
        //        relacoesVida.vidas[i].NumeroPlano,
        //        relacoesVida.vidas[i].Nome,
        //        relacoesVida.vidas[i].NumeroCpf,
        //        relacoesVida.vidas[i].DataNascimento,
        //        relacoesVida.vidas[i].Sexo,
        //        relacoesVida.vidas[i].IndicadorExcluidoCalculo,
        //        relacoesVida.vidas[i].ValorCapitalSegurado,
        //        relacoesVida.vidas[i].ValorSalario)

        //    vidas.push(vida);
        //}

        currentRelacoesVida = relacoesVida; //new RelacoesVida(relacoesVida.NumeroCotacao, relacoesVida.NumeroCenario, relacoesVida.NumeroVersao, vidas);

        if (currentRelacoesVida.vidas.length > 0) {

            if (currentRelacoesVida.vidas.length >= 300) {
                currentRelacoesVida.vidas = currentRelacoesVida.vidas.slice(0, 300);
                $('#divMensagemLimiteRegistros').show();
            }
            else {
                $('#divMensagemLimiteRegistros').hide();
            }

            window.RelacoesVidaFunctions.popularDataTable(currentRelacoesVida.vidas);
        }
        else
            window.RelacoesVidaFunctions.popularDataTable(null);

    },

    limparConsulta: function () {

        window.RelacoesVidaFunctions.carregarPlanoRelacaoVidas();
        $("#checkAfastados").prop("checked", false);
        $("#checkConjuge").prop("checked", false);
        $("#checkVidasDesconsideradas").prop("checked", false);
        $("#txtCapitalMinimo").val('');
        $("#txtCapitalMaximo").val('');
        $("#txtSalarioMinimo").val('');
        $("#txtSalarioMaximo").val('');
        $("#txtIdadeMinima").val('');
        $("#txtIdadeMaxima").val('');

        $('#txtCapitalMinimo').removeClass("input-validation-error");
        $('#txtCapitalMaximo').removeClass("input-validation-error");
        $('#txtSalarioMinimo').removeClass("input-validation-error");
        $('#txtSalarioMaximo').removeClass("input-validation-error");
        $('#txtIdadeMinima').removeClass("input-validation-error");
        $('#txtIdadeMaxima').removeClass("input-validation-error");

        window.RelacoesVidaFunctions.popularDataTable(null);
    },


    validarcampos: function (callback) {
        var executarCallback = true;
       

        if (currentRelacoesVida.vidas.filter(value => value.indicadorExcluidoCalculo === false).length === 0) {
            executarCallback = false;
            notification("erro", "Pelo menos uma vida deve ser selecionada para salvar a relação.");

        }
       
        for (var i = 0; i < currentRelacoesVida.vidas.length; i++) {

            currentRelacoesVida.vidas[i];

            if ((currentRelacoesVida.vidas[i].valorCapitalSegurado > ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato) || (currentRelacoesVida.vidas[i].valorCapitalSegurado < ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato)) {
                executarCallback = false;
                notification("erro", "Limite de capital permitido é mínimo "  +  ProdutoComercial.produtoComercialVida.valorCapitalMinimoContrato  +  " e máximo "   + ProdutoComercial.produtoComercialVida.valorCapitalMaximoContrato  + ".", "");
            }

        }
        if (executarCallback) {
            callback && callback();
        }
    },


    popularDataTable: function (data) {

        $('#tabelaRelacaoVidas').DataTable().clear().destroy();

        var tabelaRelacaoVidas = $('#tabelaRelacaoVidas').DataTable({
            data: data,
            scrollX: true,
            scrollCollapse: true,
            searching: false,
            pageLength: 5,
            bLengthChange: false,
            columns: [
                { data: "indicadorExcluidoCalculo", width: 10 },
                { data: "numeroPlano", width: 30 },
                { data: "nome", width: 150 },
                { data: "numeroCpf", width: 90 },
                { data: "dataNascimento", width: 70 },
                { data: "sexo", width: 30 },
                { data: "valorCapitalSegurado", width: 100 },
                { data: "valorSalario", width: 100 },
                { data: "nomeConjuge", width: 150 },
                { data: "dataNascimentoConjuge", width: 90 },
                { data: "dataAfastado", width: 90 },
                { data: "cid", width: 70 },
                { data: "descricaoCID", width: 150 }
            ],
            order: [],
            columnDefs: [{
                "targets": 'no-sort',
                "orderable": false,
            },
            {
                targets: 0,
                className: 'textAlignCenter',
                render: function (data, type, row) {
                    if (!data) { //Apresentar campo 'indicadorExcluidoCalculo' com valor inverso (check=Não Excluído/uncheck=Excluído)
                        return "<input type='checkbox' class='checkVidaRelacaoVidas' checked onclick='window.RelacoesVidaEvents.OnUpdateCellsCheckbox(\"" + row.id + "\", this.checked)'>";
                    } else {
                        return "<input type='checkbox' class='checkVidaRelacaoVidas' onclick='window.RelacoesVidaEvents.OnUpdateCellsCheckbox(\"" + row.id + "\", this.checked)'>";
                    }
                }
            },
            {
                targets: 1,
                className: 'textAlignCenter'
            },
            {
                targets: 3,
                className: 'textAlignCenter',
                render: function (data) {
                    return cpfCnpj(data);
                }
            },
            {
                targets: 4,
                className: 'textAlignCenter',
                render: function (data) {
                    if (data != null)
                        return moment(data).format('DD/MM/YYYY');
                    else
                        return data;
                }
            },
            {
                targets: 5,
                className: 'textAlignCenter'
            },
            {
                targets: 6,
                className: 'textAlignRight',
                render: function (data) {
                    return data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }
            },
            {
                targets: 7,
                className: 'textAlignRight',
                render: function (data) {
                    return data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }
            },
            {
                targets: 9,
                className: 'textAlignCenter',
                render: function (data) {
                    if (data != null)
                        return moment(data).format('DD/MM/YYYY');
                    else
                        return data;
                }
            },
            {
                targets: 10,
                className: 'textAlignCenter',
                render: function (data) {
                    if (data != null)
                        return moment(data).format('DD/MM/YYYY');
                    else
                        return data;
                }
            },
            {
                targets: 11,
                className: 'textAlignCenter'
            }],
            language: {
                sEmptyTable: "Nenhum registro encontrado",
                sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "",
                sInfoFiltered: "(Filtrados de _MAX_ registros)",
                sInfoPostFix: "",
                sInfoThousands: ".",
                sLengthMenu: "_MENU_ resultados por página",
                sLoadingRecords: "Carregando...",
                sProcessing: "Processando...",
                sZeroRecords: "Nenhum registro encontrado",
                sSearch: "Filtrar: &nbsp;",
                oPaginate: {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                }
            }
        });

        if (indiceVersaoSelecionada != 0) {

            tabelaRelacaoVidas.MakeCellsEditable("destroy");
            tabelaRelacaoVidas.MakeCellsEditable({
                "onUpdate": window.RelacoesVidaEvents.OnUpdateCellsEditable,
                "inputCss": 'form-control bordaInput custom-input inputEdicaoDataTable',
                "columns": [6, 7],
                "inputTypes": [
                    {
                        "column": 6,
                        "type": "maskMoney",
                        "options": null
                    },
                    {
                        "column": 7,
                        "type": "maskMoney",
                        "options": null
                    }]
            });
        } else {

            $('#tabelaRelacaoVidas').DataTable().$(".checkVidaRelacaoVidas").prop("disabled", true);
            $('#btnSalvarRelacaoVidas').prop("disabled", true);
        }

    },

    carregarPlanoRelacaoVidas: function () {
        $('#selectPlanoRelacaoVidas').empty();
        $('#selectPlanoRelacaoVidas').append('<option value="-1">Todos...</option>');
        for (var i = 0; i < cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].planosCondicoesComerciais.length; i++) {
            $('#selectPlanoRelacaoVidas').append('<option value="' + cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].planosCondicoesComerciais[i].numeroPlano + '">' + cotacao.CenariosCotacao[indiceCenarioSelecionadoCalculo].planosCondicoesComerciais[i].numeroPlano + '</option>');
        }
    },

    //TODO: Pensar em uma forma genérica para validar os dados de valor inicial e valor final
    validarCapital: function () {

        if ($("#txtCapitalMinimo").val() != "" && $("#txtCapitalMaximo").val() != "") {
            var capitalMinimo = parseFloat($("#txtCapitalMinimo").maskMoney('unmasked')[0]);
            var capitalMaximo = parseFloat($("#txtCapitalMaximo").maskMoney('unmasked')[0]);

            if (capitalMinimo > capitalMaximo) {
                $('#txtCapitalMinimo').addClass("input-validation-error");
                notification("erro", "Capital inicial não deve ser maior que o capital final.", '');
            }
            if (capitalMaximo < capitalMinimo) {
                $('#txtCapitalMaximo').addClass("input-validation-error");
                notification("erro", "Capital final não deve ser menor que o capital inicial.", '');
            }
            else {
                $('#txtCapitalMinimo').removeClass("input-validation-error");
                $('#txtCapitalMaximo').removeClass("input-validation-error");
            }
        }
    },

    validarSalario: function () {

        if ($("#txtSalarioMinimo").val() != "" && $("#txtSalarioMaximo").val() != "") {
            var salarioMinimo = parseFloat($("#txtSalarioMinimo").maskMoney('unmasked')[0]);
            var salarioMaximo = parseFloat($("#txtSalarioMaximo").maskMoney('unmasked')[0]);

            if (salarioMinimo > salarioMaximo) {
                $('#txtSalarioMinimo').addClass("input-validation-error");
                notification("erro", "Valor de salário inicial não deve ser maior que o valor do salário final.", '');
            }
            if (salarioMaximo < salarioMaximo) {
                $('#txtSalarioMaximo').addClass("input-validation-error");
                notification("erro", "Valor de salário final não deve ser menor que o valor do salário inicial.", '');
            }
            else {
                $('#txtSalarioMinimo').removeClass("input-validation-error");
                $('#txtSalarioMaximo').removeClass("input-validation-error");
            }
        }
    },

    validarIdade: function () {

        if ($("#txtIdadeMinima").val() != "" && $("#txtIdadeMaxima").val() != "") {
            var idadeMinima = parseInt($("#txtIdadeMinima").val());
            var idadeMaxima = parseInt($("#txtIdadeMaxima").val());

            if (idadeMinima > idadeMaxima) {
                $('#txtIdadeMinima').addClass("input-validation-error");
                notification("erro", "Idade inicial não deve ser maior que a idade final.", '');
            }
            if (idadeMaxima < idadeMinima) {
                $('#txtIdadeMaxima').addClass("input-validation-error");
                notification("erro", "Idade final não deve ser menor que Idade inicial.", '');
            } else {
                $('#txtIdadeMinima').removeClass("input-validation-error");
                $('#txtIdadeMaxima').removeClass("input-validation-error");
            }
        }
    }
}

window.RelacoesVidaEvents = {
    //OnCLick/OnChange/OnBlur/On's
    initialize: function (callback) {

    },

    OnClickConsultarRelacaoVidas: function () {

        window.RelacoesVidaFunctions.consultarVidas(function () {

            //Por padrão o checkBox do header datatable inicia false ao consultar
            $('#checkSelTodasVidas').attr('checked', 'checked');

            //Caso haja na consulta vidas com o atributo "indicadorExcluidoCalculo === true", o checkBox do header datatable inicia false ao consultar
            if (currentRelacoesVida.vidas.filter(value => value.indicadorExcluidoCalculo === true).length > 0) {
                $('#checkSelTodasVidas').removeAttr('checked');
                alteracoesPendentes = false;
            }


            if (currentRelacoesVida.vidas.length === 0) {
                notification("erro", "Nenhum registro encontrado");
            }


        });
    },

    OnClickLimparConsultaRelacaoVidas: function () {

        window.RelacoesVidaFunctions.limparConsulta();
    },

    OnClickSalvarRelacaoVidas: function () {

        window.RelacoesVidaFunctions.validarcampos(function () {
            window.RelacoesVidaFunctions.salvarVidas(function () {
                alteracoesPendentes = false;
                window.RelacoesVidaFunctions.consultarVidas();
                window.RelacoesVidaFunctions.atualizarTotaldeVidas();
                window.AnaliseDeRiscoFunctions.obterCapitalMedio();
                $('#modalRelacaoVidas').modal('toggle');
            });
        });

    },

    OnClickFecharPopupRelacaoVidas: function () {

        if (alteracoesPendentes) {
            if (confirm('Existem alterações pendentes, deseja realmente fechar sem salvar?')) {
                $('#modalRelacaoVidas').modal('toggle');
                alteracoesPendentes = false;
            }
        }
        else {

            $('#modalRelacaoVidas').modal('toggle');
        }


    },

    OnChangeFiltroConsulta: function () {
        if (currentRelacoesVida != undefined)
            window.RelacoesVidaFunctions.consultarVidas();
    },

    OnChangeValidarCapital: function () {
        window.RelacoesVidaFunctions.validarCapital();
        window.RelacoesVidaFunctions.popularDataTable(null);
    },

    OnChangeValidarSalario: function () {
        window.RelacoesVidaFunctions.validarSalario();
        window.RelacoesVidaFunctions.popularDataTable(null);
    },

    OnChangeValidarIdade: function () {
        window.RelacoesVidaFunctions.validarIdade();
        window.RelacoesVidaFunctions.popularDataTable(null);
    },

    OnUpdateCellsCheckbox: function (idVida, checkValue) {

        $.each(currentRelacoesVida.vidas, function (i, v) {
            if (v.id == idVida) {
                currentRelacoesVida.vidas[i].indicadorExcluidoCalculo = !checkValue; //O campo 'indicadorExcluidoCalculo' chega com valor inverso do grid (check=Não Excluído/uncheck=Excluído)
                alteracoesPendentes = true;
            }
        });
    },

    OnCheckSelTodasVidas: function (checkValue) {
        if (checkValue)
            $('.checkVidaRelacaoVidas').attr('checked', 'checked');
        else
            $('.checkVidaRelacaoVidas').removeAttr('checked');

        $.each(currentRelacoesVida.vidas, function (i, v) {
            currentRelacoesVida.vidas[i].indicadorExcluidoCalculo = !checkValue; //O campo 'indicadorExcluidoCalculo' chega com valor inverso do grid (check=Não Excluído/uncheck=Excluído)
            alteracoesPendentes = true;
        });
    },

    OnUpdateCellsEditable: function (updatedCell, updatedRow, oldValue) {

        if (updatedCell != undefined && updatedCell.data() != oldValue) {

            $.each(currentRelacoesVida.vidas, function (i, v) {

                if (updatedCell[0][0].column == 6) {
                    $(currentRelacoesVida.vidas).filter(function (i, n) { return i === updatedCell[0][0].row })[0].valorCapitalSegurado = parseFloat(moneyToFloat(updatedCell.data(), ","));
                }

                if (updatedCell[0][0].column == 7) {
                    $(currentRelacoesVida.vidas).filter(function (i, n) { return i === updatedCell[0][0].row })[0].valorSalario = parseFloat(moneyToFloat(updatedCell.data(), ","));
                }

                // Necessário o tratamento abaixo, pois o compontente de edição transforma os campos 'float' JSON (source) em string
                currentRelacoesVida.vidas[i].valorCapitalSegurado = parseFloat(currentRelacoesVida.vidas[i].valorCapitalSegurado);
                currentRelacoesVida.vidas[i].valorSalario = parseFloat(currentRelacoesVida.vidas[i].valorSalario);

                alteracoesPendentes = true;                

            });

        }
    }
}

$(document).ready(function () {
    $('#modalRelacaoVidas').on('shown.bs.modal', function () {
        window.RelacoesVidaUi.initialize();
    });
    $('#modalRelacaoVidas').on('hidden.bs.modal', function () {
        window.RelacoesVidaFunctions.limparConsulta();
    });
});