
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChildApi.Controllers
{
    [ApiController]
    [Route("api/token")]
    public class TokenController : ControllerBase
    {
        private readonly IConfiguration _config;

        public TokenController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("issue")]
        public IActionResult IssueToken([FromHeader(Name = "X-Auth-Key")] string authKey, [FromBody] TokenRequest req)
        {
            if (authKey != _config["TokenSettings:AuthKey"])
                return Unauthorized("Invalid auth key.");

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, req.UserId),
                new Claim("orgId", req.OrgId)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["TokenSettings:Issuer"],
                audience: _config["TokenSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: creds
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
    }

    public class TokenRequest
    {
        public string UserId { get; set; }
        public string OrgId { get; set; }
    }
}
