import { promises as fs } from 'fs';
import { resolve } from 'path';
import { getEnvAssetsPath } from './config';
import type { ICertificate } from '@scrapoxy/common';


export class InstallScriptBuilder {
    private readonly rootPath: string;

    constructor(private readonly certificate: ICertificate) {
        this.rootPath = resolve(
            getEnvAssetsPath(),
            'proxy'
        );
    }

    async build(): Promise<string> {
        const
            certificateKey = this.writeFileFromString(
                this.certificate.key,
                '/root/certificate.key'
            ),
            certificatePem = this.writeFileFromString(
                this.certificate.cert,
                '/root/certificate.pem'
            );
        const [
            proxyupSh,
        ] = await Promise.all([
            this.writeFileFromFile(
                'proxyup.sh',
                '/etc/init.d/proxyup.sh'
            ),
        ]);

        return [
            '#!/bin/bash',
            'sudo apt-get update',
            'sudo apt-get remove -y unattended-upgrades',
            'sudo apt-get install -y ca-certificates curl gnupg',
            'sudo mkdir -p /etc/apt/keyrings',
            'sudo apt-get update',
            'architecture=""',
            'case $(uname -m) in',
            'x86_64) architecture="amd64" ;;',
            'arm) architecture=arm64 ;;',
            'esac',
            'curl https://jmaitrehenrycdn.blob.core.windows.net/scrapoxygo/proxy-linux-$architecture -o /root/proxy',
            ...proxyupSh,
            ...certificatePem,
            ...certificateKey,
            'sudo chmod a+x /root/proxy',
            'sudo chmod a+x /etc/init.d/proxyup.sh',
            'sudo update-rc.d proxyup.sh defaults',
            'sudo /etc/init.d/proxyup.sh start',
        ].join('\n');
    }

    private writeFileFromString(
        data: string, destination: string
    ): string[] {
        return [
            `cat << 'EOF' | sudo tee ${destination} > /dev/null`, data, 'EOF',
        ];
    }

    private async writeFileFromFile(
        filename: string, destination: string
    ): Promise<string[]> {
        const source = resolve(
            this.rootPath,
            filename
        );
        const data = await fs.readFile(source);

        return this.writeFileFromString(
            data.toString(),
            destination
        );
    }
}
