import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface InstanceAttributes {
  name: string;
  host: string;
  cluster: string;
  deployment_type: string;
  status: string;
  commercial_status: string;
  created_at: string;
}

interface Instance {
  id: string;
  type: string;
  attributes: InstanceAttributes;
}

// Credenciales configuradas.
const CLIENT_ID = 'ymlx12345';
const SECRET_KEY = '12345678987654321';

// Middleware para verificar la firma, con logs para debug.
function verifySignature(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    console.log('Authorization header is missing.');
    res.status(401).json({ error: 'No authorization header provided' });
    return;
  }
  
  console.log('Authorization header:', authHeader);
  
  // Formato esperado: "APIAuth client_id:signature"
  const [scheme, credentials] = authHeader.split(' ');
  console.log('Parsed scheme:', scheme, 'Parsed credentials:', credentials);
  
  if (scheme !== 'APIAuth' || !credentials) {
    console.log('Invalid Authorization header format.');
    res.status(401).json({ error: 'Formato del header de autorización inválido' });
    return;
  }

  const [clientId, signature] = credentials.split(':');
  console.log('Client ID received:', clientId);
  console.log('Signature received:', signature);
  
  if (clientId !== CLIENT_ID) {
    console.log('Client ID does not match. Expected:', CLIENT_ID);
    res.status(401).json({ error: 'Client ID inválido' });
    return;
  }

  // Construir la cadena canónica usando la variante "path + query".
  // Según ApiAuth en Ruby, la cadena se construye así:
  // METHOD + "\n" + CONTENT_MD5 (vacío para GET) + "\n" + CONTENT_TYPE + "\n" + DATE + "\n" + REQUEST_PATH+QUERY
  const method = req.method.toUpperCase();
  const contentType = req.get('Content-Type') || '';
  const date = req.get('Date') || '';
  
  // Construir la URL completa para extraer el path y query.
  const hostHeader = req.get('host') || '';
  const protocol = req.protocol;
  const fullUrl = `${protocol}://${hostHeader}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const requestPathQuery = urlObj.pathname + urlObj.search;

  // Construcción de la cadena canónica (usando LF)
  const canonicalString = `${method}\n\n${contentType}\n${date}\n${requestPathQuery}`;
  console.log('Canonical string (LF, path+query):', JSON.stringify(canonicalString));

  // Calcular firma usando HMAC-SHA1
  const expectedSignatureSHA1 = crypto
    .createHmac('sha1', SECRET_KEY)
    .update(canonicalString)
    .digest('base64');
  console.log('Expected signature (SHA1, path+query):', expectedSignatureSHA1);

  // Calcular firma usando HMAC-SHA256
  const expectedSignatureSHA256 = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(canonicalString)
    .digest('base64');
  console.log('Expected signature (SHA256, path+query):', expectedSignatureSHA256);

  // Verificar si alguna coincide con la firma proporcionada.
  if (signature === expectedSignatureSHA1 || signature === expectedSignatureSHA256) {
    console.log('Signature match found.');
    next();
  } else {
    console.log(
      'Signature mismatch. Provided:', signature,
      'Expected (SHA1):', expectedSignatureSHA1,
      'Expected (SHA256):', expectedSignatureSHA256
    );
    res.status(401).json({ error: 'Firma inválida' });
  }
}

// Datos de ejemplo.
const instances: Instance[] = [
  {
    id: "12345",
    type: "instance",
    attributes: {
      name: "new_name",
      host: "testing.buk.br",
      cluster: "brasil",
      deployment_type: "test",
      status: "inactive",
      commercial_status: "implementation",
      created_at: "2023-01-01T00:00:00Z"
    }
  },
  {
    id: "67890",
    type: "instance",
    attributes: {
      name: "another_name",
      host: "another.buk.co",
      cluster: "colombia",
      deployment_type: "test",
      status: "active",
      commercial_status: "implementation",
      created_at: "2023-02-01T00:00:00Z"
    }
  },
  {
    id: "11111",
    type: "instance",
    attributes: {
      name: "instance_chile",
      host: "tenant1.buk.cl",
      cluster: "chile",
      deployment_type: "test",
      status: "active",
      commercial_status: "production",
      created_at: "2023-03-01T00:00:00Z"
    }
  },
  {
    id: "22222",
    type: "instance",
    attributes: {
      name: "instance_peru",
      host: "tenant2.buk.pe",
      cluster: "peru",
      deployment_type: "test",
      status: "inactive",
      commercial_status: "maintenance",
      created_at: "2023-04-01T00:00:00Z"
    }
  },
  {
    id: "33333",
    type: "instance",
    attributes: {
      name: "instance_mexico",
      host: "tenant3.buk.mx",
      cluster: "mexico",
      deployment_type: "test",
      status: "active",
      commercial_status: "production",
      created_at: "2023-05-01T00:00:00Z"
    }
  }
];

const app = express();
const port = process.env.PORT || 3000;

// Se aplica el middleware de verificación a la ruta /api/v1/instances.
app.get('/api/v1/instances', verifySignature, (req: Request, res: Response): void => {
  const hostFilter = req.query.host as string | undefined;
  const filteredInstances = hostFilter
    ? instances.filter(instance => instance.attributes.host === hostFilter)
    : instances;
  res.json({ data: filteredInstances });
});

app.listen(port, () => {
  console.log(`El servidor se está ejecutando en el puerto ${port}`);
});
