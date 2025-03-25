import express, { Request, Response } from 'express';

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

// Sample data with additional instances and matching tenant suffixes.
// Mapping for suffixes:
//   '.cl' => 'chile',
//   '.br' => 'brasil',
//   '.pe' => 'peru',
//   '.co' => 'colombia',
//   '.mx' => 'mexico'
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

// GET endpoint to return all instances and support filtering by host.
app.get('/api/v1/instances', (req: Request, res: Response) => {
  // Print request details to console
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });

  const hostFilter = req.query.host as string | undefined;

  // Filter instances if a host query is provided.
  const filteredInstances = hostFilter
    ? instances.filter(instance => instance.attributes.host === hostFilter)
    : instances;

  res.json({ data: filteredInstances });
});

// Start the server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
