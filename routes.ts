import { z } from 'zod';
import { 
  insertCustomerSchema, customers, 
  insertContentRequestSchema, contentRequests,
  insertProblemReportSchema, problemReports,
  insertNoticeSchema, notices,
  insertGameSchema, games
} from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ customerCode: z.string() }),
      responses: {
        200: z.custom<typeof customers.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof customers.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      }
    }
  },
  customers: {
    list: {
      method: 'GET' as const,
      path: '/api/customers' as const,
      responses: {
        200: z.array(z.custom<typeof customers.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/customers' as const,
      input: insertCustomerSchema,
      responses: {
        201: z.custom<typeof customers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/customers/:id' as const,
      input: insertCustomerSchema.partial(),
      responses: {
        200: z.custom<typeof customers.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/customers/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  },
  contentRequests: {
    create: {
      method: 'POST' as const,
      path: '/api/content-requests' as const,
      input: insertContentRequestSchema,
      responses: {
        201: z.custom<typeof contentRequests.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    list: {
      method: 'GET' as const,
      path: '/api/content-requests' as const,
      responses: {
        200: z.array(z.custom<typeof contentRequests.$inferSelect>()),
      }
    }
  },
  problemReports: {
    create: {
      method: 'POST' as const,
      path: '/api/problem-reports' as const,
      input: insertProblemReportSchema,
      responses: {
        201: z.custom<typeof problemReports.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    list: {
      method: 'GET' as const,
      path: '/api/problem-reports' as const,
      responses: {
        200: z.array(z.custom<typeof problemReports.$inferSelect>()),
      }
    }
  },
  notices: {
    list: {
      method: 'GET' as const,
      path: '/api/notices' as const,
      responses: {
        200: z.array(z.custom<typeof notices.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/notices' as const,
      input: insertNoticeSchema,
      responses: {
        201: z.custom<typeof notices.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/notices/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  },
  games: {
    list: {
      method: 'GET' as const,
      path: '/api/games' as const,
      responses: {
        200: z.array(z.custom<typeof games.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/games' as const,
      input: insertGameSchema,
      responses: {
        201: z.custom<typeof games.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/games/:id' as const,
      input: insertGameSchema.partial(),
      responses: {
        200: z.custom<typeof games.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/games/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    },
    uploadBanner: {
      method: 'POST' as const,
      path: '/api/games/:id/banner' as const,
      responses: {
        200: z.object({ bannerUrl: z.string() }),
      }
    }
  },
  receipts: {
    upload: {
      method: 'POST' as const,
      path: '/api/receipts/upload' as const,
      responses: {
        200: z.object({ url: z.string(), message: z.string() })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
