using DatingApp.Data;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using DatingApp.Services;
using DatingApp.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.Extensions
{
	public static class ApplicationServiceExtensions
	{
		public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
		{
			services.AddSingleton<PresenceTracker>();
			services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
			services.AddScoped<ITokenService, TokenService>();
			services.AddScoped<IPhotoService, PhotoService>();
			services.AddScoped<IUnitOfWork, UnitOfWork>();
			services.AddScoped<LogUserActivity>();
			services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
			var connectionString = config.GetConnectionString("DatingAppServer");
			services.AddDbContext<DataContext>(options => options.UseSqlServer(connectionString));

			return services;
		}
	}
}
