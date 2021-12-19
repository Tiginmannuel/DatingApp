using DatingApp.Data;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using DatingApp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.Extensions
{
	public static class ApplicationServiceExtensions
	{
		public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
		{
			services.AddScoped<ITokenService, TokenService>();
			services.AddScoped<IUserRepository, UserRepository>();
			services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
			var connectionString = config.GetConnectionString("DatingAppServer");
			services.AddDbContext<DataContext>(options => options.UseSqlServer(connectionString));

			return services;
		}
	}
}
