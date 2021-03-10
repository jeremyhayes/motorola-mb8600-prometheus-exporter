import { HnapClient } from 'motorola-mb8600-client/client.js';
import Prometheus from 'prom-client';

export default async function collect() {
    const client = new HnapClient(
        process.env.MODEM_BASE_URL || 'http://192.168.42.1',
        !!process.env.MODEM_IGNORE_SSL
    );
    await client.login(
        process.env.MODEM_USERNAME || 'admin',
        process.env.MODEM_PASSWORD || 'motorola'
    );

    const statistics = await client.getConnectionData();

    statistics
        .downstream
        .forEach(x => {
            const labels = {
                channel: x.channel,
                channelId: x.channelId,
                modulation: x.modulation
            };
            downstreamFrequency
                .set(labels, x.frequency);
            downstreamPower
                .set(labels, x.power);
            downstreamSignalToNoise
                .set(labels, x.snr);
            downstreamCorrected
                .set(labels, x.corrected);
            downstreamUncorrected
                .set(labels, x.uncorrected);
            downstreamLockStatus
                .set(labels, x.lockStatus === 'Locked' ? 1 : 0);
        });

    statistics
        .upstream
        .forEach(x => {
            const labels = {
                channel: x.channel,
                channelId: x.channelId,
                modulation: x.channelType
            };
            upstreamFrequency
                .set(labels, x.frequency);
            upstreamPower
                .set(labels, x.power);
            upstreamSymbolRate
                .set(labels, x.symbolRate);
            upstreamLockStatus
                .set(labels, x.lockStatus === 'Locked' ? 1 : 0);
        });

    return Prometheus.register;
}

const labelNames = [
    'channel',
    'channelId',
    'modulation'
];

const downstreamFrequency = new Prometheus.Gauge({
    name: 'moto_downstream_channel_frequency',
    help: 'Downstream frequency (MHz)',
    labelNames
});
const downstreamPower = new Prometheus.Gauge({
    name: 'moto_downstream_channel_power_dbmv',
    help: 'Downstream power (dBmV)',
    labelNames
});
const downstreamSignalToNoise = new Prometheus.Gauge({
    name: 'moto_downstream_channel_signal_noise_ratio',
    help: 'Downstream signal-to-noise (dB)',
    labelNames
});
const downstreamCorrected = new Prometheus.Gauge({
    name: 'moto_downstream_channel_corrected_total',
    help: 'Downstream corrected symbols (total)',
    labelNames
});
const downstreamUncorrected = new Prometheus.Gauge({
    name: 'moto_downstream_channel_uncorrected_total',
    help: 'Downstream uncorrected symbols (total)',
    labelNames
});
const downstreamLockStatus = new Prometheus.Gauge({
    name: 'moto_downstream_channel_locked',
    help: 'Downstream lock status',
    labelNames
});

const upstreamPower = new Prometheus.Gauge({
    name: 'moto_upstream_channel_power_dbmv',
    help: 'Upstream power (dBmV)',
    labelNames
});
const upstreamFrequency = new Prometheus.Gauge({
    name: 'moto_upstream_channel_frequency',
    help: 'Upstream frequency (MHz)',
    labelNames
});
const upstreamSymbolRate = new Prometheus.Gauge({
    name: 'moto_upstream_channel_symbol_rate',
    help: 'Upstream symbol rate (Ksym/sec)',
    labelNames
});
const upstreamLockStatus = new Prometheus.Gauge({
    name: 'moto_upstream_channel_locked',
    help: 'Upstream lock status',
    labelNames
});
