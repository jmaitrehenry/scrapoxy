import * as fs from 'fs';
import {
    AzureApi,
    ConnectorAzureModule,
    IConnectorAzureConfig,
} from '@scrapoxy/backend-connectors';
import { Agents } from '@scrapoxy/backend-sdk';
import { testConnector } from '@scrapoxy/backend-test-sdk';
import {
    AZURE_DEFAULT_LOCATION,
    AZURE_DEFAULT_STORAGE_ACCOUNT_TYPE,
    AZURE_DEFAULT_VM_SIZE,
    CONNECTOR_AZURE_TYPE,
} from '@scrapoxy/common';


describe(
    'Connector Provider - Azure',
    () => {
        const
            agents = new Agents(),
            suffix = Math.floor(Math.random() * 1000000000)
                .toString(10);
        const
            connectorConfig: IConnectorAzureConfig = {
                location: AZURE_DEFAULT_LOCATION,
                port: 3128,
                resourceGroupName: `spxtest_${suffix}_rg`,
                vmSize: AZURE_DEFAULT_VM_SIZE,
                storageAccountType: AZURE_DEFAULT_STORAGE_ACCOUNT_TYPE,
                prefix: `spxtest${suffix}`,
                imageResourceGroupName: `spxtest_image_${suffix}_rg`,
                useSpotInstances: false,
            },
            credentialConfigData = fs.readFileSync('packages/backend/test-connectors/src/assets/azure/credentials.json');
        const credentialConfig = JSON.parse(credentialConfigData.toString());

        afterAll(() => {
            agents.close();
        });

        testConnector(
            {
                beforeAll, afterAll, it, expect,
            },
            agents,
            [
                ConnectorAzureModule,
            ],
            CONNECTOR_AZURE_TYPE,
            credentialConfig,
            connectorConfig,
            {}
        );

        it(
            'should validate the uninstallation',
            async() => {
                const api = new AzureApi(
                    credentialConfig.tenantId,
                    credentialConfig.clientId,
                    credentialConfig.secret,
                    credentialConfig.subscriptionId,
                    agents
                );
                await expect(api.getResourceGroup(connectorConfig.resourceGroupName))
                    .rejects
                    .toThrowError(/Resource .* could not be found./);

                await expect(api.getResourceGroup(connectorConfig.imageResourceGroupName))
                    .rejects
                    .toThrowError(/Resource .* could not be found./);
            }
        );
    }
);
