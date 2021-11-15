import api from "../services/api";

const getSources = async () => {
   try {
       const response = await api.get("/contracts");
       return response.data;
   } catch (err) {
       throw new Error(err.message);
   }
}

export default getSources;