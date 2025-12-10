export const corsOptions = {
  origin: process.env.FE_URL?.split(',') ?? ['http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders:
    'Content-Type,Authorization,x-no-retry,Content-Type,Cache-Control,Accept',
  credentials: true,
};
