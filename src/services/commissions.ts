import axios from 'axios';
import { ROUTES_RELATIVE } from '../routes/route.relatives';
import { getTokens, setTokens, handleCall, redirectToLogin } from './validationMiddleware';
import { tokenApi } from './auth';

export const commissionApi = {
  download: async function(id: number) {
    try {
      try {
        const response = await axios.get(`${ROUTES_RELATIVE.course.downloadCommission}/${id}`, { 
        responseType: 'blob',
        headers: {
          "Authorization": `Bearer ${getTokens().accessToken}`
        }});
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Comisiones.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
      } catch {
        const { data } = await tokenApi.refresh({ "refreshToken": `${getTokens().refreshToken}` });
        setTokens(data.accessToken, data.refreshToken);
        const response = await axios.get(`${ROUTES_RELATIVE.course.downloadCommission}/${id}`, { 
          responseType: 'blob',
          headers: {
            "Authorization": `Bearer ${getTokens().accessToken}`
          }});
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Comisiones.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      }
    } catch (error) {
      console.error("Refresh Token Error:", error);
      redirectToLogin()
    }
  },
  post: async function(data: any, endpoint: string) {
    try {
      return handleCall(axios.post, [endpoint, data]);
    } catch(error) {
      return error;
    }
  },
  create: async function(excelData: any){
    try {
      return handleCall(this.post, [excelData, ROUTES_RELATIVE.course.uploadCommission]);
    } catch(error) {
      return error;
    }
  },
  toJson: async function(excelData: any){
    try{
      return handleCall(this.post, [excelData, ROUTES_RELATIVE.image.excelToJson]);
    } catch(error) {
      return error;
    }
  },
  getAll: async function() {
    try {
      const response = await handleCall(axios.get, [ROUTES_RELATIVE.course.commission]);
      return response;
    } catch (error) {
        return error;
    }
  },
  delete: function(id:number) {
    return handleCall(axios.delete, [`${ROUTES_RELATIVE.course.commission}/${id}`])
}
}
