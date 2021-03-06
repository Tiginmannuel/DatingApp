using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DatingApp.Interfaces
{
	public interface IUserRepository
	{
		void Update(AppUser user);
		Task<IEnumerable<AppUser>> GetUserAsync();
		Task<AppUser> GetUserByIdAsync(int id);
		Task<AppUser> GetUserByUserNameAsync(string username);
		Task<PageList<MemberDto>> GetMembersAsync(UserParams userParams);
		Task<MemberDto> GetMemberAsync(string username);
		Task<string> GetUserGenderAsync(string username);
	}
}
