import{createOwnerConfig}from'../server/owner-auth';
import{handleOwnerRequest}from'../server/owner-handler';
export default{fetch(request:Request):Promise<Response>{return handleOwnerRequest(request,createOwnerConfig(process.env));}};
