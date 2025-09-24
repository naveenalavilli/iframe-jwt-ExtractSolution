
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChildApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        [HttpGet("details")]
        public IActionResult GetUserDetails()
        {
            var userId = User.FindFirst("sub")?.Value;
            var orgId = User.FindFirst("orgId")?.Value;

            return Ok(new { userId, orgId, name = "John Doe", role = "Viewer" });
        }
    }
}
