function Advertising(props: any) {
  return (
    <section className="h-screen flex flex-col col-start-1 col-end-4 gap-[1%]">
      {props.children}
    </section>
  );
}

export default Advertising;
