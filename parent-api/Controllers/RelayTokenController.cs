
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace ParentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelayTokenController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _config;

        public RelayTokenController(IHttpClientFactory clientFactory, IConfiguration config)
        {
            _clientFactory = clientFactory;
            _config = config;
        }

        [HttpPost("get-child-token")]
        public async Task<IActionResult> GetChildToken([FromBody] TokenRequest request)
        {
            var client = _clientFactory.CreateClient();
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, _config["ChildApi:TokenUrl"])
            {
                Content = JsonContent.Create(request)
            };
            httpRequest.Headers.Add("X-Auth-Key", _config["ChildApi:AuthKey"]);

            var response = await client.SendAsync(httpRequest);
            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());

            var json = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            return Ok(json);
        }
    }

    public class TokenRequest
    {
        public string UserId { get; set; }
        public string OrgId { get; set; }
    }
}
