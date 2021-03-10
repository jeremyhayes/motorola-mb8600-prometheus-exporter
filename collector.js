import Prometheus from 'prom-client';

export default async function collect() {

    new Prometheus.Counter({
        name: 'metric_foo',
        help: 'some help text'
    }).inc(3.50);
    new Prometheus.Counter({
        name: 'metric_bar',
        help: 'some help text'
    }).inc(42);

    return Prometheus.register;
}
