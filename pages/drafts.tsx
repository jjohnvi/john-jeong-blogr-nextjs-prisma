import React from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";

/**
 * getServerSideProps only runs on server-side and never runs on the browser. If a page uses getServerSideProps then:
 * when you request this page directly, get serversideprops runs at request time, and this page will be pre-rendered with the returned props.
 * When you request this page on a client-side page transitions through next/link or next/router, Next.Js sends an API request to the server, which runs getServerSideProps.
 * getServerSideProps returns JSON which will be used to render the page.
 * getServerSidePropls can only be exported from a page, you can't export it from non-page files. You must export getServerSideProps as a standalone function -
 * it will not work if you add getServerSideProps as a property of the page component.
 *
 * Props will be passed to the page component and can be viewed on the client-side in the initial HTML. This is to allow the page to be hydrated correctly. Make sure that you don't pass
 * any sensitive information that shouldn't be available on the client in `props`.
 *
 * You should only use getServerSideProps only if you need to render a page whose data must be fetched at a request time.
 * Here, it's important because you need to be authorized first. If you're not authorized, there is no point in fetching the data.
 * If you do not need to render the data during the request, then fetching data on the client side or getStaticProps would probably be the better option.
 */

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: PostProps[];
};

// const Drafts: React.FC<Props> = (props) => {
const Drafts = (props: Props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {props.drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>
        {`
          .post {
            background: var(--geist-background);
            transition: box-shadow 0.1s ease-in;
          }

          .post:hover {
            box-shadow: 1px 1px 3px #aaa;
          }

          .post + .post {
            margin-top: 2rem;
          }
        `}
      </style>
    </Layout>
  );
};

export default Drafts;
