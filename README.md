# Strapi plugin firebase-auth

A quick description of firebase-auth.


## Step 1 -- Install Fireabse Admin
`npm install firebase-admin`

##Step 2  -- Add service account key (.json)
go to settings page and submit he .json file 



##Step 4 -- add plugin to Strapi:

```
./api/config/plugins.js

...  

"firebase-auth": {
    enabled: true,
    resolve: "./src/plugins/firebase-auth",
  },
  
...

  ```
##Step 5 -- re-build admin:
`npm run build`

(or just delete the existing ./build directory)

##Step 5 -- grant public permissions:
From the strapi admin, navigate to users-permissions and grant public role to the

http://localhost:1337/admin/settings/users-permissions/roles/2

```
Bound route to firebaseController.validateToken
POST /api/firebase-auth/
```
