nor-newrelic
============

Simple Node.js utility to record deployments in New Relic.

### Standalone CLI usage

```
npm install -g nor-newrelic
nor-newrelic --api-key='your-key-here' --app-name='Your App Name' --description='First test deployment message' --user='jhh' deploy
```

### Usage with config files

```
npm install -g nor-newrelic
nor-newrelic --api-key='your-key-here' --app-name='Your App Name' --user='jhh' save
nor-newrelic --app-name='Your App Name' deploy
```

### Using with Node.js

```javascript
require('nor-newrelic').deployment({
	'app_name': 'Your App Name',
	'description': 'Your description',
	'user': 'jhh'
}).then(function() {
	console.log('success');
}).fail(function(err) {
	console.log('Error: ' + err);
}).done();
```
