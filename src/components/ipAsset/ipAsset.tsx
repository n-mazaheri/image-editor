import { useEffect, useState } from 'react';
import useCreateNft from '../../hooks/createNft';
import styles from './ipAsset.module.css';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { sepolia } from 'thirdweb/chains';
import { useSwitchActiveWalletChain } from 'thirdweb/react';

export default function IPAsset() {
  let account = useActiveAccount();
  let userAddress = account?.address;
  let chain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const [openModal, setOpenModal] = useState(false);
  const [showSpan, setShowSpan] = useState(false);
  return (
    <div>
      {openModal && <ProcessModal setOpenModal={setOpenModal} />}
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
                })
                .catch(() => {});
              return;
            }
            setOpenModal(true);
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

function ProcessModal(props: { setOpenModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  let { mintNFT, registerIPAsset, uploadImage } = useCreateNft();
  enum State {
    NOTSTARTED = 'NOTSTARTED',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
  }
  const [firstStep, setFirstStep] = useState<State>(State.NOTSTARTED);
  const [secondStep, setSecondStep] = useState<State>(State.NOTSTARTED);
  const [thirdStep, setThirdStep] = useState<State>(State.NOTSTARTED);
  const [link, setLink] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);

  useEffect(() => {
    setFirstStep(State.LOADING);
    uploadImage()
      .then((link: string) => {
        setFirstStep(State.SUCCESS);
        setSecondStep(State.LOADING);
        setLink(link);
        mintNFT()
          .then((res) => {
            console.log(res);
            setTokenId(res);
            setSecondStep(State.SUCCESS);
            setThirdStep(State.LOADING);
            registerIPAsset(res)
              .then(() => {
                setThirdStep(State.SUCCESS);
              })
              .catch(() => {
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
  }, []);

  console.log(tokenId);
  return (
    <div id="myModal" className={styles.modal}>
      <div className={styles['modal-content']}>
        <span className={styles['close']} onClick={() => props.setOpenModal(false)}>
          &times;
        </span>
        <div className={styles.modalHeader}>Register Image a IP Asset</div>
        <hr />
        <div className={styles.modalContent}>
          {' '}
          <div className={styles.child}>
            1- Upload Image To IPFS{' '}
            <span className={styles.state}>
              {firstStep == State.LOADING
                ? '   ....'
                : firstStep == State.ERROR
                ? '   ❌'
                : firstStep == State.SUCCESS
                ? '   ✅'
                : ''}
            </span>
            {link && (
              <a href={link!} style={{ marginLeft: 5 }} target="_blank">
                Image Link
              </a>
            )}
          </div>
          <div className={styles.child}>
            2- Create NFT token
            <span className={styles.state}>
              {secondStep == State.LOADING
                ? '   ....'
                : secondStep == State.ERROR
                ? '   ❌'
                : secondStep == State.SUCCESS
                ? '   ✅'
                : ''}
            </span>
            {tokenId && <span style={{ marginLeft: 5 }}>Token ID1: {tokenId?.toString()} </span>}
          </div>
          <div className={styles.child}>
            3- Register IP asset
            <span className={styles.state}>
              {thirdStep == State.LOADING
                ? '   ....'
                : thirdStep == State.ERROR
                ? '   ❌'
                : thirdStep == State.SUCCESS
                ? '   ✅'
                : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
