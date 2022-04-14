using DatingApp.Entities;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace DatingApp.Interfaces
{
	public interface ITokenService
	{
		Task<string> CreateTokenAsync(AppUser user);
	}
}
