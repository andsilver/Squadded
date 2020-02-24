import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

Sentry.init({
	dsn: `https://${process.env.SENTRY_KEY}@sentry.io/${process.env.SENTRY_PROJECT_ID}`,
	integrations: [new Integrations.Vue({ Vue, attachProps: true })],
});
