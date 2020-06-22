window.SelecaoUi = { //Validações de campos, criação de HTML, alteração de CSS e etc.

    initialize: function () {
        window.SelecaoUi.ocultaCamposPadrao();
    },

    ocultaCamposPadrao: function () {
        $("#step-2").hide();
        $("#step-3").hide();
        $("#step-4").hide();
    }
};

window.SelecaoFunctions = { //Chamadas Ajax, Regras de negócio

    initialize: function () {
        window.SelecaoFunctions.pesquisarCanais();        
    },

    pesquisarProdutosComerciais: function (CodigoCanal, CodigoCompanhia, CodigoOrgaoEmissor, CodigoFamilia) {
        $.ajax({
            url: '/ObterProdutosComerciais/' + CodigoCanal + '/' + CodigoCompanhia + '/' + CodigoFamilia + '/' + CodigoOrgaoEmissor,
            async: true,
            type: 'GET',
            success: window.SelecaoFunctions.successProdutosComerciais,
            error: function (result) {
                onFailed(result)
            }
        });
    },

    successProdutosComerciais: function (data) {
        var icone = "/images/ico-vidaConvencional.png";
        $("#listaDeProdutos").empty();
        if (data.length == 0) {
            $("#listaDeProdutos").append("<p>Não foram encontrados produtos comerciais.</p>");
        } else {
            for (var i = 0; i < data.length; i++) {
                var codigoCanal = parseInt($("#listaDeCanais").find(".canal-selected").attr("id").replace("canal-", ""));
                var codigoCompanhia = parseInt($("#listaDeCanais").find(".canal-selected").attr("codigocompanhia"));
                var codigoEstabelecimento = $("#selectFilial").val();
                var descricaoFilial = $("#select2-selectFilial-container").attr("title");
                $("#listaDeProdutos").append('<a href="/cotacao?codigoProdutoComercial=' + data[i].codigoProdutoComercial + '&codigoCanal=' + codigoCanal + '&codigoCompanhia=' + codigoCompanhia + '&codigoEstabelecimento=' + codigoEstabelecimento + '&descricaoFilial=' + descricaoFilial + '"><li class="col-xs-2 col-sm-2 col-md-2 col-lg-2" id="produto-' + data[i].codigoProdutoComercial + '"><img src="' + icone + '" class="img-responsive col-xs-12 col-sm-12 col-md-12 col-lg-12" /><p class="text-center textBlue">' + data[i].codigoProdutoComercial + ' ' + data[i].descricao + '</p></li></a>');

            }
        }
    },

    pesquisarCanais: function () {
        $.ajax({
            type: "GET",
            url: "/ObterListaCanal",
            async: true,
            success: window.SelecaoFunctions.successCanais,
            error: function (result) {
                onFailed(result)
            }
        });
    },

    successCanais: function (data) {
        $("#listaDeCanais").empty();
        var iconeLiberty = "/images/logo-canal-liberty.png";
        //var iconeIndiana = "/images/logo-canal-indiana.png";
        //var iconeAffinity = "/images/logo-canal-affinity.png";
        var icone = "";
        for (var i = 0; i < data.canais.canal.length; i++) {
            if (data.canais.canal[i].codigoCanal == 6) {
                icone = iconeLiberty;
                $("#listaDeCanais").append('<li id="canal-' + data.canais.canal[i].codigoCanal + '" onclick="window.SelecaoEvents.selecionaCanal(this.id)" codigoCompanhia="' + data.canais.canal[i].codigoCompanhia + '"><img src="' + icone + '" class="img-responsive" /></li>');
            } else {
                false;
            }

            // DESCOMENTAR O CODIGO DA LINHA ABAIXO INICIO "77 À 84" SÓ PARA QUANDO FOR USAR OUTROS CANAIS

            //if (data.canais.canal[i].codigoCanal == 6) {
            //    icone = iconeLiberty;
            //} else if (data.canais.canal[i].codigoCanal == 3) {
            //    icone = iconeAffinity;
            //} else if (data.canais.canal[i].codigoCanal == 1) {
            //    icone = iconeIndiana;
            //}
            //$("#listaDeCanais").append('<li id="canal-' + data.canais.canal[i].codigoCanal + '" onclick="window.SelecaoEvents.selecionaCanal(this.id)" codigoCompanhia="' + data.canais.canal[i].codigoCompanhia + '"><img src="' + icone + '" class="img-responsive" /></li>');
        }
        $("#step-2").hide();
        $("#step-3").hide();
        $("#step-4").hide();
    },

    pesquisarFiliais: function (CodigoCompanhia) {
        $.ajax({
            type: "GET",
            url: '/ObterListaFilial/' + CodigoCompanhia,
            async: true,
            success: window.SelecaoFunctions.successFiliais,
            error: function (result) {
                onFailed(result)
            }
        });
    },

    successFiliais: function (data) {
        $("#selectFilial").empty();
        $("#selectFilial").append('<option value="0">Selecione</option>');
        for (var i = 0; i < data.filiais.filial.length; i++) {
            $("#selectFilial").append('<option value="' + data.filiais.filial[i].estabelecimento + '"> ' + data.filiais.filial[i].nomeFilial + ' </option>');
        }
    },

    pesquisarFamilias: function () {
        $.ajax({
            type: "GET",
            url: "/ObterListaFamilia",
            async: true,
            success: window.SelecaoFunctions.successFamilias,
            error: function (result) {
                onFailed(result)
            }
        });
    },

    successFamilias: function (data) {
        $("#listaDeFamilias").empty();
        for (var i = 0; i < data.length; i++) {
            $("#listaDeFamilias").append('<li class="col-xs-2 col-sm-2 col-md-2 col-lg-2" id="familia-' + data[i].codigoDominio + '" onclick="window.SelecaoEvents.selecionaFamilia(this.id)"><img src="/images/ico-vidaEmGrupo.png" class="img-responsive col-xs-12 col-sm-12 col-md-12 col-lg-12" /><p class="text-center textBlue">' + data[i].descricaoDominio + '</p></li>');
        }
    }
};

