//  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Users from 'App/Models/Users';
import Hash from '@ioc:Adonis/Core/Hash'



export default class UsersController {

 public async  login({auth, request, response}) {
    const payload = request.all();

    try{
       const user = await Users.findBy('email', payload.email || 'username', payload.username);

       if((await Hash.verify(user.password,payload.password))){
            const token = await auth.use('api').generate(user,{
                expiresIn:'30mins'
            })
            return response.send({
                success:true,
                message:'successfully logged in',
                data:{
                    user:user,
                    token:token
                }
            })
       }else{
           return response.badRequest('Invalid credential');
       }
    }catch{
        return response.status(400).send({
            error:{
                message:'User with provided credentials could not be found',
                data:payload
            }
        })
    }
 }

 public async register({request}){
     const User = new Users();
     const payload = request.all();

  

     User.username = payload.username;
     User.email = payload.email;
     User.password = payload.password;

    

   if(await User.save()){
       return ({
           success: true,
           message:'New User has been added',
           data:payload
       })
   }else{
       return({
            error: true,
            message:"Opps an error has occured",           
       })
   }




 }
 public async logout ({auth, response}){
        try{
            
         await auth.use('api').revoke()
         if( auth.use('api').isLoggedOut){
             return({
                 message:'Session logout',
                 isLoggedOut: true,
             })
         }
        }catch(error){
            return response.send({
                message:error,
                isLoggedIn: false,
            })
        }      

 }
}
