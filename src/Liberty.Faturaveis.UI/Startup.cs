using Liberty.Common;
using Liberty.Faturaveis.UI.Infrastructure.Configurations;
using Liberty.Faturaveis.UI.Infrastructure.IoC;
using Liberty.Faturaveis.UI.Infrastructure.Mapper;
using Liberty.Faturaveis.UI.Infrastructure.SeedWork;
using Liberty.Logging.Contract;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace Liberty.Faturaveis.UI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            LibertyContext.ApplicationId = "Liberty.Faturaveis.UI";
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages()
                .AddRazorRuntimeCompilation();
            var redis = ConnectionMultiplexer.Connect(Configurations.GetConnectionString("Redis"));
            services.AddDataProtection()
                .PersistKeysToStackExchangeRedis(redis, "DataProtection-Keys");

            services.AddHttpContextAccessor();
            services.AddAutoMapperSetup();
            services.AddLibertyFrameworkLog(Configuration);
            services.AddHttpClient<IRestApi, RestApi>()
                .SetHandlerLifetime(TimeSpan.FromSeconds(5));

            new CotadorVidaDI(services).DependencyInjection();
          
            SessionConfiguration.AddSessionRedis(services, Configuration);

            // Enable cookie authentication
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie(options =>
                    {
                        options.LoginPath = "/Login";
                        //options.Cookie.Name = "LibertySessionUI";
                        //options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                        //options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
                        //options.Cookie.HttpOnly = true;
                    });

            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true; // consent required
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            
            services.AddSession(opts =>
            {
                opts.Cookie.IsEssential = true; // make the session cookie Essential
            });

            services.Configure<FormOptions>(x => x.MultipartBodyLengthLimit = 1_074_790_400);
            /*Removido na migração para o .NET Core 3.1
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            */
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger lgr)
        {
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            IList<CultureInfo> cultures = new List<CultureInfo> { new CultureInfo("pt-BR"), new CultureInfo("en-US") };

            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("pt-BR"),
                SupportedCultures = cultures,
                SupportedUICultures = cultures
            });

            app.UseStaticFiles();

            //Enable sessions
            app.UseCustomExceptionHandler(lgr);
            app.UseLibertyContext(lgr);
            app.UseSession();
            app.UseCookiePolicy();
            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
            });

            /*Removido na migração para o .NET Core 3.1
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
            */
        }
    }
}
