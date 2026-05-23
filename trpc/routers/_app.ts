import { baseProcedure, createTRPCRouter } from '../init';
import { jobRouter } from './job-routes';
 
export const appRouter = createTRPCRouter({
  job: jobRouter
});
 
// export type definition of API
export type AppRouter = typeof appRouter;