import Route from '@ioc:Adonis/Core/Route'

export default function authRoutes(){
    Route.post('/login','UsersController.login')
    Route.post('/register', "UsersController.register");
    Route.post('/logout', 'UsersController.logout');
}
