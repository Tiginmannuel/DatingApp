using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;
using System.Threading.Tasks;

namespace DatingApp.Interfaces
{
	public interface ILikesRepository
	{
		Task<UserLike> GetUserLikeAsync(int sourceUserId, int likedUserId);
		Task<AppUser> GetUserWithLikesAsync(int userId);
		Task<PageList<LikeDto>> GetUserLikesAsync(LikesParams likesParams);
	}
}
