using System.ComponentModel.DataAnnotations;

namespace DatingApp.Entities
{
	public class AppUser
	{
		[Key]
		public int UserId { get; set; }
		public string UserName { get; set; }
	}
}
