import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import {
  Address,
  createThirdwebClient,
  getContract,
  prepareContractCall,
  sendTransaction,
  simulateTransaction,
  waitForReceipt,
} from 'thirdweb';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { viemAdapter } from 'thirdweb/adapters/viem';
import { custom, toHex } from 'viem';
import { useSelector } from 'react-redux';
import { selectImageHeight, selectImagePreview, selectImageType, selectImageWidth } from '../redux/slices/imageSlice';
import { upload } from 'thirdweb/storage';
import { useContext } from 'react';
import { CanvasContext } from '../contexts/canvasContext';

const useCreateNft = () => {
  let chain = useActiveWalletChain();
  let account = useActiveAccount();
  let userAddress = account?.address;
  let client = createThirdwebClient({ clientId: 'ccd77719917b46d2ceb86aa408e8f6af' });
  const { canvasRef, createDataUrl } = useContext(CanvasContext);
  const imageType = useSelector(selectImageType);
  const imageHeight = useSelector(selectImageHeight);
  const imageWidth = useSelector(selectImageWidth);
  const imagePreview = useSelector(selectImagePreview);

  const mintContractAbi = [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'customUri',
          type: 'string',
        },
      ],
      name: 'mint',
      outputs: [
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ] as any;
  async function mintNFT(uri: string) {
    if (chain && account) {
      const myContract = getContract({
        client,
        chain,
        address: '0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc',
        abi: mintContractAbi,
      });
      const transaction = prepareContractCall({
        contract: myContract,
        method: 'mint',
        params: [userAddress, uri],
      });

      const result = await sendTransaction({ transaction, account });
      const receipt = await waitForReceipt(result);

      const tokenId = Number(receipt?.logs?.[0].topics?.[3])?.toString();
      return tokenId;
    }
  }

  function ipfsToHttp(ipfsUrl: any) {
    const gateway = 'https://ipfs.io/ipfs/';
    const ipfsPath = ipfsUrl.replace('ipfs://', '');
    return gateway + ipfsPath;
  }
  function dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  }
  async function uploadImage() {
    let dataURL = null;
    if (canvasRef?.current) {
      if (imagePreview) {
        dataURL = await createDataUrl(imagePreview, imageWidth, imageHeight, imageType);
      } else {
        // Save the current canvas directly if no background image is present
        dataURL = canvasRef?.current.toDataURL({
          format: imageType,
          quality: 1.0,
        });
      }
    }
    let blob = dataURItoBlob(dataURL);
    const uris = await upload({ client, files: [new File([blob], 'image.' + imageType)] });
    return { link: ipfsToHttp(uris), uri: uris };
  }

  async function registerIPAsset(tokenId: string, uri: string) {
    if (chain && account) {
      let storyClient = await initializeStoryClient();

      const registeredIpAssetResponse = await storyClient?.ipAsset.register({
        nftContract: '0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc' as Address,
        tokenId,
        txOptions: { waitForTransaction: true },
        metadata: {
          metadataURI: uri,
          metadataHash: toHex('metadata-hash', { size: 32 }), // hash of IP metadata
          nftMetadataHash: toHex('metadata-hash', { size: 32 }), // hash of NFT metadata
        },
      });
      console.log(
        `Root IPA created at transaction hash ${registeredIpAssetResponse?.txHash}, IPA ID: ${registeredIpAssetResponse?.ipId}`
      );

      return { hash: registeredIpAssetResponse?.txHash, id: registeredIpAssetResponse?.ipId };
    }
  }

  const initializeStoryClient: () => Promise<StoryClient | undefined> = async () => {
    if (chain && account) {
      let client = createThirdwebClient({ clientId: 'ccd77719917b46d2ceb86aa408e8f6af' });
      const viemClientWallet = viemAdapter.walletClient.toViem({
        client,
        chain,
        account,
      });

      const config: StoryConfig = {
        transport: custom(viemClientWallet.transport),
        account: viemClientWallet.account,
        chainId: 'sepolia',
      };
      const storyClinet = StoryClient.newClient(config);
      return storyClinet;
    }
    return;
  };

  return { mintNFT, uploadImage, registerIPAsset, initializeStoryClient, client };
};

export default useCreateNft;
