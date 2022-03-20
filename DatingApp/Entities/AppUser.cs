using DatingApp.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.Entities
{
	public class AppUser
	{
		[Key]
		public int Id { get; set; }
		public string UserName { get; set; }
		public byte[] PasswordHash { get; set; }
		public byte[] PasswordSalt { get; set; }
		public DateTime DateOfBirth { get; set; }
		public string KnownAs { get; set; }
		public DateTime CreatedOn { get; set; } = DateTime.Now;
		public DateTime LastUpdatedOn { get; set; } = DateTime.Now;
		public string Gender { get; set; }
		public string Introduction { get; set; }
		public string LookingFor { get; set; }
		public string Interests { get; set; }
		public string City { get; set; }
		public string Country { get; set; }
		public ICollection<Photos> Photos { get; set; }
		public ICollection<UserLike> LikedByUsers { get; set; }
		public ICollection<UserLike> LikedUsers { get; set; }
		public ICollection<Message> MessagesSent { get; set; }
		public ICollection<Message> MessagesReceived { get; set; }
	}
}
