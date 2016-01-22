#OpenShift Deployment Guide

**IMPORTANT:** First of all, you **MUST** check and set the `host` settings in the config file `./src/config`
You should see this:
```
ws: {
      // replace with your production host
      host: 'http://hapi-reactstarterkit.rhcloud.com', //--- Replace this with your OpenShift host address
      port: 8000
    }
```

1. Click on **"Add Application..."** on your Openshift console.

2. On the next page, go to the bottom where it says **"Code Anything"** and paste the following URL

    `http://cartreflect-claytondev.rhcloud.com/github/dindaleon/openshift-cartridge-nodejs`
    
  ![Step 2](http://s15.postimg.org/otpj27viz/openshift_deployment_2.png "Step 2")   

  Click **"Next"** This will allow you to run the latest Node version.

3. On the page **"Step 2: Configure application"** fill out your app name and paste the `Hapi React Starter Kit` URL in the **"Source Code"** field

    `https://github.com/Dindaleon/hapi-react-starter-kit.git`
    
  ![Step 3](http://s8.postimg.org/xr3w9szet/openshift_deployment_3.png "Step 3") 

  Click on **"Create Application"**

4. Once the application has been created, you should see something like this:

  ![Step 4](http://s24.postimg.org/5c5j4thz9/openshift_deployment_4.png "Step 4")

  Clone your newly created app inside any folder you want.

5. Setting enviroment variables. We have two set two variables, one for production and the other specifying a cache folder for babel.
From command prompt, we set the variables:

    `$ rhc env set <Variable>=<Value> <Variable2>=<Value2> -a App_Name`

    `$ rhc env set NODE_ENV=production -a App_Name`
    
    `$ rhc env set BABEL_CACHE_PATH=$OPENSHIFT_DATA_DIR -a App_Name`


6. Install Redis cartridge:

    `$ rhc add-cartridge http://cartreflect-claytondev.rhcloud.com/reflect?github=Dindaleon/openshift-redis-cart-1 -a App_Name`

7. SSH into your app and install the following dev dependencies required for building the app:

  `npm install ---save-dev rimraf webpack extract-text-webpack-plugin stats-webpack-plugin strip-loader`

  then

  `npm run build`

8. Restart your app
