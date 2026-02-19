# CONFIGURACIÓN CORS PARA EL BACKEND .NET

## Problema Identificado

El error de CORS ocurre porque:
- Frontend: `http://18.217.220.233/empacadora`
- Backend API: `http://18.217.220.233/EM001/api`

Aunque están en el mismo servidor, tienen **diferentes paths base**, por lo que el navegador los trata como **orígenes diferentes** (cross-origin).

## Solución: Configurar CORS en el Backend .NET

### Opción 1: .NET 6+ (Program.cs)

Agrega esto en tu archivo `Program.cs` del backend:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Agregar servicios CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://18.217.220.233",           // Origen principal
                "http://18.217.220.233/empacadora" // Con path base
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(origin =>
            {
                // Permitir también el dominio completo
                return origin.StartsWith("http://18.217.220.233");
            })
            .AllowCredentials(); // Solo si usas cookies o autenticación basada en sesión
    });
});

// ... otros servicios
builder.Services.AddControllers();

var app = builder.Build();

// IMPORTANTE: UseCors debe ir ANTES de UseAuthorization y UseEndpoints
app.UseCors("AllowFrontend");

app.UseAuthentication(); // Si tienes autenticación
app.UseAuthorization();

app.MapControllers();

app.Run();
```

### Opción 2: .NET Framework con Startup.cs

Si usas .NET Framework o .NET Core 3.1, agrega en `Startup.cs`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // Configurar CORS
    services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins(
                    "http://18.217.220.233",
                    "http://18.217.220.233/empacadora"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin =>
                    origin.StartsWith("http://18.217.220.233")
                )
                .AllowCredentials();
        });
    });

    services.AddControllers();
    // ... otros servicios
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // ... otros middlewares

    // IMPORTANTE: Orden correcto
    app.UseCors("AllowFrontend"); // Debe ir ANTES de UseAuthorization

    app.UseAuthentication();
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
```

### Opción 3: Configuración Global con Atributo (NO RECOMENDADO)

Si no puedes modificar el Program.cs/Startup.cs, puedes agregar en cada controller:

```csharp
using Microsoft.AspNetCore.Cors;

[EnableCors("AllowFrontend")]
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // ... tus métodos
}
```

## Verificación

Después de aplicar la configuración:

1. Recompila y despliega tu API en IIS
2. Reinicia el sitio en IIS
3. Abre DevTools del navegador (F12)
4. Ve a la pestaña Network
5. Intenta hacer login
6. Verifica que las peticiones OPTIONS retornen status 200
7. Verifica que los headers de respuesta incluyan:
   - `Access-Control-Allow-Origin: http://18.217.220.233`
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: ...`

## Configuración Alternativa en web.config del Backend (IIS)

Si prefieres configurar CORS directamente en IIS, agrega esto al `web.config` de tu API:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <add name="Access-Control-Allow-Origin" value="http://18.217.220.233" />
        <add name="Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS, PATCH" />
        <add name="Access-Control-Allow-Headers" value="Content-Type, Authorization, X-Requested-With, X-Request-Start" />
        <add name="Access-Control-Allow-Credentials" value="true" />
      </customHeaders>
    </httpProtocol>

    <!-- Permitir peticiones OPTIONS -->
    <handlers>
      <remove name="OPTIONSVerbHandler" />
      <remove name="ExtensionlessUrlHandler-Integrated-4.0" />
      <add name="ExtensionlessUrlHandler-Integrated-4.0"
           path="*."
           verb="*"
           type="System.Web.Handlers.TransferRequestHandler"
           preCondition="integratedMode,runtimeVersionv4.0" />
    </handlers>
  </system.webServer>
</configuration>
```

## Notas Importantes

1. **AllowCredentials**: Solo usa `.AllowCredentials()` si tu aplicación usa cookies o autenticación basada en sesión. Si solo usas Bearer tokens (como en tu caso), puedes omitirlo.

2. **Orden de Middlewares**: Es CRÍTICO que `UseCors()` esté ANTES de `UseAuthorization()`.

3. **Múltiples Orígenes**: La política permite tanto `http://18.217.220.233` como `http://18.217.220.233/empacadora` para cubrir todas las variantes.

4. **Seguridad**: En producción, evita usar `.AllowAnyOrigin()` o `.SetIsOriginAllowed(_ => true)` ya que permite peticiones desde cualquier dominio.

## Solución Temporal para Testing

Si necesitas probar rápidamente si CORS es el único problema, puedes usar una política permisiva temporalmente:

```csharp
// SOLO PARA TESTING - NO USAR EN PRODUCCIÓN
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

app.UseCors("AllowAll");
```

Si esto funciona, sabrás que el problema es CORS y puedes aplicar la configuración segura mostrada arriba.
