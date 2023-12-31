export default function AdvertisingImage({ payload }: { payload: string }) {
  return (
    <article className="flex justify-center items-center bg-[#E3E3E3] h-[85%] w-[85%] rounded-[10%] text-center overflow-hidden">
      <img
        className="max-w-full max-h-full "
        src={payload}
        alt="Imagen de aviso"
      />
    </article>
  );
}
