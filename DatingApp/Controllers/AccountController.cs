using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
	public class AccountController : BaseApiController
	{
		private readonly DataContext _dataContext;
		private readonly ITokenService _tokenService;

		public AccountController(DataContext dataContext, ITokenService tokenService)
		{
			_dataContext = dataContext;
			_tokenService = tokenService;
		}

		[HttpPost("register")]
		public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
		{
			if (await UserExists(registerDto.UserName)) return BadRequest("UserName is Already Taken");

			using var hmac = new HMACSHA512();

			var user = new AppUser()
			{
				UserName = registerDto.UserName.ToLower(),
				PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
				PasswordSalt = hmac.Key
			};
			_dataContext.Add(user);
			await _dataContext.SaveChangesAsync();
			return new UserDto
			{
				UserName = user.UserName,
				Token = _tokenService.CreateToken(user)
			};
		}

	[HttpPost("login")]
	public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
	{
		var user = await _dataContext.Users.SingleOrDefaultAsync(x => x.UserName.ToLower() == loginDto.UserName.ToLower());

		if (user == null) return Unauthorized("Invalid UserName");

		using var hmac = new HMACSHA512(user.PasswordSalt);
		var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

		for (int i = 0; i < computedHash.Length; i++)
		{
			if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
		}
		return new UserDto
			{
				UserName = user.UserName,
				Token = _tokenService.CreateToken(user)
			};
		}

	private async Task<bool> UserExists(string username)
		 => await _dataContext.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
}
}