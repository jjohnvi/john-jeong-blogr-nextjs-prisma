import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      thisIsTheParamValueForDerp: params.derp, //hellosir!,
    },
  };
};

const Tastic = (props) => {
  return (
    <div>
      <p>From derptastic!!!</p>
      props.thisIsTheParamValueForDerp:
      <h1>{props.thisIsTheParamValueForDerp}</h1>
    </div>
  );
};

export default Tastic;
