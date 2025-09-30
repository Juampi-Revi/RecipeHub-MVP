# 🔒 GUÍA DE SEGURIDAD - RecipeHub MVP

## 🚨 RESUMEN DEL INCIDENTE

**Fecha:** 30 de Septiembre 2025  
**Problema:** Exposición de credenciales en repositorio GitHub  
**Detectado por:** GitGuardian y GitHub Security  
**Estado:** ✅ RESUELTO

### Credenciales Expuestas:
- ❌ SMTP credentials
- ❌ MongoDB Atlas Database URI

### Acciones Tomadas:
- ✅ Verificación de archivos locales
- ✅ Creación de .gitignore completo
- ✅ Generación de nuevas credenciales seguras
- ✅ Implementación de mejores prácticas

---

## 🛡️ MEJORES PRÁCTICAS DE SEGURIDAD

### 1. **MANEJO DE VARIABLES DE ENTORNO**

#### ✅ HACER:
```bash
# Usar archivos .env para desarrollo local
DATABASE_URL="file:./dev.db"
JWT_SECRET="generated-secure-random-string"

# Usar variables de entorno en producción
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export JWT_SECRET="production-secure-key"
```

#### ❌ NO HACER:
```javascript
// NUNCA hardcodear credenciales en el código
const dbUrl = "postgresql://user:password123@localhost:5432/db";
const jwtSecret = "my-secret-key";
```

### 2. **ARCHIVO .GITIGNORE OBLIGATORIO**

**Siempre incluir en .gitignore:**
```gitignore
# Variables de entorno
.env
.env.local
.env.*.local

# Bases de datos
*.db
*.sqlite
dev.db

# Logs con posibles credenciales
logs/
*.log

# Archivos de credenciales
*.pem
*.key
*.crt
secrets/
credentials/
```

### 3. **GENERACIÓN DE CREDENCIALES SEGURAS**

#### JWT Secrets:
```bash
# Generar JWT secret seguro (64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Passwords:
```bash
# Generar passwords seguros
openssl rand -base64 32
```

### 4. **ESTRUCTURA DE ARCHIVOS SEGURA**

```
proyecto/
├── .env                    # ❌ NUNCA commitear
├── .env.example           # ✅ Template sin credenciales
├── .gitignore             # ✅ OBLIGATORIO
└── src/
    ├── config/
    │   └── database.ts    # ✅ Usar process.env
    └── ...
```

### 5. **VERIFICACIÓN ANTES DE COMMIT**

#### Pre-commit Checklist:
- [ ] ¿Hay archivos .env en el commit?
- [ ] ¿Hay credenciales hardcodeadas?
- [ ] ¿Está actualizado el .gitignore?
- [ ] ¿Se usan variables de entorno?

#### Comandos de verificación:
```bash
# Buscar posibles credenciales
git diff --cached | grep -i "password\|secret\|key\|token"

# Verificar archivos a commitear
git status

# Verificar .gitignore
git check-ignore .env
```

---

## 🔧 HERRAMIENTAS DE SEGURIDAD

### 1. **GitGuardian** (Activo)
- Detecta credenciales en tiempo real
- Alertas automáticas por email
- Integración con GitHub

### 2. **GitHub Security** (Activo)
- Secret scanning
- Dependency alerts
- Security advisories

### 3. **Pre-commit Hooks** (Recomendado)
```bash
# Instalar pre-commit
npm install --save-dev husky

# Configurar hook
npx husky add .husky/pre-commit "npm run security-check"
```

---

## 🚀 CONFIGURACIÓN DE PRODUCCIÓN

### Variables de Entorno Requeridas:
```bash
# Base de datos
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="production-secret-256-bits-minimum"
JWT_EXPIRES_IN="7d"

# CORS
FRONTEND_URL="https://yourdomain.com"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (si se usa)
SMTP_HOST="smtp.provider.com"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="app-specific-password"
```

### Plataformas de Deployment:

#### **Heroku:**
```bash
heroku config:set JWT_SECRET=your-production-secret
heroku config:set DATABASE_URL=postgresql://...
```

#### **Vercel:**
```bash
vercel env add JWT_SECRET
vercel env add DATABASE_URL
```

#### **Railway:**
```bash
railway variables set JWT_SECRET=your-production-secret
```

---

## 📋 CHECKLIST DE SEGURIDAD

### Desarrollo:
- [ ] .gitignore configurado
- [ ] .env no commiteado
- [ ] Credenciales en variables de entorno
- [ ] .env.example actualizado
- [ ] Secrets generados criptográficamente

### Pre-deployment:
- [ ] Variables de entorno configuradas
- [ ] Credenciales de producción generadas
- [ ] HTTPS habilitado
- [ ] Rate limiting configurado
- [ ] Logs sin credenciales

### Post-deployment:
- [ ] Monitoreo de seguridad activo
- [ ] Backups seguros
- [ ] Rotación de credenciales programada
- [ ] Auditoría de accesos

---

## 🆘 RESPUESTA A INCIDENTES

### Si se detecta exposición:

1. **INMEDIATO (0-15 min):**
   - Rotar todas las credenciales expuestas
   - Revocar tokens/keys comprometidos
   - Verificar logs de acceso

2. **CORTO PLAZO (15-60 min):**
   - Limpiar historial de Git si es necesario
   - Actualizar .gitignore
   - Notificar al equipo

3. **MEDIANO PLAZO (1-24 hrs):**
   - Auditar todo el código
   - Implementar herramientas de prevención
   - Documentar el incidente

4. **LARGO PLAZO (1-7 días):**
   - Revisar procesos de desarrollo
   - Capacitar al equipo
   - Implementar controles adicionales

---

## 📞 CONTACTOS DE EMERGENCIA

- **GitHub Security:** security@github.com
- **GitGuardian:** support@gitguardian.com
- **Equipo de Desarrollo:** [tu-email]

---

## 📚 RECURSOS ADICIONALES

- [OWASP Security Guidelines](https://owasp.org/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [GitGuardian Documentation](https://docs.gitguardian.com/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

---

**Última actualización:** 30 de Septiembre 2025  
**Próxima revisión:** 30 de Octubre 2025