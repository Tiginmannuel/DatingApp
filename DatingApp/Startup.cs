using DatingApp.Extensions;
using DatingApp.Middleware;
using DatingApp.SignalR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace DatingApp
{
	public class Startup
	{
		public IConfiguration _config { get; }
		public Startup(IConfiguration configuration)
		{
			_config = configuration;
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddApplicationServices(_config);
			services.AddControllers();
			services.AddSwaggerGen(c =>
			{
				c.SwaggerDoc("v1", new OpenApiInfo { Title = "DatingApp", Version = "v1" });
			});
			services.AddCors();
			services.AddIdentityServices(_config);
			services.AddSignalR();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				// app.UseDeveloperExceptionPage();
				app.UseSwagger();
				app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "DatingApp v1"));
			}

			app.UseMiddleware<ExceptionMiddleware>();

			app.UseRouting();

			app.UseCors(policy => policy
						.AllowAnyHeader()
						.AllowAnyMethod()
						.AllowCredentials()
						.WithOrigins("http://localhost:4200"));

			app.UseAuthentication();

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
				endpoints.MapHub<PresenceHub>("hubs/presence");
				endpoints.MapHub<MessageHub>("hubs/message");
			});
		}
	}
}
