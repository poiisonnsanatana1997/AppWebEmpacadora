/*
 * SOLUCIÓN AL PROBLEMA DE CORS EN EL BACKEND
 *
 * PROBLEMA IDENTIFICADO:
 * Tu middleware personalizado para OPTIONS está causando conflictos con la política CORS de ASP.NET Core.
 * El middleware está respondiendo manualmente a OPTIONS antes de que la política CORS pueda aplicarse correctamente.
 *
 * SOLUCIÓN: Reemplaza tu Program.cs actual con esta versión corregida
 */

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppAPIEmpacadora.Infrastructure.Data;
using AppAPIEmpacadora.Infrastructure.Repositories;
using AppAPIEmpacadora.Repositories.Interfaces;
using AppAPIEmpacadora.Services;
using AppAPIEmpacadora.Services.Interfaces;
using AppAPIEmpacadora.Middleware;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Configuración de cultura global para decimales con punto
var cultureInfo = new CultureInfo("en-US");
CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

// Configurar logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Add services to the container.
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo {
        Title = "API Empacadora",
        Version = "v1",
        Description = "API para el sistema de empacadora con autenticación JWT"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Configuración de la base de datos
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registro de repositorios
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrdenEntradaRepository, OrdenEntradaRepository>();
builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ISucursalRepository, SucursalRepository>();
builder.Services.AddScoped<ITarimaRepository, TarimaRepository>();
builder.Services.AddScoped<IClasificacionRepository, ClasificacionRepository>();
builder.Services.AddScoped<ICajaClienteRepository, CajaClienteRepository>();
builder.Services.AddScoped<IPedidoClienteRepository, PedidoClienteRepository>();
builder.Services.AddScoped<IOrdenPedidoClienteRepository, OrdenPedidoClienteRepository>();
builder.Services.AddScoped<IMermaRepository, MermaRepository>();
builder.Services.AddScoped<IRetornoRepository, RetornoRepository>();
builder.Services.AddScoped<ICajaRepository, CajaRepository>();

// Registro de servicios
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IOrdenEntradaService, OrdenEntradaService>();
builder.Services.AddScoped<IProveedorService, ProveedorService>();
builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<ISucursalService, SucursalService>();
builder.Services.AddScoped<ITarimaService, TarimaService>();
builder.Services.AddScoped<IClasificacionService, ClasificacionService>();
builder.Services.AddScoped<ICajaClienteService, CajaClienteService>();
builder.Services.AddScoped<IPedidoClienteService, PedidoClienteService>();
builder.Services.AddScoped<IOrdenPedidoClienteService, OrdenPedidoClienteService>();
builder.Services.AddScoped<IMermaService, MermaService>();
builder.Services.AddScoped<IRetornoService, RetornoService>();
builder.Services.AddScoped<ICajaService, CajaService>();
builder.Services.AddScoped<IReporteServices, ReporteServices>();

// Registro de servicios para reportes de tarimas
builder.Services.AddScoped<ITarimaResumenRepository, TarimaResumenRepository>();
builder.Services.AddScoped<ITarimaPesoService, TarimaPesoService>();

// Registro del servicio de logging como Singleton
builder.Services.AddSingleton<ILoggingService, LoggingService>();

// Configuración de JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// ============================================
// CONFIGURACIÓN DE CORS CORREGIDA
// ============================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodo", policy =>
    {
        policy.AllowAnyOrigin()    // Permite cualquier origen
              .AllowAnyHeader()    // Permite cualquier header
              .AllowAnyMethod();   // Permite cualquier método HTTP
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// IMPORTANTE: El orden de los middlewares es CRÍTICO
// 1. HTTPS Redirection
app.UseHttpsRedirection();

// 2. Static Files
app.UseStaticFiles();

// 3. CORS - DEBE IR ANTES DE AUTHENTICATION Y AUTHORIZATION
app.UseCors("PermitirTodo");

// 4. Exception Handling Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 5. Authentication
app.UseAuthentication();

// 6. Authorization
app.UseAuthorization();

// ============================================
// ELIMINAR ESTE MIDDLEWARE - ESTÁ CAUSANDO EL PROBLEMA
// ============================================
// NO USES ESTE MIDDLEWARE PERSONALIZADO PARA OPTIONS
// ASP.NET Core CORS ya maneja OPTIONS automáticamente
/*
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers["Access-Control-Allow-Origin"] = "*";
        context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";
        context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }
    await next();
});
*/
// ============================================

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", [Authorize(Roles = "admin")] () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

/*
 * RESUMEN DE CAMBIOS:
 *
 * 1. ELIMINADO el middleware personalizado de OPTIONS (líneas 175-187 del código original)
 *    - Este middleware estaba interceptando las peticiones OPTIONS antes de que CORS pudiera manejarlas
 *    - ASP.NET Core CORS ya maneja automáticamente las peticiones preflight OPTIONS
 *
 * 2. REORDENADO los middlewares en el orden correcto:
 *    - UseHttpsRedirection()
 *    - UseStaticFiles()
 *    - UseCors("PermitirTodo")  <-- DEBE IR ANTES DE UseAuthentication/UseAuthorization
 *    - UseMiddleware<ExceptionHandlingMiddleware>()
 *    - UseAuthentication()
 *    - UseAuthorization()
 *
 * 3. La configuración CORS "PermitirTodo" ya permite:
 *    - Cualquier origen (AllowAnyOrigin)
 *    - Cualquier header (AllowAnyHeader) - incluyendo Authorization, Content-Type, etc.
 *    - Cualquier método (AllowAnyMethod) - incluyendo GET, POST, PUT, DELETE, OPTIONS, PATCH
 *
 * NOTA DE SEGURIDAD:
 * AllowAnyOrigin() es conveniente para desarrollo pero NO SE RECOMIENDA en producción.
 * Para producción, especifica los orígenes exactos:
 *
 * policy.WithOrigins("http://18.217.220.233", "http://18.217.220.233/empacadora")
 *       .AllowAnyHeader()
 *       .AllowAnyMethod();
 */
