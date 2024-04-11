# vue-backend

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


mongod --replSet rs0 \
       --port 27017 \
       --dbpath /path/to/your/mongodb/dataDirectory \
       --authenticationDatabase "admin" \
       --username "datamongo" \
       --password