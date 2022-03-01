using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
	public class AccountController : BaseApiController
	{
		private readonly DataContext _dataContext;
		private readonly ITokenService _tokenService;
		private readonly IMapper _mapper;

		public AccountController(DataContext dataContext, ITokenService tokenService, IMapper mapper)
		{
			_dataContext = dataContext;
			_tokenService = tokenService;
			_mapper = mapper;
		}

		[HttpPost("register")]
		public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
		{
			if (await UserExists(registerDto.UserName)) return BadRequest("UserName is Already Taken");

			var user = _mapper.Map<AppUser>(registerDto);

			using var hmac = new HMACSHA512();

			user.UserName = registerDto.UserName.ToLower();
			user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
			user.PasswordSalt = hmac.Key;
			_dataContext.Add(user);
			await _dataContext.SaveChangesAsync();
			return new UserDto
			{
				UserName = user.UserName,
				Token = _tokenService.CreateToken(user),
				KnownAs = user.KnownAs,
				Gender = user.Gender
			};
		}

		[HttpPost("login")]
		public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
		{
			var user = await _dataContext.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName.ToLower() == loginDto.UserName.ToLower());

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
				Token = _tokenService.CreateToken(user),
				PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
				KnownAs = user.KnownAs,
				Gender = user.Gender

			};
		}

		private async Task<bool> UserExists(string username)
			 => await _dataContext.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
	}
}