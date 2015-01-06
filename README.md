#loopback-example-postgresql

```
git clone https://github.com/strongloop/loopback-example-postgresql.git
cd loopback-example-postgresql
npm install
# then run any script in `server/bin` (ie. node server/bin/discover-schema.js)
```

- [Prerequisites](#prerequisites)
- [Procedure](#procedure)
  - [1. Create the application](#1-create-the-application)
  - [2. Install the connector](#2-install-the-connector)
  - [3. Configure the datasource](#3-configure-the-datasource)
  - [4. Add a model](#4-add-a-model)
  - [5. Add a script to migrate data](#5-add-a-script-to-migrate-data)
  - [6. Add a script to discover a schema](#6-add-a-script-to-discover-a-schema)
  - [7. Add a script to discover and build models](#7-add-a-script-to-discover-and-build-models)
  - [8. Conclusion](#8-conclusion)

##Prerequisites

###Tutorials

- [Getting started with LoopBack](http://docs.strongloop.com/display/LB/Getting+started+with+LoopBack)

###Knowledge
- [LoopBack models](http://docs.strongloop.com/display/LB/Defining+models)

##Procedure

###1. Create the application

####Application information

- Name: `loopback-example-postgresql`
- Directory to contain the project: `loopback-example-postgresql`

```
slc loopback loopback-example-postgresql
... # follow the prompts
cd loopback-example-postgresql
```

###2. Install the connector

```
npm install --save loopback-connector-postgresql
```

###3. Configure the datasource

####Datasource information
- Datasource: `accountDs`
- Connector: `PostgresSQL`

```
slc loopback:datasource accountDs
... # follow the prompts
```

Add the [datasource configurations](/server/datasources.json#L9-L13) to
[`server/datasources.json`](/server/datasources.json).

> We provide a demo server for convenience sake, but feel free to use your own database server.

###4. Add a model

####Model information
- Name: `Account`
  - Datasource: `accountDs`
  - Base class: `PersistedModel`
  - Expose via REST: `Yes`
  - Custom plural form: *Leave blank*
  - Properties
    - `email`
      - String
      - Not required
    - `createdAt`
      - Date
      - Not required
    - `lastModifiedAt`
      - Date
      - Not required

```
slc loopback:model Account
... # follow the prompts
```

###5. Add a script to migrate data

Create a directory for to store scripts.

```
mkdir server/bin
```

> `bin` is a directory name commonly used for executable files on unix and unix-like systems.

Create [`automigrate.js`](/server/bin/automigrate.js) inside the
[`bin`](/server/bin) directory.

> [`datasSource.automigrate()`](/server/bin/automigrate.js) requires INSERT object, CREATE DDL, and DROP DDL rights to execute properly.

####Test the script

> #####WARNING
> [`dataSource.automigrate()`](/server/bin/automigrate.js#L18) creates a new table in the database if it doesn't exist. If the table already exists, it will be **DESTROYED** and **ALL** existing data will be dropped. If you want to keep the existing data, use `datasource.autoupdate()` instead.

```
node server/bin/automigrate.js
```

This script creates [two models](/server/bin/automigrate.js#L5-L14) in the
[specified data source](/server/bin/automigrate.js#L16).

> You can view the newly inserted data using built-in [API explorer](http://docs.strongloop.com/display/LB/Use+API+Explorer). Start the application with `slc run` and browse to [`localhost:3000/explorer`][explorer] to inspect the data.

###6. Add a script to discover a schema

> *Discovery* is the process of reverse engineering a LoopBack model from an existing database schema.

Create [`discover-schema.js`](/server/bin/discover-schema.js) inside the
[`bin` directory](/server/bin).

####Test the script

```
node server/bin/discover-schema.js
```

You should see:

```
{
  "name": "Account",
  "options": {
    "idInjection": false,
    "postgresql": {
      "schema": "public",
      "table": "account"
    }
  },
  "properties": {
    "email": {
      "type": "String",
      "required": false,
      "length": 1024,
      "precision": null,
      "scale": null,
      "postgresql": {
        "columnName": "email",
        "dataType": "character varying",
        "dataLength": 1024,
        "dataPrecision": null,
        "dataScale": null,
        "nullable": "YES"
      }
    },
    "createdat": {
      "type": "String",
      "required": false,
      "length": null,
      "precision": null,
      "scale": null,
      "postgresql": {
        "columnName": "createdat",
        "dataType": "timestamp with time zone",
        "dataLength": null,
        "dataPrecision": null,
        "dataScale": null,
        "nullable": "YES"
      }
    },
    "lastmodifiedat": {
      "type": "String",
      "required": false,
      "length": null,
      "precision": null,
      "scale": null,
      "postgresql": {
        "columnName": "lastmodifiedat",
        "dataType": "timestamp with time zone",
        "dataLength": null,
        "dataPrecision": null,
        "dataScale": null,
        "nullable": "YES"
      }
    },
    "id": {
      "type": "Number",
      "required": true,
      "length": null,
      "precision": 32,
      "scale": 0,
      "id": 1,
      "postgresql": {
        "columnName": "id",
        "dataType": "integer",
        "dataLength": null,
        "dataPrecision": 32,
        "dataScale": 0,
        "nullable": "NO"
      }
    }
  }
}
```

###7. Add a script to discover and build models

Create [`discover-and-build.js`](/server/bin/discover-and-build.js) in the
[`bin` directory](/server/bin).

####Test the script

```
node server/bin/discover-and-build.js
```

You should see:

```
[ { email: 'foo@bar.com',
    createdat: Tue Jan 13 2015 11:51:00 GMT-0800 (PST),
    lastmodifiedat: Tue Jan 13 2015 11:51:00 GMT-0800 (PST),
    id: 1 },
  { email: 'baz@qux.com',
    createdat: Tue Jan 13 2015 11:51:00 GMT-0800 (PST),
    lastmodifiedat: Tue Jan 13 2015 11:51:00 GMT-0800 (PST),
    id: 2 } ]
```

> Your `createdat` and `lastmodifiedat` dates will be different.

The resulting objects are fully functional
[LoopBack models](/server/bin/discover-and-build.js#L7) and thus contain all the
features provided by LoopBack such as
[`find()`](/server/bin/discover-and-build.js#L10), etc.

###8. Conclusion

You've successfully implemented various PostgreSQL database features provided by LoopBack. See the [official documentation](http://docs.strongloop.com/display/LB/Defining+models) and [loopback-connector-postgresql](https://github.com/strongloop/loopback-connector-postgresql)
for more information.

---

- [Next tutorial][next-tutorial]
- [All tutorials][all-tutorials]

[all-tutorials]: https://github.com/strongloop/loopback-example
[explorer]: http://localhost:3000/explorer
[localhost]: http://localhost:3000
[next-tutorial]: https://github.com/strongloop/loopback-example-model-relations
