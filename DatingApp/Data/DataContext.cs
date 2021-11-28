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

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<AppUser>(u =>
			{
				u.HasKey(e => new { e.UserId });
			});
		}
	}
}
