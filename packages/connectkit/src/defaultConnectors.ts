import { CreateConnectorFn } from 'wagmi';
import {
  injected,
  walletConnect,
  coinbaseWallet,
  CoinbaseWalletParameters,
  safe,
} from '@wagmi/connectors';

type DefaultConnectorsProps = {
  app: {
    name: string;
    icon?: string;
    description?: string;
    url?: string;
  };
  walletConnectProjectId?: string;
  coinbaseWalletPreference?: CoinbaseWalletParameters<'4'>['preference'];
};

const defaultConnectors = ({
  app,
  walletConnectProjectId,
  coinbaseWalletPreference,
}: DefaultConnectorsProps): CreateConnectorFn[] => {
  const hasAllAppData = app.name && app.icon && app.description && app.url;
  const shouldUseSafeConnector =
    !(typeof window === 'undefined') && window?.parent !== window;

  const connectors: CreateConnectorFn[] = [];

  // If we're in an iframe, include the SafeConnector
  if (shouldUseSafeConnector) {
    connectors.push(
      safe({
        allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      })
    );
  }

  // Add the rest of the connectors
  connectors.push(
    injected({ target: 'metaMask' }),
    coinbaseWallet({
      appName: app.name,
      appLogoUrl: app.icon,
      overrideIsMetaMask: false,
      preference: coinbaseWalletPreference,
    })
  );

  if (walletConnectProjectId) {
    connectors.push(
      walletConnect({
        showQrModal: false,
        projectId: walletConnectProjectId,
        relayUrl: 'wss://relay.walletconnect.org',
        metadata: hasAllAppData
          ? {
              name: app.name,
              description: app.description!,
              url: app.url!,
              icons: [app.icon!],
            }
          : undefined,
      })
    );
  }
  /*
  connectors.push(
    injected({
      shimDisconnect: true,
    })
  );
  */

  return connectors;
};

export default defaultConnectors;
