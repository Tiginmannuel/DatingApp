using DatingApp.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
	public class DataContext : DbContext
	{
		public DataContext(DbContextOptions options) : base(options)
		{

		}

		public DbSet<AppUser> Users { get; set; }
		public DbSet<UserLike> Likes { get; set; }
		public DbSet<Message> Messages { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			modelBuilder.Entity<AppUser>(u =>
			{
				u.HasKey(e => new { e.UserId });
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
