using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
	[Authorize]
	public class LikesController : BaseApiController
	{
		private readonly IUserRepository _userRepository;
		private readonly ILikesRepository _likesRepository;

		public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
		{
			_userRepository = userRepository;
			_likesRepository = likesRepository;
		}

		[HttpPost("{username}")]
		public async Task<ActionResult> AddLikeAsync(string userName)
		{
			var sourceUserId = User.GetUserId();
			var likedUser = await _userRepository.GetUserByUserNameAsync(userName);
			var sourceUser = await _likesRepository.GetUserWithLikesAsync(sourceUserId);

			if (likedUser == null) return NotFound();

			if (sourceUser.UserName == userName) return BadRequest("You cannot like yourself");

			var userLike = await _likesRepository.GetUserLikeAsync(sourceUserId, likedUser.UserId);

			if (userLike != null) return BadRequest("You Already Like this User");

			userLike = new UserLike
			{
				SourceUserId = sourceUserId,
				LikedUserId = likedUser.UserId
			};
			sourceUser.LikedUsers.Add(userLike);
			if (await _userRepository.SaveAllAsync()) return Ok();
			return BadRequest("Failed To Like user");
		}

		[HttpGet]
		public async Task<ActionResult<PageList<LikeDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
		{
			likesParams.UserId = User.GetUserId();
			var users = await _likesRepository.GetUserLikesAsync(likesParams);

			Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
			return Ok(users);
		}
	}
}
