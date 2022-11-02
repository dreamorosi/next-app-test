import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";

export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts
  /* const res = await fetch('https://.../posts')
  const posts = await res.json() */

  // Get the paths we want to pre-render based on posts
  const paths = Array.apply(null, Array(10))
    .map(function (_, i) {
      return i;
    })
    .map((idx) => ({
      params: { id: (idx + 1).toString() },
    }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

type Pokemon = {
  name: string;
  order: number;
  sprites: { front_default: string };
  weight: number;
  types: { slot: number; type: { name: string; url: string } }[];
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params?.id}/`);
  const pokemon: Pokemon = await res.json();

  // Pass post data to the page via props
  return { props: { pokemon } };
};

type PokemonPageProps = {
  children?: React.ReactNode;
  pokemon: Pokemon;
};

const PokemonPage: React.FC<PokemonPageProps> = ({ pokemon }) => {
  return (
    <>
      <Image
        src={pokemon.sprites.front_default}
        alt={`Sprite of ${pokemon.name}`}
        width={125}
        height={125}
      />
      <p>Name: {pokemon.name}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>
        Types:{" "}
        {pokemon.types.map((type) => (
          <span key={type.slot}>{type.type.name} </span>
        ))}
      </p>
    </>
  );
};

export default PokemonPage;
