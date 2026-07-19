using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;
using VoucherManagement.Api.Configuration;
using VoucherManagement.Api.Data;
using VoucherManagement.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// DB Connection
builder.Services.AddDbContextFactory<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("AppDbConnection")));

// Configuration
builder.Services.Configure<VoucherOptions>(
    builder.Configuration.GetSection("Voucher"));

// Auth
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Authentik:Authority"];
        options.Audience = builder.Configuration["Authentik:Audience"];
        // Make sure metadata is loaded via HTTPS in dev too
        options.RequireHttpsMetadata = true;

        options.TokenValidationParameters = new()
        {
            NameClaimType = "sub",
            // Ensure audience is validated against configured value
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Authentik:Audience"]
        };

        // Helpful runtime logging to diagnose 401s during development
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                // short debug output when a token is present
                if (!string.IsNullOrEmpty(ctx.Token))
                {
                    Console.WriteLine($"[Auth] Token received, length={ctx.Token.Length}");
                }

                return Task.CompletedTask;
            },
            OnAuthenticationFailed = ctx =>
            {
                Console.WriteLine($"[Auth] Authentication failed: {ctx.Exception?.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = ctx =>
            {
                Console.WriteLine($"[Auth] Token validated for: {ctx.Principal?.Identity?.Name}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ManageVouchers", policy =>
        policy.RequireAssertion(context =>
        {
            // Some identity providers use "scope", others "scp"
            var scopeValue = context.User.FindFirst("scope")?.Value
                             ?? context.User.FindFirst("scp")?.Value
                             ?? string.Empty;

            var scopes = scopeValue
                .Split(' ', StringSplitOptions.RemoveEmptyEntries);

            var permissions = context.User.FindAll("permissions")
                .Select(c => c.Value);

            return scopes.Contains("manage:vouchers")
                   || permissions.Contains("manage:vouchers");
        })
    );
});

// Services
builder.Services.AddScoped<VoucherService>();

// Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVue",
        policy => policy
            .WithOrigins("http://localhost:8082") // Port von Vite
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        );
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
    app.UseCors("AllowVue");
}

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.MapFallbackToFile("index.html");

// Seed DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();
