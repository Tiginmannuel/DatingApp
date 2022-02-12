using AutoMapper;
using DatingApp.DTOs;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
	[Authorize]
	public class UsersController : BaseApiController
	{
		private readonly IUserRepository _userRepository;
		private readonly IMapper _mapper;

		public UsersController(IUserRepository userRepository, IMapper mapper)
		{
			_userRepository = userRepository;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersAsync()
		{
			var users = await _userRepository.GetMembersAsync();

			return Ok(users);
		}

		[HttpGet("{username}")]
		public async Task<ActionResult<MemberDto>> GetUserByUserNameAsync(string username)
		{
			return await _userRepository.GetMemberAsync(username);
		}

		[HttpPut]
		public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
		{
			var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			var user = await _userRepository.GetUserByUserNameAsync(username);
			_mapper.Map(memberUpdateDto, user);
			_userRepository.Update(user);
			if (await _userRepository.SaveAllAsync()) return NoContent();
			return BadRequest("Failed to update user");
		}
	}
}
