SampleApplicationModule
    .service('AuthService', [
        '$location', 'storeProvider',
        function($location) {
            console.log(storeProvider);
            var userCookie = store.get('userSession');
            if (userCookie) {
                this.isAuthenticated = userCookie.login;
            } else {
                this.isAuthenticated = false;
            }
        }
    ]);
