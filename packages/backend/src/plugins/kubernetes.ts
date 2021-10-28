import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend'
import { PluginEnvironment } from '../types'

export default async function createPlugin({
    logger,
    config,
}: PluginEnvironment) {
    const { router } = await KubernetesBuilder.createBuilder({
        logger,
        config,
    }).build();
    return router
}