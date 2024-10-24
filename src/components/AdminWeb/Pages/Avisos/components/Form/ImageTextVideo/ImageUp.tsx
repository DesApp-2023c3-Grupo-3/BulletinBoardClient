import * as React from 'react';
import { imageAPI } from '../../../../../../../services/image';
import { ROUTES_RELATIVE } from '../../../../../../../routes/route.relatives';
import Loader from '../../../../../components/Loader';
import { error } from 'console';

interface ImageUpProps {
  image: string;
  setImage: (newImage: string) => void;
}

function ImageUp({ image, setImage }: ImageUpProps) {
  let urlImg = '';

  const [loading, setLoading] = React.useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLoading(true);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      imageAPI
        .create(formData)
        .then((r) => {
          urlImg = `${ROUTES_RELATIVE.image.image}/${r?.data.id}/view`;
          setImage(urlImg);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al subir la imagen:', error);
          alert('Error al subir la imagen');
          setLoading(false);
        });
    }
  };

  return (
    <div className="bg-[#D9D9D9] rounded-2xl md:w-[330px] md:h-[300px] h-full relative flex justify-center">
      {loading ? (
        <div className="translate-y-[10%]">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="absolute top-2 right-[0.4rem]">
            {image && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setImage('');
                }}
              >
                {deleteImg}
              </button>
            )}
          </div>
          <div className="absolute bottom-3 right-3">
            <label>
              {image && updateImg}
              <input
                className="relative"
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div>
            {image ? (
              <div className="flex items-center justify-center md:w-[330px] md:h-[300px] h-[400px]">
                <img
                  src={image}
                  alt="Imagen cargada"
                  width="330"
                  height="300"
                  className={`rounded-b-[20px] md:w-[330px] md:h-[300px] h-full object-contain`}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center w-[330px] h-[300px]">
                {upImage(handleImageUpload)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUp;

const upImage = (handleImageUpload: any) => {
  return (
    <label>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="45"
        viewBox="0 0 36 45"
        fill="none"
        className="cursor-pointer"
      >
        <path
          d="M34 12.5V40.5C34 41.0304 33.7893 41.5391 33.4142 41.9142C33.0391 42.2893 32.5304 42.5 32 42.5H4C3.46957 42.5 2.96086 42.2893 2.58579 41.9142C2.21071 41.5391 2 41.0304 2 40.5V4.5C2 3.96957 2.21071 3.46086 2.58579 3.08579C2.96086 2.71071 3.46957 2.5 4 2.5H24M34 12.5H24V2.5M34 12.5L24 2.5M18 19.5V33.5M11 26.5H25"
          stroke="#545454"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </label>
  );
};

const updateImg = (
  <svg
    className="cursor-pointer"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M21.3333 2.66667V21.3333H2.66667V2.66667H21.3333ZM21.3333 0H2.66667C1.2 0 0 1.2 0 2.66667V21.3333C0 22.8 1.2 24 2.66667 24H21.3333C22.8 24 24 22.8 24 21.3333V2.66667C24 1.2 22.8 0 21.3333 0ZM14.8533 11.8133L10.8533 16.9733L8 13.52L4 18.6667H20L14.8533 11.8133Z"
      fill="#AFAFAF"
    />
  </svg>
);

const deleteImg = (
  <svg
    className="cursor-pointer"
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M8 19C7.20435 19 6.44129 18.6839 5.87868 18.1213C5.31607 17.5587 5 16.7956 5 16V8C5 7.20435 5.31607 6.44129 5.87868 5.87868C6.44129 5.31607 7.20435 5 8 5C8.26522 5 8.51957 4.89464 8.70711 4.70711C8.89464 4.51957 9 4.26522 9 4C9 3.73478 8.89464 3.48043 8.70711 3.29289C8.51957 3.10536 8.26522 3 8 3C6.67392 3 5.40215 3.52678 4.46447 4.46447C3.52678 5.40215 3 6.67392 3 8V16C3 17.3261 3.52678 18.5979 4.46447 19.5355C5.40215 20.4732 6.67392 21 8 21C8.26522 21 8.51957 20.8946 8.70711 20.7071C8.89464 20.5196 9 20.2652 9 20C9 19.7348 8.89464 19.4804 8.70711 19.2929C8.51957 19.1054 8.26522 19 8 19ZM15.71 15.71C15.8037 15.617 15.8781 15.5064 15.9289 15.3846C15.9797 15.2627 16.0058 15.132 16.0058 15C16.0058 14.868 15.9797 14.7373 15.9289 14.6154C15.8781 14.4936 15.8037 14.383 15.71 14.29L13.41 12L15.71 9.71C15.8983 9.5217 16.0041 9.2663 16.0041 9C16.0041 8.7337 15.8983 8.4783 15.71 8.29C15.5217 8.1017 15.2663 7.99591 15 7.99591C14.7337 7.99591 14.4783 8.1017 14.29 8.29L12 10.59L9.71 8.29C9.5217 8.1017 9.2663 7.99591 9 7.99591C8.7337 7.99591 8.4783 8.1017 8.29 8.29C8.1017 8.4783 7.99591 8.7337 7.99591 9C7.99591 9.2663 8.1017 9.5217 8.29 9.71L10.59 12L8.29 14.29C8.19627 14.383 8.12188 14.4936 8.07111 14.6154C8.02034 14.7373 7.9942 14.868 7.9942 15C7.9942 15.132 8.02034 15.2627 8.07111 15.3846C8.12188 15.5064 8.19627 15.617 8.29 15.71C8.38296 15.8037 8.49356 15.8781 8.61542 15.9289C8.73728 15.9797 8.86799 16.0058 9 16.0058C9.13201 16.0058 9.26272 15.9797 9.38458 15.9289C9.50644 15.8781 9.61704 15.8037 9.71 15.71L12 13.41L14.29 15.71C14.383 15.8037 14.4936 15.8781 14.6154 15.9289C14.7373 15.9797 14.868 16.0058 15 16.0058C15.132 16.0058 15.2627 15.9797 15.3846 15.9289C15.5064 15.8781 15.617 15.8037 15.71 15.71ZM16 3C15.7348 3 15.4804 3.10536 15.2929 3.29289C15.1054 3.48043 15 3.73478 15 4C15 4.26522 15.1054 4.51957 15.2929 4.70711C15.4804 4.89464 15.7348 5 16 5C16.7956 5 17.5587 5.31607 18.1213 5.87868C18.6839 6.44129 19 7.20435 19 8V16C19 16.7956 18.6839 17.5587 18.1213 18.1213C17.5587 18.6839 16.7956 19 16 19C15.7348 19 15.4804 19.1054 15.2929 19.2929C15.1054 19.4804 15 19.7348 15 20C15 20.2652 15.1054 20.5196 15.2929 20.7071C15.4804 20.8946 15.7348 21 16 21C17.3261 21 18.5979 20.4732 19.5355 19.5355C20.4732 18.5979 21 17.3261 21 16V8C21 6.67392 20.4732 5.40215 19.5355 4.46447C18.5979 3.52678 17.3261 3 16 3Z"
      fill="#AFAFAF"
    />
  </svg>
);
