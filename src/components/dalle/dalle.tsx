import { useState } from 'react';
import styles from './dalle.module.css';
import { useDispatch } from 'react-redux';
import { setImagePriview, setImageType } from '../../redux/slices/imageSlice';

export default function Dalle() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      {' '}
      {openModal && <PromptModal setOpenModal={setOpenModal} />}
      <button onClick={() => setOpenModal(true)} className="toolboxButton">
        Generate Image(AI)
      </button>
    </>
  );
}

function PromptModal(props: { setOpenModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* const ai = new OpenAI({
    apiKey: process.env['REACT_APP_OPENAI'],
    dangerouslyAllowBrowser: true,
  });

  const generateImage = async () => {
    const res = await ai.images.generate({
      prompt: prompt,
      model: 'dall-e-2',
      n: 1,
      size: '1024x1024',
    });
    console.log(res.data);
  };
*/

  const generateError = (response: Response) => {
    let errorMessage = 'An error occurred while fetching the image.';
    if (response.status >= 400 && response.status < 500) {
      errorMessage = `Client error: ${response.statusText} (Code: ${response.status})`;
    } else if (response.status >= 500) {
      errorMessage = `Server error: ${response.statusText} (Code: ${response.status})`;
    }
    return errorMessage;
  };

  const generateImage = async () => {
    setError(null);
    setLoading(true);
    const apiKey = process.env['REACT_APP_STABLE'];
    const url = 'https://stablediffusionapi.com/api/v3/text2img';

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: apiKey, prompt: prompt }),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.status != 'error') {
          setTimeout(async function () {
            const response2 = await fetch(data.fetch_result, requestOptions);
            if (response2.ok) {
              const data2 = await response2.json();
              console.log(data2);
              if (data2.status == 'success') {
                const resUrl = data2.output[0];
                console.log(resUrl);
                setImageUrl(resUrl);
                setLoading(false);
              } else {
                setLoading(false);
                setError('There is an error');
              }
            } else {
              let errorMessage = generateError(response2);
              setError(errorMessage);
              setLoading(false);
            }
          }, 5000);
        } else {
          setLoading(false);
          if (data?.message?.prompt) {
            setError(data?.message?.prompt);
          }
          setError(data.message);
        }
      } else {
        let errorMessage = generateError(response);
        setError(errorMessage);
        setLoading(false);
      }
    } catch (_error: any) {
      console.error('Error generating image:', _error);
      setError(_error.message);
      setLoading(false);
    }
  };
  const [prompt, setPrompt] = useState('');
  const dispatch = useDispatch();

  const handleImageFromUrl = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();

      // Get image type from blob type
      const imageType = blob.type.split('/')[1] || 'png';
      dispatch(setImageType(imageType));

      const reader = new FileReader();
      reader.onloadend = () => {
        // Dispatch the image preview data to the Redux store
        dispatch(setImagePriview(reader.result as string));
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <div id="myModal" className={styles.modal}>
      <div className={styles['modal-content']}>
        <span className={styles['close']} onClick={() => props.setOpenModal(false)}>
          &times;
        </span>
        <div className={styles.modalHeader}>Generate Image with DALLE AI Model</div>
        <hr />
        <div className={styles.inside}>
          <textarea
            placeholder="Description of image you want to create"
            onChange={(e) => setPrompt(e.target.value)}
            rows={10}
            cols={50}
          />
          {loading ? (
            <img src="loading.gif" style={{ width: '3rem' }}></img>
          ) : (
            <button onClick={generateImage} className={styles.button}>
              Generate the Image
            </button>
          )}
          {error && <div className={styles.error}>{error}</div>}

          {imageUrl && (
            <div>
              <img src={imageUrl} style={{ width: '10rem' }}></img>{' '}
              <div>
                <button
                  onClick={() => {
                    handleImageFromUrl(imageUrl);
                  }}
                  className={styles.button}
                >
                  Load Image in Canvas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
