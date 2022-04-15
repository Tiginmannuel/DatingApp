using DatingApp.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
	public class DataContext : IdentityDbContext<AppUser, AppRole, int,
		IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
		IdentityRoleClaim<int>, IdentityUserToken<int>>
	{
		public DataContext(DbContextOptions options) : base(options)
		{

		}
		public DbSet<UserLike> Likes { get; set; }
		public DbSet<Message> Messages { get; set; }
		public DbSet<Group> Groups { get; set; }
		public DbSet<Connection> Connections { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<AppUser>()
				.HasMany(ur => ur.UserRoles)
				.WithOne(u => u.User)
				.HasForeignKey(ur => ur.UserId)
				.IsRequired();

			modelBuilder.Entity<AppRole>()
				.HasMany(ur => ur.UserRoles)
				.WithOne(u => u.Role)
				.HasForeignKey(ur => ur.RoleId)
				.IsRequired();

			modelBuilder.Entity<AppUser>(u =>
			{
				u.HasKey(e => new { e.Id });
			});
			modelBuilder.Entity<UserLike>(u =>
			{
				u.HasKey(e => new { e.SourceUserId, e.LikedUserId });
			});
			modelBuilder.Entity<UserLike>()
				.HasOne(s => s.SourceUser)
				.WithMany(l => l.LikedUsers)
				.HasForeignKey(s => s.SourceUserId)
				.OnDelete(DeleteBehavior.NoAction);

			modelBuilder.Entity<UserLike>()
				.HasOne(u => u.LikedUser)
				.WithMany(l => l.LikedByUsers)
				.HasForeignKey(f => f.LikedUserId)
				.OnDelete(DeleteBehavior.NoAction);

			modelBuilder.Entity<Message>()
				.HasOne(m => m.Recipient)
				.WithMany(u => u.MessagesReceived)
				.HasForeignKey(m => m.RecipientId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Message>()
				.HasOne(m => m.Sender)
				.WithMany(u => u.MessagesSent)
				.HasForeignKey(u => u.SenderId)
				.OnDelete(DeleteBehavior.Restrict);
		}
	}
}
