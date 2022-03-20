using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Data
{
	public class LikesRepository : ILikesRepository
	{
		private readonly DataContext _context;

		public LikesRepository(DataContext context)
		{
			_context = context;
		}
		public async Task<UserLike> GetUserLikeAsync(int sourceUserId, int likedUserId)
		{
			return await _context.Likes.FindAsync(sourceUserId, likedUserId);
		}

		public async Task<PageList<LikeDto>> GetUserLikesAsync(LikesParams likesParams)
		{
			var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
			var likes = _context.Likes.AsQueryable();

			if (likesParams.Predicate == "liked")
			{
				likes = likes.Where(l => l.SourceUserId == likesParams.UserId);
				users = likes.Select(l => l.LikedUser);
			}
			if (likesParams.Predicate == "likedBy")
			{
				likes = likes.Where(l => l.LikedUserId == likesParams.UserId);
				users = likes.Select(l => l.SourceUser);
			}

			var likedUsers = users.Select(x => new LikeDto
			{
				Username = x.UserName,
				KnownAs = x.KnownAs,
				Age = x.DateOfBirth.CalculateAge(),
				PhotoUrl = x.Photos.FirstOrDefault(p => p.IsMain).Url,
				City = x.City,
				Id = x.Id
			});
			return await PageList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
		}

		public async Task<AppUser> GetUserWithLikesAsync(int userId)
		{
			return await _context.Users
				.Include(u => u.LikedUsers)
				.FirstOrDefaultAsync(x => x.Id == userId);
		}
	}
}
