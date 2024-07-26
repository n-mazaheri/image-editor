import { useEffect, useState } from 'react';
import useCreateNft from '../../hooks/createNft';
import styles from './ipAsset.module.css';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { sepolia } from 'thirdweb/chains';
import { useSwitchActiveWalletChain } from 'thirdweb/react';
enum State {
  NOTSTARTED = 'NOTSTARTED',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  UNKOWN = 'UNKOWN',
}
export default function IPAsset() {
  let account = useActiveAccount();
  let userAddress = account?.address;
  let chain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  let { mintNFT, registerIPAsset, uploadImage } = useCreateNft();

  const [firstStep, setFirstStep] = useState<State>(State.NOTSTARTED);
  const [secondStep, setSecondStep] = useState<State>(State.NOTSTARTED);
  const [thirdStep, setThirdStep] = useState<State>(State.NOTSTARTED);
  const [link, setLink] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null | undefined>(null);
  const [id, setId] = useState<string | null | undefined>(null);

  function process() {
    setFirstStep(State.LOADING);
    uploadImage()
      .then((res: { link: string; uri: string }) => {
        setFirstStep(State.SUCCESS);
        setSecondStep(State.LOADING);
        setLink(res.link);
        mintNFT(res.uri)
          .then((res2: any) => {
            setTokenId(res2);
            setSecondStep(State.SUCCESS);
            setThirdStep(State.LOADING);
            registerIPAsset(res2, res.uri)
              .then((res3) => {
                setThirdStep(State.SUCCESS);
                setHash(res3?.hash);
                setId(res3?.id);
              })
              .catch((e) => {
                setThirdStep(State.ERROR);
              });
          })
          .catch(() => {
            setSecondStep(State.ERROR);
          });
      })
      .catch(() => {
        setFirstStep(State.ERROR);
      });
  }

  const [openModal, setOpenModal] = useState(false);
  const [showSpan, setShowSpan] = useState(false);
  return (
    <div>
      {openModal && (
        <ProcessModal
          setOpenModal={setOpenModal}
          firstStep={firstStep}
          secondStep={secondStep}
          thirdStep={thirdStep}
          link={link}
          tokenId={tokenId}
          hash={hash}
          id={id}
        />
      )}
      <div>
        <button
          onClick={async () => {
            if (!userAddress) {
              setShowSpan(true);
              setTimeout(() => {
                setShowSpan(false);
              }, 1000);

              return;
            }
            if (chain?.id != sepolia.id) {
              switchChain(sepolia)
                .then((res) => {
                  setOpenModal(true);
                  process();
                })
                .catch(() => {});
              return;
            }

            setOpenModal(true);
            process();
          }}
          className="toolboxButton"
        >
          IP Asset
        </button>
      </div>
      {showSpan && <div className={styles.error}>Connect wallet first!</div>}
    </div>
  );
}

function ProcessModal(props: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  firstStep: State;
  secondStep: State;
  thirdStep: State;
  tokenId: string | null;
  link: string | null;
  hash: string | null | undefined;
  id: string | null | undefined;
}) {
  return (
    <div id="myModal" className={styles.modal}>
      <div className={styles['modal-content']}>
        <span className={styles['close']} onClick={() => props.setOpenModal(false)}>
          &times;
        </span>
        <div className={styles.modalHeader}>Register Image as an IP Asset</div>
        <hr />
        <div className={styles.modalContent}>
          {' '}
          <div className={styles.child}>
            1- Upload Image To IPFS{' '}
            <span className={styles.state}>
              {props.firstStep == State.LOADING
                ? '   ....'
                : props.firstStep == State.ERROR
                ? '   ❌'
                : props.firstStep == State.SUCCESS
                ? '   ✅'
                : ''}
            </span>
            {props.link && (
              <a href={props.link!} style={{ marginLeft: 5 }} target="_blank">
                Image Link
              </a>
            )}
          </div>
          <div className={styles.child}>
            2- Create NFT token
            <span className={styles.state}>
              {props.secondStep == State.LOADING
                ? '   ....'
                : props.secondStep == State.ERROR
                ? '   ❌'
                : props.secondStep == State.SUCCESS
                ? '   ✅'
                : ''}
            </span>
            {props.tokenId && <span style={{ marginLeft: 5 }}>Token ID1: {props.tokenId?.toString()} </span>}
          </div>
          <div className={styles.child}>
            3- Register IP asset
            <span className={styles.state}>
              {props.thirdStep == State.LOADING
                ? '   ....'
                : props.thirdStep == State.ERROR
                ? '   ❌'
                : props.thirdStep == State.SUCCESS
                ? '   ✅'
                : ''}
              {props.hash ? (
                <div className={styles.detail}>Root IPA Transaction Hash: {props.hash}</div>
              ) : (
                <div>&nbsp;</div>
              )}
              {props.id ? <div className={styles.detail}>Root IPA Transaction id: {props.id}</div> : <div>&nbsp;</div>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
