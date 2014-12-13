/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

module.exports = {
	"nr": require('./nr.js'),
	"init": require('./init.js'),
	"fcall": require('./fcall.js'),
	"deployment": require('./deployment.js'),
	"noticeError": require('./notice_error.js'),
	"wtfcall": require('./web_transaction_fcall.js'),
	"btfcall": require('./background_transaction_fcall.js'),
	"recordMetric": require('./record_metric.js'),
	"incrementMetric": require('./increment_metric.js')
};

/* EOF */
