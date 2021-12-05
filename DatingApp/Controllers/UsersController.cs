using DatingApp.Data;
using DatingApp.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
	public class UsersController : BaseApiController
	{
		private readonly DataContext _context;

		public UsersController(DataContext context)
		{
			_context = context;
		}

		[Authorize]
		[HttpGet]
		public async Task<ActionResult<IEnumerable<AppUser>>> GetUsersAsync()
		{
			return await _context.Users.ToListAsync();
		}

		[Authorize]
		[HttpGet]
		[Route("{id}")]
		public async Task<ActionResult<AppUser>> GetUserByIdAsync(int id)
		{
			return await _context.Users.FindAsync(id);
		}
	}
}
