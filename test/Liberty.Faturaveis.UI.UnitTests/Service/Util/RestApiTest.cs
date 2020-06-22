using Liberty.Faturaveis.UI.Application.Auth.Queries.AutenticarUsuario;
using Liberty.Faturaveis.UI.Infrastructure.SeedWork;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Newtonsoft.Json.Schema.Generation;
using System.Net.Http;

namespace Liberty_CotadorVida.UI.UnitTests.Service.Util
{
    [TestClass]
    public class RestApiTest<T>
    {
        [TestMethod]
        public void RestApi_JsonEmpty()
        {
            IHttpClientFactory client = _gerarClient(true);

            string json = string.Empty;
            string url = _gerarUrl();
            //string token = string.Empty;


            var result = new RestApi(client).Post(url, json);

        }


        private IHttpClientFactory _gerarClient(bool successo)
        {
            Mock<IHttpClientFactory> clientMock = new Mock<IHttpClientFactory>();

            clientMock
                .Setup(x => x.CreateClient());

            return clientMock.Object;

        }


        private string _gerarUrl()
        {
            return "https://jsonplaceholder.typicode.com/todos/1";
        }

        private string _gerarJson()
        {
            var schemaGenerator = new JSchemaGenerator();
            var schema = schemaGenerator.Generate(typeof(AutenticarUsuarioQuery));

            return "";
        }
    }
}
