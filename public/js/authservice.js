SampleApplicationModule
    .service('AuthService', [
        '$location', 'store',
        function($location, store) {
            var userCookie = store.get('userSession');
            if (userCookie) {
                this.isAuthenticated = userCookie.login;
            } else {
                this.isAuthenticated = false;
            }
        }
    ]);
