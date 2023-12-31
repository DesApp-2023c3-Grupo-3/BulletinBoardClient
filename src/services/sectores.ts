import axios from 'axios';
import { ROUTES_RELATIVE } from '../routes/route.relatives';
import { handleCall } from './validationMiddleware';

export const sectorApi = {
    getSector: async function() {
        try {
          const response = await handleCall(axios.get, [ROUTES_RELATIVE.sector.getSectors]);
          return response.data;
        } catch (error) {
            return error;
        }
      }
}