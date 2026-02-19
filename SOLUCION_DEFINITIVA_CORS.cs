/*
 * SOLUCIÓN DEFINITIVA AL PROBLEMA DE CORS
 *
 * PROBLEMA:
 * - Sin el middleware OPTIONS, no funcionan POST, PUT, DELETE
 * - Con el middleware OPTIONS, hay conflicto con headers personalizados
 *
 * SOLUCIÓN:
 * Mantener el middleware OPTIONS pero asegurar que:
 * 1. Se ejecute ANTES de UseCors()
 * 2. Permita TODOS los headers que el frontend pueda enviar
 * 3. Use el mismo origen que la política CORS
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

// Registro del servicio de logging
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

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodo", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseStaticFiles();

// ============================================
// MIDDLEWARE DE CORS PARA OPTIONS - VERSIÓN CORREGIDA
// IMPORTANTE: Debe ir ANTES de UseCors()
// ============================================
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
        context.Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

        // ✅ CLAVE: Permitir CUALQUIER header que el cliente envíe
        // Esto soluciona el problema del header X-Request-Start y cualquier otro
        var requestedHeaders = context.Request.Headers["Access-Control-Request-Headers"].ToString();
        if (!string.IsNullOrEmpty(requestedHeaders))
        {
            context.Response.Headers.Append("Access-Control-Allow-Headers", requestedHeaders);
        }
        else
        {
            // Fallback: lista de headers comunes
            context.Response.Headers.Append("Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-Requested-With, Accept, Origin");
        }

        context.Response.Headers.Append("Access-Control-Max-Age", "86400"); // 24 horas
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }
    await next();
});

// Aplicar política CORS
app.UseCors("PermitirTodo");

// Middleware de manejo de excepciones
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Authentication y Authorization
app.UseAuthentication();
app.UseAuthorization();

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
 * CAMBIOS CLAVE EN ESTA SOLUCIÓN:
 *
 * 1. EL MIDDLEWARE OPTIONS SE MANTIENE (necesario para POST, PUT, DELETE)
 *
 * 2. MEJORA CRÍTICA en el middleware:
 *    - Lee el header "Access-Control-Request-Headers" de la petición preflight
 *    - Devuelve exactamente los mismos headers que el cliente solicita
 *    - Esto permite CUALQUIER header sin tener que listarlos manualmente
 *
 * 3. ORDEN DE MIDDLEWARES:
 *    a) UseHttpsRedirection()
 *    b) UseStaticFiles()
 *    c) Middleware OPTIONS personalizado
 *    d) UseCors("PermitirTodo")
 *    e) UseMiddleware<ExceptionHandlingMiddleware>()
 *    f) UseAuthentication()
 *    g) UseAuthorization()
 *
 * 4. CÓMO FUNCIONA:
 *    - Cuando el navegador envía OPTIONS, pregunta: "¿puedo usar estos headers?"
 *    - El middleware lee esa lista y responde: "sí, puedes usar esos headers"
 *    - Esto es más flexible que listar manualmente cada header
 *
 * ALTERNATIVA SI PREFIERES ESPECIFICAR HEADERS:
 * En lugar de leer Access-Control-Request-Headers, puedes usar:
 *
 * context.Response.Headers.Append("Access-Control-Allow-Headers",
 *     "Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Request-Start");
 *
 * Pero la solución dinámica es mejor porque funciona con cualquier header futuro.
 */