window.SelecaoEvents = { //Eventos como Click, Blur, Change e etc.
    selecionaCanal: function (id) {
        $("#" + id).addClass("canal-selected");
        if ($("#" + id).siblings().hasClass('canal-selected')) {
            $("#" + id).siblings().removeClass('canal-selected');
        }
        $("#step-2").show();
        $("#step-3").hide();
        $("#step-4").hide();
        window.SelecaoFunctions.pesquisarFiliais(parseInt($("#"+id).attr("codigoCompanhia")));
    },

    selecionaFamilia: function (id) {
        $("#" + id).addClass("familias-selected");
        if ($("#" + id).siblings().hasClass('familias-selected')) {
            $("#" + id).siblings().removeClass('familias-selected');
        }
        $("#step-4").show();
        var CodigoCanal = parseInt($("#listaDeCanais").find(".canal-selected").attr("id").replace("canal-", ""));
        var CodigoCompanhia = parseInt($("#listaDeCanais").find(".canal-selected").attr("codigocompanhia"));
        var CodigoOrgaoEmissor = parseInt($("#selectFilial").val());
        var CodigoFamilia = parseInt($("#listaDeFamilias").find(".familias-selected").attr("id").replace("familia-",""));
        window.SelecaoFunctions.pesquisarProdutosComerciais(CodigoCanal, CodigoCompanhia, CodigoOrgaoEmissor, CodigoFamilia);
    },

    selecionaFilial: function () {
        $("#step-3").show();
        $("#step-4").hide();
        window.SelecaoFunctions.pesquisarFamilias();
    },
};

$(function () {
    window.SelecaoUi.initialize();
    window.SelecaoFunctions.initialize();
});