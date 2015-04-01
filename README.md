#loopback-example-postgresql

Basic instructions:

```
git clone https://github.com/strongloop/loopback-example-postgresql.git
cd loopback-example-postgresql
npm install
```

Then run any script in `server/bin` (for example, `node server/bin/discover-schema.js`).

##Prerequisites

- Follow [Getting started with LoopBack](http://docs.strongloop.com/display/LB/Getting+started+with+LoopBack)
- Read [LoopBack models](http://docs.strongloop.com/display/LB/Defining+models)

##Create the application

Enter this to create a new application:

```
$ slc loopback loopback-example-postgresql
$ cd loopback-example-postgresql
```

Follow the prompts to use the following:

- Name: `loopback-example-postgresql`
- Directory to contain the project: `loopback-example-postgresql`

##Install the connector

```
npm install --save loopback-connector-postgresql
```

##Configure the data source

Enter this to create a new data source:

```
slc loopback:datasource accountDs
```

Follow the prompts to use the following:
- Datasource: `accountDs`
- Connector: `PostgresSQL`

Add the [datasource configurations](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/datasources.json#L9-L13) to
[`server/datasources.json`](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/datasources.json).

NOTE: StrongLoop provides a demo server for convenience sake, but feel free to use your own database server.

##Add a model

Enter the following to create a model:

```
slc loopback:model Account
```

Follow the prompts to use the following:

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

##Add a script to migrate data

Create a directory for to store scripts.

```
mkdir server/bin
```

NOTE: `bin` is a directory name commonly used for executable files on unix and unix-like systems.

Create [`automigrate.js`](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin/automigrate.js) inside the
[`bin`](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin) directory.

NOTE:  [`datasSource.automigrate()`](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin/automigrate.js) requires INSERT object, CREATE DDL, and DROP DDL rights to execute properly.

###Test the script

**WARNING**: [`dataSource.automigrate()`](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin/automigrate.js#L18) creates a new table in the database if it doesn't exist. If the table already exists, it will be **DESTROYED** and **ALL** existing data will be dropped. If you want to keep the existing data, use `datasource.autoupdate()` instead.

```
node server/bin/automigrate.js
```

This script creates [two models](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin/automigrate.js#L5-L14) in the
[specified data source](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin/automigrate.js#L16).

You can view the newly inserted data using built-in [API explorer](http://docs.strongloop.com/display/LB/Use+API+Explorer). Start the application with `slc run` and browse to [`localhost:3000/explorer`][explorer] to inspect the data.

##Add a script to discover a schema

*Discovery* is the process of reverse engineering a LoopBack model from an existing database schema.

Create [`discover-schema.js`](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin/discover-schema.js) inside the
[`bin` directory](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin).

###Test the script

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

##Add a script to discover and build models

Create [`discover-and-build.js`](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin/discover-and-build.js) in the
[`bin` directory](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin).

###Test the script

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

NOTE: Your `createdat` and `lastmodifiedat` dates will be different.

The resulting objects are fully functional
[LoopBack models](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin/discover-and-build.js#L7) and thus contain all the
features provided by LoopBack such as
[`find()`](https://github.com/strongloop/loopback-example-postgresql/blob/master/server/bin/discover-and-build.js#L10), etc.

---

- [Next tutorial][next-tutorial]
- [All tutorials][all-tutorials]

[all-tutorials]: https://github.com/strongloop/loopback-example
[explorer]: http://localhost:3000/explorer
[localhost]: http://localhost:3000
[next-tutorial]: https://github.com/strongloop/loopback-example-model-relations
